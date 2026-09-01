const t = (key) => chrome.i18n.getMessage(key);
const YTAI_LANG = chrome.i18n.getUILanguage().startsWith('ko') ? 'ko' : 'en';
// 스냅샷의 영역 라벨도 프롬프트에 그대로 들어가므로 UI 언어에 맞춘다.
const AREA = YTAI_LANG === 'en'
  ? { main: 'main', player: 'player', sidebar: 'sidebar', header: 'header', right: 'right' }
  : { main: '메인', player: '플레이어', sidebar: '사이드바', header: '헤더', right: '우측' };

// Prevent double injection
if (window.__ytAiHelperLoaded) {
  // already loaded
} else {
  window.__ytAiHelperLoaded = true;
  initHelper();
}

function initHelper() {
  createFloatingButton();
  createHelperPanel();

}

// ─── Floating button ─────────────────────────────────────────────────────────

function createFloatingButton() {
  const btn = document.createElement('div');
  btn.id = 'ytai-btn';
  btn.innerHTML = `<span class="ytai-btn-icon"></span><span class="ytai-btn-label">${t('floatingBtnLabel')}</span>`;
  btn.addEventListener('click', togglePanel);
  document.body.appendChild(btn);
}

// ─── Helper panel (voice + chat) ─────────────────────────────────────────────

function createHelperPanel() {
  const panel = document.createElement('div');
  panel.id = 'ytai-panel';
  panel.innerHTML = `
    <div class="ytai-panel-header">
      <span>${t('panelHeaderTitle')}</span>
      <button class="ytai-close-btn" id="ytai-panel-close">✕</button>
    </div>
    <div class="ytai-panel-body" id="ytai-panel-body">
      <div class="ytai-autoclick-row">
        <span class="ytai-autoclick-label">${t('autoClickLabel')}</span>
        <label class="ytai-switch">
          <input type="checkbox" id="ytai-autoclick-chk">
          <span class="ytai-slider"></span>
        </label>
      </div>

      <div class="ytai-quick-grid">
        <button class="ytai-quick-btn" data-type="play" data-label="${t('quickPlay')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21"/></svg>
          <span>${t('quickPlay')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="volume" data-label="${t('quickVolume')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/></svg>
          <span>${t('quickVolume')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="subtitles" data-label="${t('quickSubtitles')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="11" x2="11" y2="11"/><line x1="13" y1="11" x2="17" y2="11"/><line x1="7" y1="15" x2="10" y2="15"/></svg>
          <span>${t('quickSubtitles')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="fullscreen" data-label="${t('quickFullscreen')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          <span>${t('quickFullscreen')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="next_video" data-label="${t('quickNext')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,4 15,12 5,20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          <span>${t('quickNext')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="like" data-label="${t('quickLike')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          <span>${t('quickLike')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="save" data-label="${t('quickSave')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>${t('quickSave')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="search" data-label="${t('quickSearch')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>${t('quickSearch')}</span>
        </button>
        <button class="ytai-quick-btn" data-type="home" data-label="${t('quickHome')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          <span>${t('quickHome')}</span>
        </button>
      </div>
      <div class="ytai-or">${t('orSpeakOrType')}</div>
      <button id="ytai-voice-btn" class="ytai-voice-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        <span>${t('voiceBtnLabel')}</span>
      </button>
      <div id="ytai-voice-status" class="ytai-voice-status"></div>
      <div class="ytai-or">${t('orText')}</div>
      <textarea id="ytai-input" placeholder="${t('inputPlaceholder')}" rows="3"></textarea>
      <button id="ytai-send-btn" class="ytai-send-btn">${t('sendBtnLabel')}</button>
      <div id="ytai-loading" class="ytai-loading" style="display:none">
        <div class="ytai-spinner"></div>
        <span>${t('loadingText')}</span>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 자동 클릭 토글 초기화
  chrome.storage.local.get('autoClick', (data) => {
    _autoClick = !!data.autoClick;
    document.getElementById('ytai-autoclick-chk').checked = _autoClick;
  });
  document.getElementById('ytai-autoclick-chk').addEventListener('change', (e) => {
    _autoClick = e.target.checked;
    chrome.storage.local.set({ autoClick: _autoClick });
  });

  // 퀵액션 버튼
  document.querySelectorAll('.ytai-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      quickAction(btn.dataset.type, btn.dataset.label);
    });
  });

  document.getElementById('ytai-panel-close').addEventListener('click', hidePanel);
  document.getElementById('ytai-voice-btn').addEventListener('click', startVoice);
  document.getElementById('ytai-send-btn').addEventListener('click', () => {
    const val = document.getElementById('ytai-input').value.trim();
    if (val) submitRequest(val);
  });
  document.getElementById('ytai-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const val = document.getElementById('ytai-input').value.trim();
      if (val) submitRequest(val);
    }
  });
}

function togglePanel() {
  const panel = document.getElementById('ytai-panel');
  panel.classList.toggle('ytai-panel-visible');
}

function hidePanel() {
  document.getElementById('ytai-panel')?.classList.remove('ytai-panel-visible');
}

function resetPanel() {
  document.getElementById('ytai-loading').style.display = 'none';
  document.getElementById('ytai-panel-body').classList.remove('ytai-loading-mode');
  document.getElementById('ytai-input').value = '';
  document.getElementById('ytai-voice-status').textContent = '';
}

// ─── Voice recognition ────────────────────────────────────────────────────────

let recognition = null;

function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    showErrorToast(t('voiceUnsupported'));
    return;
  }

  if (recognition) {
    recognition.stop();
    return;
  }

  recognition = new SR();
  recognition.lang = YTAI_LANG === 'ko' ? 'ko-KR' : 'en-US';
  recognition.continuous = false;
  recognition.interimResults = true;

  const btn = document.getElementById('ytai-voice-btn');
  const status = document.getElementById('ytai-voice-status');

  btn.classList.add('ytai-recording');
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg><span>${t('voiceListening')}</span>`;
  status.textContent = t('voiceSpeakPrompt');

  recognition.onresult = (e) => {
    let transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    status.textContent = transcript;
    document.getElementById('ytai-input').value = transcript;
  };

  recognition.onend = () => {
    btn.classList.remove('ytai-recording');
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>${t('voiceBtnLabel')}</span>`;
    recognition = null;
    const val = document.getElementById('ytai-input').value.trim();
    if (val) setTimeout(() => submitRequest(val), 400);
  };

  recognition.onerror = () => {
    btn.classList.remove('ytai-recording');
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>${t('voiceBtnLabel')}</span>`;
    status.textContent = t('voiceError');
    recognition = null;
  };

  recognition.start();
}

// ─── Submit request ───────────────────────────────────────────────────────────

function submitRequest(userRequest) {
  document.getElementById('ytai-panel-body').classList.add('ytai-loading-mode');
  document.getElementById('ytai-loading').style.display = 'flex';

  const pageSnapshot = getPageSnapshot();
  console.log('[ytai-content] 요청 전송:', userRequest, '스냅샷:', pageSnapshot.length, '개 요소');

  const port = chrome.runtime.connect({ name: 'ytai-analyze' });
  let responded = false;

  const timeout = setTimeout(() => {
    if (!responded) {
      port.disconnect();
      resetPanel();
      showErrorToast(t('timeoutError'));
    }
  }, 35000);

  port.onMessage.addListener((response) => {
    responded = true;
    clearTimeout(timeout);
    port.disconnect();
    if (response.type === 'ANALYSIS_RESULT') {
      hidePanel();
      showOverlay(response.result);
    } else if (response.type === 'ANALYSIS_ERROR') {
      resetPanel();
      showErrorToast(response.error);
    }
  });

  port.onDisconnect.addListener(() => {
    clearTimeout(timeout);
    if (!responded) {
      resetPanel();
      showErrorToast(t('connError'));
    }
  });

  port.postMessage({ type: 'ANALYZE_SCREEN', userRequest, pageSnapshot, lang: YTAI_LANG });
}

// ─── Page snapshot (DOM → Claude용 요소 목록) ──────────────────────────────────

function getPageSnapshot() {
  const seen = new Set();
  const items = [];

  const sels = [
    '.ytp-button[aria-label]',           // 플레이어 컨트롤
    'button[aria-label]',                // 일반 버튼
    'yt-button-shape button[aria-label]', // 새 YouTube 버튼 컴포넌트
    'a[title]',                          // 링크
    'ytd-guide-entry-renderer a',        // 사이드바 항목
    'ytd-mini-guide-entry-renderer a',  // 미니 사이드바
    'input[name="search_query"]',        // 검색창 (헤더)
    'yt-tab-shape',                      // 탭
    '[role="tab"][aria-label]',
    'yt-subscribe-button-view-model button',
    'ytd-subscribe-button-renderer button',
    'like-button-view-model button',
    'dislike-button-view-model button',
    'ytd-menu-renderer button[aria-label]', // 영상 하단 메뉴 버튼들
  ];

  for (const sel of sels) {
    for (const el of document.querySelectorAll(sel)) {
      if (seen.has(el)) continue;
      seen.add(el);
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) continue;
      const raw = (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.textContent || ''
      ).trim();
      // "(k)", "(m)" 또는 "키보드 단축키 k" 같은 단축키 접미사 제거
      const t = raw
        .replace(/\s*키보드\s*단축키\s*\S+\s*$/, '')
        .replace(/\s*[\(（][a-zA-Z0-9\s]{1,3}[\)）]\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 50);
      if (!t) continue;
      const cx = (rect.left + rect.width / 2) / window.innerWidth;
      const cy = (rect.top + rect.height / 2) / window.innerHeight;
      let area = AREA.main;
      if (cy > 0.82) area = AREA.player;
      else if (cx < 0.14) area = AREA.sidebar;
      else if (cy < 0.1) area = AREA.header;
      // 쇼츠의 좋아요/댓글/공유 버튼처럼 화면 오른쪽 끝에 세로로 붙은 요소들
      else if (cx > 0.86) area = AREA.right;
      items.push({ t, area, x: +cx.toFixed(2), y: +cy.toFixed(2) });
    }
  }

  // 같은 텍스트+영역 조합만 중복 제거 (같은 라벨이 플레이어/사이드바 등
  // 다른 영역에 따로 있으면 서로 다른 버튼이므로 둘 다 남겨야 한다)
  const seenKeys = new Set();
  const deduped = items.filter(e => {
    const k = e.t.toLowerCase() + '|' + e.area;
    if (seenKeys.has(k)) return false;
    seenKeys.add(k);
    return true;
  });
  if (deduped.length > 60) {
    console.warn('[ytai] 화면 요소가 60개를 넘어 일부가 AI에게 전달되지 않음:', deduped.length, '개 중 60개만 전송');
  }
  return deduped.slice(0, 60);
}

// ─── Selectors ───────────────────────────────────────────────────────────────

const ELEMENT_SELECTORS = {
  play:          '.ytp-play-button',
  volume:        '.ytp-mute-button',
  subtitles:     '.ytp-subtitles-button',
  settings:      '.ytp-settings-button',
  fullscreen:    '.ytp-fullscreen-button',
  theater:       '.ytp-size-button',
  next_video:    '.ytp-next-button',
  miniplayer:    '.ytp-miniplayer-button',
  search:        'input[name="search_query"], input#search',
  like:          'button[aria-label*="좋아요 표시"], like-button-view-model button, ytd-toggle-button-renderer[is-icon-button] button[aria-label*="좋아요"]',
  dislike:       'button[aria-label*="싫어요 표시"], dislike-button-view-model button, ytd-toggle-button-renderer[is-icon-button] button[aria-label*="싫어요"]',
  subscribe:     'yt-subscribe-button-view-model button, ytd-subscribe-button-renderer button',
  playlists_tab: 'yt-tab-shape[tab-title="재생목록"], tp-yt-paper-tab[aria-label="재생목록"], [tab-identifier="재생목록"], yt-tab-shape[tab-title="Playlists"], tp-yt-paper-tab[aria-label="Playlists"], [tab-identifier="Playlists"]',
  save:          [
    'button[aria-label*="저장"]',
    'yt-button-shape button[aria-label*="저장"]',
    'ytd-button-renderer button[aria-label*="저장"]',
    'ytd-menu-service-item-renderer[aria-label*="저장"]',
    '.ytd-menu-renderer button[aria-label*="저장"]',
    'button[aria-label*="Save"]',
    'yt-button-shape button[aria-label*="Save"]',
  ].join(', '),
  share:         'button[aria-label*="공유"], yt-button-shape button[aria-label*="공유"], button[aria-label*="Share"], yt-button-shape button[aria-label*="Share"]',
  more_actions:  'button[aria-label*="더보기"], yt-button-shape button[aria-label*="더보기"], button[aria-label*="작업 더보기"], button[aria-label*="More actions"], yt-button-shape button[aria-label*="More actions"]',
  home:          'ytd-guide-entry-renderer a[href="/"], ytd-mini-guide-entry-renderer a[href="/"], a[href="/"][title]',
  subscriptions: 'ytd-guide-entry-renderer a[href="/feed/subscriptions"], ytd-mini-guide-entry-renderer a[href="/feed/subscriptions"]',
  library:       'ytd-guide-entry-renderer a[href="/feed/library"], ytd-mini-guide-entry-renderer a[href="/feed/library"]',
  history:       'ytd-guide-entry-renderer a[href="/feed/history"], ytd-mini-guide-entry-renderer a[href="/feed/history"]',
  shorts:        'ytd-guide-entry-renderer a[href="/shorts"], ytd-mini-guide-entry-renderer a[href="/shorts"]',
};

const TEXT_FALLBACKS = {
  library:       ['보관함', 'Library'],
  home:          ['홈', 'Home'],
  subscriptions: ['구독', 'Subscriptions'],
  history:       ['기록', 'History'],
  shorts:        ['Shorts'],
  search:        ['검색', 'Search'],
  like:          ['좋아요', 'Like'],
  subscribe:      ['구독', 'Subscribe'],
  playlists_tab:  ['재생목록', 'Playlists'],
  save:           ['저장', 'Save'],
  share:          ['공유', 'Share'],
};

// ─── Element finders ─────────────────────────────────────────────────────────

// YouTube 동의어 맵 (단축키 제거 후 원래 단어 → 검색어). 한/영 병기.
const SYNONYMS = {
  '볼륨': ['음소거', '음소거 해제', '볼륨', 'mute', 'unmute', 'volume'],
  '음소거': ['음소거', '음소거 해제', '볼륨', 'mute', 'unmute', 'volume'],
  '재생': ['재생', '일시중지', '일시정지', 'play', 'pause'],
  '일시정지': ['일시중지', '일시정지', '재생', 'pause', 'play'],
  '일시중지': ['일시중지', '일시정지', '재생', 'pause', 'play'],
  '자막': ['자막', 'subtitles', 'captions', 'cc'],
  '전체화면': ['전체 화면', '전체화면', 'fullscreen', 'full screen'],
  '전체 화면': ['전체 화면', '전체화면', 'fullscreen', 'full screen'],
  '저장': ['저장', '재생목록에 저장', 'save'],
  '공유': ['공유', 'share'],
  '좋아요': ['좋아요', '좋아요 표시', 'like'],
  '구독': ['구독', 'subscribe'],
  'volume': ['mute', 'unmute', 'volume', '볼륨', '음소거'],
  'mute': ['mute', 'unmute', 'volume', '볼륨', '음소거'],
  'unmute': ['mute', 'unmute', 'volume', '볼륨', '음소거'],
  'play': ['play', 'pause', '재생', '일시정지'],
  'pause': ['pause', 'play', '일시정지', '재생'],
  'subtitles': ['subtitles', 'captions', 'cc', '자막'],
  'captions': ['subtitles', 'captions', 'cc', '자막'],
  'fullscreen': ['fullscreen', 'full screen', '전체화면'],
  'save': ['save', 'save to playlist', '저장'],
  'share': ['share', '공유'],
  'like': ['like', '좋아요'],
  'subscribe': ['subscribe', '구독'],
};

function findElementByTextContent(text) {
  if (!text) return null;
  const norm = text.trim().toLowerCase();
  const candidates = document.querySelectorAll(
    'button, a, input, [role="button"], [role="tab"], yt-tab-shape'
  );

  // 검색할 키워드 목록 (동의어 포함)
  const keywords = [norm];
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (norm.includes(key) || key.includes(norm)) {
      keywords.push(...syns.map(s => s.toLowerCase()));
    }
  }

  for (const pass of [
    // 1단계: aria-label/title 정확 매치
    (el) => {
      const lbl = (el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().toLowerCase()
        .replace(/\s*키보드\s*단축키\s*\S+\s*$/, '')
        .replace(/\s*[\(（][a-zA-Z0-9\s]{1,3}[\)）]\s*$/, '').trim();
      return keywords.some(k => lbl === k);
    },
    // 2단계: 텍스트 정확 매치
    (el) => {
      const txt = el.textContent.trim().toLowerCase();
      return keywords.some(k => txt === k);
    },
    // 3단계: 포함 매치
    (el) => {
      const all = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '')
        .trim().toLowerCase()
        .replace(/\s*키보드\s*단축키\s*\S+\s*$/, '')
        .replace(/\s*[\(（][a-zA-Z0-9\s]{1,3}[\)）]\s*$/, '').trim();
      return keywords.some(k => k.length >= 2 && all.includes(k) && all.length < k.length * 5);
    },
  ]) {
    for (const el of candidates) {
      if (!pass(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return el;
    }
  }
  return null;
}

function findTargetElement(elementType, elementText) {
  // 1. CSS 선택자 - querySelectorAll로 모든 후보 중 첫 번째 visible 반환
  if (elementType && ELEMENT_SELECTORS[elementType]) {
    for (const el of document.querySelectorAll(ELEMENT_SELECTORS[elementType])) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return el;
    }
  }
  // 2. element_text (AI가 스냅샷에서 골라준 정확한 텍스트)
  if (elementText) {
    const el = findElementByTextContent(elementText);
    if (el) return el;
  }
  // 3. 텍스트 폴백
  if (elementType && TEXT_FALLBACKS[elementType]) {
    return findByTextElement(TEXT_FALLBACKS[elementType]);
  }
  return null;
}

function getElementCenter(elementType, elementText) {
  const el = findTargetElement(elementType, elementText);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
}

// ─── Overlay (spotlight + instruction, 멀티스텝 + 실시간 추적) ───────────────

let _steps = [];
let _stepIndex = 0;
let _floatingBtn = null;
let _trackingElementType = null;
let _trackingElementText = null;
let _rafId = null;
let _targetEl = null;
let _targetClickFn = null;
let _autoClick = false;
let _autoClickTimer = null;

function startTracking(elementType, elementText) {
  _trackingElementType = elementType;
  _trackingElementText = elementText;

  // 오버레이 노드와 대상 요소는 한 번만 찾아 잡고 있는다.
  // 매 프레임 findTargetElement()를 부르면 유튜브 전체 DOM을 초당 60번 훑게 된다.
  const s = document.querySelector('.ytai-spotlight');
  const p = document.querySelector('.ytai-pulse');
  const a = document.querySelector('.ytai-arrow');
  const l = document.querySelector('.ytai-target-label');
  let el = findTargetElement(elementType, elementText);
  let miss = 0;

  function tick() {
    if (!_trackingElementType && !_trackingElementText) return;
    // 잡고 있던 요소가 DOM에서 빠지거나 숨겨졌을 때만 다시 찾는다 (유튜브 SPA 이동 대응)
    let rect = el?.isConnected ? el.getBoundingClientRect() : null;
    if (!rect || rect.width === 0 || rect.height === 0) {
      // 못 찾는 동안 매 프레임 전체 스캔하지 않도록 30프레임(약 0.5초)에 한 번만 재탐색
      rect = null;
      if (miss++ % 30 === 0) {
        el = findTargetElement(_trackingElementType, _trackingElementText);
        const r = el?.getBoundingClientRect();
        if (r && r.width > 0 && r.height > 0) rect = r;
      }
    } else {
      miss = 0;
    }
    if (rect) {
      const x = Math.round(rect.left + rect.width / 2);
      const y = Math.round(rect.top + rect.height / 2);
      if (s) { s.style.left = x + 'px'; s.style.top = y + 'px'; }
      if (p) { p.style.left = x + 'px'; p.style.top = y + 'px'; }
      if (a) { a.style.left = x + 'px'; a.style.top = y + 'px'; }
      if (l) {
        const labelY = y > window.innerHeight * 0.75 ? y - 80 : y + 60;
        l.style.left = x + 'px';
        l.style.top = labelY + 'px';
      }
    }
    _rafId = requestAnimationFrame(tick);
  }
  _rafId = requestAnimationFrame(tick);
}

function stopTracking() {
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  _trackingElementType = null;
  _trackingElementText = null;
}

function attachClickAdvance(elementType, elementText) {
  const el = findTargetElement(elementType, elementText);
  if (!el) return;

  _targetEl = el;
  _targetClickFn = () => {
    setTimeout(() => advanceStep(), 200);
  };
  _targetEl.addEventListener('click', _targetClickFn, { once: true, capture: true });
}

function findByTextElement(texts) {
  for (const text of texts) {
    const all = document.querySelectorAll('a, button, span, yt-formatted-string, ytd-guide-entry-renderer');
    for (const el of all) {
      if (el.textContent.trim() === text) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) return el;
      }
    }
  }
  return null;
}

function detachClickAdvance() {
  if (_targetEl && _targetClickFn) {
    _targetEl.removeEventListener('click', _targetClickFn, { capture: true });
  }
  _targetEl = null;
  _targetClickFn = null;
}

function advanceStep() {
  const isLast = _stepIndex === _steps.length - 1;
  if (isLast) {
    stopTracking();
    detachClickAdvance();
    removeOverlay();
    if (_floatingBtn) _floatingBtn.style.display = '';
    resetPanel();
  } else {
    _stepIndex++;
    showStep(_stepIndex);
  }
}


function cancelAutoClick() {
  if (_autoClickTimer) { clearInterval(_autoClickTimer); _autoClickTimer = null; }
}

function startAutoClickCountdown(elementType, elementText) {
  let secs = 2;
  const updateBtn = () => {
    const btn = document.getElementById('ytai-instr-ok');
    if (btn) btn.textContent = t('autoClickCountdown').replace('{n}', secs);
  };
  updateBtn();
  _autoClickTimer = setInterval(() => {
    secs--;
    if (secs > 0) {
      updateBtn();
    } else {
      clearInterval(_autoClickTimer);
      _autoClickTimer = null;
      const el = findTargetElement(elementType, elementText);
      if (el) el.click();
      setTimeout(() => advanceStep(), 300);
    }
  }, 1000);
}

function quickAction(elementType, label) {
  hidePanel();

  // 홈·구독·보관함·검색은 버튼이 안 보일 때 직접 이동
  const NAV_URLS = {
    home:          'https://www.youtube.com/',
    subscriptions: 'https://www.youtube.com/feed/subscriptions',
    library:       'https://www.youtube.com/feed/library',
    history:       'https://www.youtube.com/feed/history',
    shorts:        'https://www.youtube.com/shorts',
  };

  const pos = getElementCenter(elementType, null);
  if (!pos) {
    if (NAV_URLS[elementType]) {
      window.location.href = NAV_URLS[elementType];
      return;
    }
    if (elementType === 'search') {
      const input = document.querySelector('input#search');
      if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    }
    showErrorToast(t('notFoundToast').replace('{label}', label));
    return;
  }
  showOverlay({
    steps: [{
      instruction: t('quickActionInstruction').replace('{label}', label),
      element_type: elementType,
      element_text: null,
      target_label: label,
    }]
  });
}

function showOverlay(result) {
  if (!result?.steps?.length) {
    showErrorToast(t('responseFormatError'));
    resetPanel();
    return;
  }
  _steps = result.steps;
  _stepIndex = 0;
  _floatingBtn = document.getElementById('ytai-btn');
  if (_floatingBtn) _floatingBtn.style.display = 'none';
  showStep(_stepIndex);
}

function showStep(index) {
  cancelAutoClick();
  stopTracking();
  detachClickAdvance();
  removeOverlay();

  const step = _steps[index];
  if (!step) return;

  const isLast = index === _steps.length - 1;
  const total = _steps.length;
  const eType = step.element_type ?? null;
  const eText = step.element_text ?? null;

  if (eType || eText) {
    const pos = getElementCenter(eType, eText);
    const initX = pos?.x ?? -999;
    const initY = pos?.y ?? -999;
    const overlay = document.createElement('div');
    overlay.id = 'ytai-overlay';
    overlay.innerHTML = `
      <div class="ytai-spotlight" style="left:${initX}px;top:${initY}px"></div>
      <div class="ytai-pulse" style="left:${initX}px;top:${initY}px"></div>
      <div class="ytai-arrow" style="left:${initX}px;top:${initY}px"></div>
    `;
    if (step.target_label) {
      const labelY = initY > window.innerHeight * 0.75 ? initY - 80 : initY + 60;
      const label = document.createElement('div');
      label.className = 'ytai-target-label';
      label.style.cssText = `left:${initX}px;top:${labelY}px`;
      label.textContent = step.target_label;
      overlay.appendChild(label);
    }
    document.body.appendChild(overlay);
    startTracking(eType, eText);
    if (_autoClick) {
      // 자동 클릭 모드: 카운트다운 후 자동 클릭
    } else if (!isLast) {
      attachClickAdvance(eType, eText);
    }
  }

  const box = document.createElement('div');
  box.id = 'ytai-instruction';
  const stepIndicator = total > 1
    ? `<div class="ytai-step-indicator">${index + 1} / ${total}</div>`
    : '';

  const btnLabel = isLast ? t('confirmBtn') : (_autoClick && (eType || eText) ? t('autoClickCountdown').replace('{n}', 2) : ((eType || eText) ? t('skipBtn') : t('nextBtn')));

  box.innerHTML = `
    ${stepIndicator}
    <div class="ytai-instr-text">${escapeHtml(step.instruction ?? t('fallbackInstruction'))}</div>
    <button id="ytai-instr-ok">${btnLabel}</button>
  `;
  document.body.appendChild(box);

  document.getElementById('ytai-instr-ok').addEventListener('click', () => {
    cancelAutoClick();
    advanceStep();
  });

  if (_autoClick && (eType || eText)) {
    startAutoClickCountdown(eType, eText);
  }
}

function removeOverlay() {
  document.querySelectorAll('#ytai-overlay, #ytai-instruction').forEach(el => el.remove());
}

// ─── Error toast ──────────────────────────────────────────────────────────────

function showErrorToast(message) {
  document.getElementById('ytai-toast')?.remove();

  const toast = document.createElement('div');
  toast.id = 'ytai-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
