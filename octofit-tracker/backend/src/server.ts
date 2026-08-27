import express from 'express'
import { connectDatabase } from './config/database.js'
import apiRouter from './routes/index.js'

const codespaceName = process.env.CODESPACE_NAME
const port = Number(process.env.PORT ?? 8000)

const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`

const frontendOrigin =
  process.env.FRONTEND_ORIGIN ??
  (codespaceName ? `https://${codespaceName}-5173.app.github.dev` : 'http://localhost:5173')

const app = express()

app.use(express.json())
app.use((_request, response, next) => {
  response.header('Access-Control-Allow-Origin', frontendOrigin)
  response.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', baseUrl: apiBaseUrl })
})

app.use('/api', apiRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' })
})

async function startServer() {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`OctoFit Tracker API listening on ${apiBaseUrl}`)
    })
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error)
    process.exitCode = 1
  }
}

void startServer()