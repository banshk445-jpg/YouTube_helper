const WORKER_URL = 'https://youtubehelper.banshk.workers.dev';



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
  else if (url.includes('/shorts')) pageType = 'shorts';
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

// 프롬프트·모델·토큰 한도는 Worker(worker/src/index.js)에 있다.
// 여기서 보내면 클라이언트가 조작할 수 있어서 프록시가 공개 API가 되어버린다.
async function callClaude(userRequest, pageType, snapshot, signal) {
  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({ userRequest, pageType, snapshot })
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? `AI 서버 오류 (${response.status})`);
  if (!data?.steps?.length) throw new Error('응답을 이해하지 못했어요. 다시 시도해주세요.');

  console.log('[ytai] 단계:', data.steps.length, '개');
  return { steps: data.steps };
}

