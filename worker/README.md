# Worker (Claude API 프록시)

확장 프로그램은 여기로만 요청을 보낸다. Anthropic API 키는 **절대 확장에 넣지 않는다.**

## 배포

```bash
cd worker
npx wrangler secret put ANTHROPIC_API_KEY   # 값 입력 (파일에 저장 금지)
npx wrangler deploy
npx wrangler tail                            # 실시간 로그
```

## 설계 원칙

- 클라이언트 본문을 신뢰하지 않는다. `model`, `max_tokens`, 프롬프트는 전부 Worker에 하드코딩.
  확장은 `{userRequest, pageType, snapshot}`만 보낸다.
- `Access-Control-Allow-Origin`에 `*`를 쓰지 않는다. (v1.0.0에서 이것 때문에 누구나 쓸 수 있는
  공개 프록시가 됐었다.)
- 페이지에서 긁어온 요소 텍스트는 프롬프트에 넣기 전에 `clean()`으로 따옴표·중괄호·개행을 제거한다.
- Anthropic 오류 원문을 클라이언트로 그대로 흘리지 않는다.

## 프롬프트 수정 시

확장이 아니라 **여기만** 고치고 `wrangler deploy` 하면 즉시 반영된다.
확장을 고치면 웹스토어 심사를 다시 기다려야 한다.
