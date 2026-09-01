#!/bin/sh
# 웹스토어 업로드용 zip. 확장에 실제로 필요한 파일만 담는다.
set -e
rm -f ../youtube-ai-helper.zip
zip -r ../youtube-ai-helper.zip manifest.json background.js content.js content.css popup icons _locales \
  -x "*.DS_Store"
echo "→ ../youtube-ai-helper.zip"
