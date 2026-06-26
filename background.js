const WORKER_URL = 'https://youtubehelper.banshk.workers.dev';


// CAPTURE_TAB은 빠른 응답이라 onMessage 유지
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CAPTURE_TAB') {
    chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 85 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ dataUrl });
      }
    });
    return true;
  }
});

// ANALYZE_SCREEN: 포트 기반 통신 (MV3 service worker 유휴 종료로 인한 메시지 유실 방지)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'ytai-analyze') return;

  port.onMessage.addListener(async (message) => {
    if (message.type !== 'ANALYZE_SCREEN') return;

    console.log('[ytai] 요청 수신:', message.userRequest, '스냅샷:', (message.pageSnapshot ?? []).length, '개');

    try {
      const result = await analyze(message.userRequest, message.pageSnapshot ?? [], port.sender.tab);
      console.log('[ytai] 완료:', result);
      port.postMessage({ type: 'ANALYSIS_RESULT', result });
    } catch (e) {
      console.error('[ytai] 실패:', e.message);
      port.postMessage({ type: 'ANALYSIS_ERROR', error: e.message });
    }
  });
});

async function analyze(userRequest, snapshot, tab) {
  if (!tab) throw new Error('탭 정보 없음');

  const url = tab.url ?? '';
  let pageType = 'main';
  if (url.includes('/watch')) pageType = 'video';
  else if (url.includes('/@') || url.includes('/channel/') || url.includes('/c/')) pageType = 'channel';
  else if (url.includes('/feed/library')) pageType = 'library';
  else if (url.includes('/results')) pageType = 'search';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const result = await callClaude(userRequest, pageType, snapshot, controller.signal);
    clearTimeout(timer);
    return result;
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('시간 초과. 다시 시도해주세요.');
    throw e;
  }
}

async function callClaude(userRequest, pageType, snapshot, signal) {
  const pageContext = {
    main:    '유튜브 메인(홈) 화면. 왼쪽 사이드바에 홈/Shorts/구독/보관함 등 있음.',
    video:   '영상 시청 화면. 플레이어 하단에 재생/볼륨/자막/설정/전체화면 컨트롤. 영상 제목 아래에 좋아요/싫어요/공유/저장 버튼. 재생목록 저장은 반드시 "저장" 버튼 사용. 절대 보관함(library)으로 안내 금지.',
    channel: '채널 페이지. 상단 탭에 홈/동영상/재생목록/커뮤니티 등.',
    library: '보관함 화면. 재생목록/나중에 볼 동영상/시청 기록 등.',
    search:  '검색 결과 화면.',
  };

  // 스냅샷을 텍스트로 포맷 (구역 포함)
  const snapshotText = snapshot.length > 0
    ? snapshot.map(e => `"${e.t}"[${e.area ?? '메인'}]`).join(' | ')
    : '(정보 없음)';

  const prompt = `당신은 노인 한국어 사용자의 유튜브 이용을 단계별로 돕는 AI입니다.

현재 페이지: ${pageContext[pageType] ?? '유튜브 화면'}

=== 화면에 실제로 보이는 클릭 가능한 요소들 ===
${snapshotText}

⚠️ 핵심 규칙:
1. element_text는 반드시 위 "화면에 실제로 보이는 요소" 목록에서 그대로 복사 — 절대 직접 만들지 말 것
2. 목록에 없는 텍스트를 element_text에 넣으면 작동 안 함
3. element_type은 의미 분류: "play","volume","subtitles","settings","fullscreen","theater","next_video","miniplayer","search","like","dislike","subscribe","save","share","more_actions","home","subscriptions","library","history","shorts","playlists_tab" 또는 null
4. 줄마다 JSON 객체 하나 (배열/중첩 절대 금지)
5. 사용자가 "볼륨"이라 해도 스냅샷에 "음소거"가 있으면 element_text는 "음소거"로 입력

형식: {"instruction":"한국어 안내문","element_text":"위목록텍스트","element_type":"타입","target_label":"표시라벨"}

예시:
볼륨 조절:
{"instruction":"볼륨 버튼을 클릭하세요.","element_text":"볼륨","element_type":"volume","target_label":"볼륨"}

재생목록에 저장 (영상 화면):
{"instruction":"저장 버튼을 클릭하세요.","element_text":"저장","element_type":"save","target_label":"저장"}
{"instruction":"추가할 재생목록을 선택하세요.","element_text":null,"element_type":null,"target_label":null}

채널 재생목록 보기:
{"instruction":"채널 이름을 클릭하세요.","element_text":null,"element_type":"subscribe","target_label":"채널"}
{"instruction":"재생목록 탭을 클릭하세요.","element_text":"재생목록","element_type":"playlists_tab","target_label":"재생목록"}

요소를 찾을 수 없을 때:
{"instruction":"해당 기능을 찾을 수 없어요.","element_text":null,"element_type":null,"target_label":null}

사용자 요청: "${userRequest}"`;

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }]
  };

  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text?.trim() ?? '';
  console.log('[ytai] Claude 응답:', text);

  const steps = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('{') && line.endsWith('}'))
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(Boolean)
    .map(s => ({
      instruction: s.instruction ?? '안내를 불러오지 못했어요.',
      element_text: s.element_text ?? null,
      element_type: s.element_type ?? null,
      target_label: s.target_label ?? null,
    }));

  if (steps.length === 0) throw new Error('응답 파싱 실패: ' + text.slice(0, 100));

  return { steps };
}
