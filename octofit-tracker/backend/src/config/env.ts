const codespaceName = process.env.CODESPACE_NAME

export const port = Number(process.env.PORT ?? 8000)

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`

export const frontendOrigin =
  process.env.FRONTEND_ORIGIN ??
  (codespaceName ? `https://${codespaceName}-5173.app.github.dev` : 'http://localhost:5173')
