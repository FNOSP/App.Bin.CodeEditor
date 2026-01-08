#!/bin/bash

echo "Content-Type: text/html; charset=utf-8"
echo ""

cat <<EOF 
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <form id="form" method="POST" action="/cgi/ThirdParty/code.editor/test.cgi" enctype="multipart/form-data">
    <input name="name" type="text" />
    <input name="file1" type="file" />
    <input name="file2" type="file" />
    <button type="submit">提交</button>
  </form>
</body>
</html>
EOF