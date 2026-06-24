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
  btn.innerHTML = `<span class="ytai-btn-icon"></span><span class="ytai-btn-label">도움받기</span>`;
  btn.addEventListener('click', togglePanel);
  document.body.appendChild(btn);
}

// ─── Helper panel (voice + chat) ─────────────────────────────────────────────

function createHelperPanel() {
  const panel = document.createElement('div');
  panel.id = 'ytai-panel';
  panel.innerHTML = `
    <div class="ytai-panel-header">
      <span>무엇을 도와드릴까요?</span>
      <button class="ytai-close-btn" id="ytai-panel-close">✕</button>
    </div>
    <div class="ytai-panel-body" id="ytai-panel-body">
      <div class="ytai-autoclick-row">
        <span class="ytai-autoclick-label">자동 클릭</span>
        <label class="ytai-switch">
          <input type="checkbox" id="ytai-autoclick-chk">
          <span class="ytai-slider"></span>
        </label>
      </div>
      <div class="ytai-autoclick-row">
        <span class="ytai-autoclick-label">돋보기</span>
        <label class="ytai-switch">
          <input type="checkbox" id="ytai-magnifier-chk">
          <span class="ytai-slider"></span>
        </label>
      </div>
      <div class="ytai-quick-grid">
        <button class="ytai-quick-btn" data-type="play" data-label="재생">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21"/></svg>
          <span>재생</span>
        </button>
        <button class="ytai-quick-btn" data-type="volume" data-label="볼륨">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/></svg>
          <span>볼륨</span>
        </button>
        <button class="ytai-quick-btn" data-type="subtitles" data-label="자막">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="11" x2="11" y2="11"/><line x1="13" y1="11" x2="17" y2="11"/><line x1="7" y1="15" x2="10" y2="15"/></svg>
          <span>자막</span>
        </button>
        <button class="ytai-quick-btn" data-type="fullscreen" data-label="전체화면">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          <span>전체화면</span>
        </button>
        <button class="ytai-quick-btn" data-type="next_video" data-label="다음 영상">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,4 15,12 5,20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          <span>다음 영상</span>
        </button>
        <button class="ytai-quick-btn" data-type="like" data-label="좋아요">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          <span>좋아요</span>
        </button>
        <button class="ytai-quick-btn" data-type="save" data-label="저장">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>저장</span>
        </button>
        <button class="ytai-quick-btn" data-type="search" data-label="검색">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>검색</span>
        </button>
        <button class="ytai-quick-btn" data-type="home" data-label="홈으로">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          <span>홈으로</span>
        </button>
      </div>
      <div class="ytai-or">직접 말하거나 입력하기</div>
      <button id="ytai-voice-btn" class="ytai-voice-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        <span>눌러서 말하기</span>
      </button>
      <div id="ytai-voice-status" class="ytai-voice-status"></div>
      <div class="ytai-or">또는</div>
      <textarea id="ytai-input" placeholder="예) 볼륨을 높이고 싶어요&#10;예) 영상을 일시정지하고 싶어요" rows="3"></textarea>
      <button id="ytai-send-btn" class="ytai-send-btn">AI에게 물어보기 →</button>
      <div id="ytai-loading" class="ytai-loading" style="display:none">
        <div class="ytai-spinner"></div>
        <span>AI가 화면을 분석 중입니다...</span>
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

  // 돋보기 토글 초기화
  chrome.storage.local.get('magnifier', (data) => {
    if (data.magnifier) {
      document.getElementById('ytai-magnifier-chk').checked = true;
      enableMagnifier();
    }
  });
  document.getElementById('ytai-magnifier-chk').addEventListener('change', (e) => {
    if (e.target.checked) { enableMagnifier(); } else { disableMagnifier(); }
    chrome.storage.local.set({ magnifier: e.target.checked });
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
    showErrorToast('이 브라우저는 음성 인식을 지원하지 않습니다.');
    return;
  }

  if (recognition) {
    recognition.stop();
    return;
  }

  recognition = new SR();
  recognition.lang = 'ko-KR';
  recognition.continuous = false;
  recognition.interimResults = true;

  const btn = document.getElementById('ytai-voice-btn');
  const status = document.getElementById('ytai-voice-status');

  btn.classList.add('ytai-recording');
  btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg><span>듣고 있어요...</span>';
  status.textContent = '말씀해 주세요!';

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
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>눌러서 말하기</span>';
    recognition = null;
    const val = document.getElementById('ytai-input').value.trim();
    if (val) setTimeout(() => submitRequest(val), 400);
  };

  recognition.onerror = () => {
    btn.classList.remove('ytai-recording');
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg><span>눌러서 말하기</span>';
    status.textContent = '인식에 실패했습니다. 다시 시도해주세요.';
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

  chrome.runtime.sendMessage({ type: 'ANALYZE_SCREEN', userRequest, pageSnapshot }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('[ytai-content] 오류:', chrome.runtime.lastError.message);
      resetPanel();
      showErrorToast('오류: ' + chrome.runtime.lastError.message);
      return;
    }

    if (response?.type === 'ANALYSIS_RESULT') {
      hidePanel();
      showOverlay(response.result);
    } else if (response?.type === 'ANALYSIS_ERROR') {
      resetPanel();
      showErrorToast(response.error);
    }
  });
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
    'input#search',                      // 검색창
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
      // "(k)", "(m)", "(f)", "(3)" 같은 단축키 접미사 제거
      const t = raw
        .replace(/\s*[\(（][a-zA-Z0-9\s]{1,3}[\)）]\s*$/, '')
        .replace(/\s+/g, ' ')
        .slice(0, 50);
      if (!t) continue;
      const cx = (rect.left + rect.width / 2) / window.innerWidth;
      const cy = (rect.top + rect.height / 2) / window.innerHeight;
      let area = '메인';
      if (cy > 0.82) area = '플레이어';
      else if (cx < 0.14) area = '사이드바';
      else if (cy < 0.1) area = '헤더';
      items.push({ t, area, x: +cx.toFixed(2), y: +cy.toFixed(2) });
    }
  }

  // 같은 텍스트 중복 제거
  const textSet = new Set();
  return items.filter(e => {
    const k = e.t.toLowerCase();
    if (textSet.has(k)) return false;
    textSet.add(k);
    return true;
  }).slice(0, 60);
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
  search:        'input#search',
  like:          'like-button-view-model button, #like-button button, ytd-toggle-button-renderer[is-icon-button] button[aria-label*="좋아요"]',
  dislike:       'dislike-button-view-model button, ytd-toggle-button-renderer[is-icon-button] button[aria-label*="싫어요"]',
  subscribe:     'yt-subscribe-button-view-model button, ytd-subscribe-button-renderer button',
  playlists_tab: 'yt-tab-shape[tab-title="재생목록"], tp-yt-paper-tab[aria-label="재생목록"], [tab-identifier="재생목록"]',
  save:          [
    'button[aria-label*="저장"]',
    'yt-button-shape button[aria-label*="저장"]',
    'ytd-button-renderer button[aria-label*="저장"]',
    'ytd-menu-service-item-renderer[aria-label*="저장"]',
    '.ytd-menu-renderer button[aria-label*="저장"]',
  ].join(', '),
  share:         'button[aria-label*="공유"], yt-button-shape button[aria-label*="공유"]',
  more_actions:  'button[aria-label*="더보기"], yt-button-shape button[aria-label*="더보기"], button[aria-label*="작업 더보기"]',
  home:           'ytd-guide-entry-renderer a[href="/"]',
  subscriptions: 'ytd-guide-entry-renderer a[href="/feed/subscriptions"]',
  library:       'ytd-guide-entry-renderer a[href="/feed/library"]',
  history:       'ytd-guide-entry-renderer a[href="/feed/history"]',
  shorts:        'ytd-guide-entry-renderer a[href="/shorts"]',
};

const TEXT_FALLBACKS = {
  library:       ['보관함', 'Library'],
  home:          ['홈', 'Home'],
  subscriptions: ['구독', 'Subscriptions'],
  history:       ['기록', 'History'],
  shorts:        ['Shorts'],
  search:        ['검색'],
  like:          ['좋아요'],
  subscribe:      ['구독'],
  playlists_tab:  ['재생목록'],
  save:           ['저장'],
  share:          ['공유'],
};

// ─── Element finders ─────────────────────────────────────────────────────────

// 한국어 YouTube 동의어 맵 (단축키 제거 후 원래 단어 → 검색어)
const KR_SYNONYMS = {
  '볼륨': ['음소거', '볼륨', 'mute', 'volume'],
  '음소거': ['음소거', '볼륨', 'mute', 'volume'],
  '재생': ['재생', '일시정지', 'play', 'pause'],
  '일시정지': ['일시정지', '재생', 'pause', 'play'],
  '자막': ['자막', 'subtitles', 'captions', 'cc'],
  '전체화면': ['전체', '전체화면', 'fullscreen', 'full screen'],
  '저장': ['저장', 'save'],
  '공유': ['공유', 'share'],
  '좋아요': ['좋아요', 'like'],
  '구독': ['구독', 'subscribe'],
};

function findElementByTextContent(text) {
  if (!text) return null;
  const norm = text.trim().toLowerCase();
  const candidates = document.querySelectorAll(
    'button, a, input, [role="button"], [role="tab"], yt-tab-shape'
  );

  // 검색할 키워드 목록 (동의어 포함)
  const keywords = [norm];
  for (const [key, syns] of Object.entries(KR_SYNONYMS)) {
    if (norm.includes(key) || key.includes(norm)) {
      keywords.push(...syns.map(s => s.toLowerCase()));
    }
  }

  for (const pass of [
    // 1단계: aria-label/title 정확 매치
    (el) => {
      const lbl = (el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().toLowerCase()
        .replace(/\s*[\(（][a-zA-Z0-9\s]{1,3}[\)）]\s*$/, ''); // 단축키 제거
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
        .replace(/\s*[\(（][a-zA-Z0-9\s]{1,3}[\)）]\s*$/, '');
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
  // 1. CSS 선택자
  if (elementType && ELEMENT_SELECTORS[elementType]) {
    const el = document.querySelector(ELEMENT_SELECTORS[elementType]);
    if (el) {
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

function findByText(texts) {
  for (const text of texts) {
    const all = document.querySelectorAll('a, button, span, yt-formatted-string, ytd-guide-entry-renderer');
    for (const el of all) {
      if (el.textContent.trim() === text) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
        }
      }
    }
  }
  return null;
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
const LENS_SIZE = 180;
const LENS_ZOOM = 2.5;
let _lensScreenshot = null;
let _lensScrollTimer = null;

function startTracking(elementType, elementText) {
  _trackingElementType = elementType;
  _trackingElementText = elementText;
  function tick() {
    if (!_trackingElementType && !_trackingElementText) return;
    const pos = getElementCenter(_trackingElementType, _trackingElementText);
    if (pos) {
      const { x, y } = pos;
      const s = document.querySelector('.ytai-spotlight');
      const p = document.querySelector('.ytai-pulse');
      const a = document.querySelector('.ytai-arrow');
      const l = document.querySelector('.ytai-target-label');
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

// ─── 돋보기 렌즈 ────────────────────────────────────────────────────────────────

function enableMagnifier() {
  let lens = document.getElementById('ytai-lens');
  if (!lens) {
    lens = document.createElement('div');
    lens.id = 'ytai-lens';
    document.body.appendChild(lens);
  }
  captureAndUpdateLens();
  document.addEventListener('mousemove', onLensMove);
  document.addEventListener('scroll', onLensScroll, true);
}

function disableMagnifier() {
  const lens = document.getElementById('ytai-lens');
  if (lens) {
    lens.style.display = 'none';
    lens.style.backgroundImage = '';
  }
  document.removeEventListener('mousemove', onLensMove);
  document.removeEventListener('scroll', onLensScroll, true);
  _lensScreenshot = null;
}

function captureAndUpdateLens() {
  chrome.runtime.sendMessage({ type: 'CAPTURE_TAB' }, (response) => {
    if (chrome.runtime.lastError || !response?.dataUrl) return;
    _lensScreenshot = response.dataUrl;
    const lens = document.getElementById('ytai-lens');
    if (!lens) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    lens.style.backgroundImage = `url(${_lensScreenshot})`;
    lens.style.backgroundSize = `${W * LENS_ZOOM}px ${H * LENS_ZOOM}px`;
  });
}

function onLensMove(e) {
  const lens = document.getElementById('ytai-lens');
  if (!lens || !_lensScreenshot) return;
  const cx = e.clientX;
  const cy = e.clientY;
  const half = LENS_SIZE / 2;
  lens.style.display = 'block';
  lens.style.left = (cx - half) + 'px';
  lens.style.top  = (cy - half) + 'px';
  lens.style.backgroundPosition =
    `${half - cx * LENS_ZOOM}px ${half - cy * LENS_ZOOM}px`;
}

function onLensScroll() {
  const lens = document.getElementById('ytai-lens');
  if (lens) lens.style.display = 'none'; // 스크롤 중엔 숨김
  if (_lensScrollTimer) clearTimeout(_lensScrollTimer);
  _lensScrollTimer = setTimeout(captureAndUpdateLens, 250);
}

function cancelAutoClick() {
  if (_autoClickTimer) { clearInterval(_autoClickTimer); _autoClickTimer = null; }
}

function startAutoClickCountdown(elementType, elementText) {
  let secs = 2;
  const updateBtn = () => {
    const btn = document.getElementById('ytai-instr-ok');
    if (btn) btn.textContent = `${secs}초 후 자동 클릭`;
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
  const pos = getElementCenter(elementType, null);
  if (!pos) {
    showErrorToast(`'${label}' 버튼을 이 화면에서 찾을 수 없어요.`);
    return;
  }
  showOverlay({
    steps: [{
      instruction: `${label} 버튼입니다. 클릭하세요.`,
      element_type: elementType,
      element_text: null,
      target_label: label,
    }]
  });
}

function showOverlay(result) {
  if (!result?.steps?.length) {
    showErrorToast('응답 형식 오류. 다시 시도해주세요.');
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

  const btnLabel = isLast ? '확인' : (_autoClick && (eType || eText) ? '2초 후 자동 클릭' : ((eType || eText) ? '건너뛰기' : '다음 →'));

  box.innerHTML = `
    ${stepIndicator}
    <div class="ytai-instr-text">${escapeHtml(step.instruction ?? '안내를 불러오지 못했어요.')}</div>
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
