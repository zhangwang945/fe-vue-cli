const tmpl = require("@lanyi/isomorphic-template")
debugger
var a=tmpl.client(`{% mock 
  $appData = {
    env:'dev',
    userInfo:{
      isTeacher:1
    },
  } 
%}

<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="/favicon.ico">
    <title>tt</title>
  </head>
  <body>
    <script>
    window.__APP_DATA = {{! $appData | json }};
    </script>
    <noscript>
      <strong>We're sorry but tt doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`)

console.log(a);