// ⚠️ 폐기된 버전 — 참고용 보관. 배포하지 말 것.
//
// v1.0.0까지 Cloudflare 대시보드에서 돌던 코드.
// 문제점:
//   1. 클라이언트 본문(model/messages)을 검증 없이 그대로 Anthropic에 전달 → 누구나 임의 프롬프트 실행
//   2. Access-Control-Allow-Origin: '*' → 아무 웹사이트에서 호출 가능
//   3. 인증·레이트리밋 없음
//   4. Anthropic 오류 원문(e.message)을 클라이언트에 그대로 노출
// 2026-07-27 검토에서 확인 후 src/index.js로 교체.

export default {
    async fetch(request, env) {
      const cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: cors });
      }

      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405, headers: cors });
      }

      try {
        const body = await request.json();
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      }
    }
  };
