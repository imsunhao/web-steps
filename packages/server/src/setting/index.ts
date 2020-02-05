/**
 * 默认 启动端口
 */
export const DEFAULT_PORT = 8080

export const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html>
  <head>
    <title>{{ pageInfo.title }}</title>
    <meta name="keywords" content="{{ pageInfo.keywords }}">
    <meta name="description" content="{{ pageInfo.description }}">
  </head>

  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
`
