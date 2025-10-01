import router from '@adonisjs/core/services/router'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'
import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'

const appRoot = fileURLToPath(app.appRoot) // ✅ converti URL en string

// ---------------------------
// Routes API
// ---------------------------
router.get('/', async () => {
  return { message: 'Bienvenue sur l’API météo 🚀' }
})

router.get('/weather', async (ctx) => {
  const { default: WeatherController } = await import('../app/controllers/weathers_controller.js')
  return new WeatherController().getWeather(ctx)
})

router.get('/forecast', async (ctx) => {
  const { default: WeatherController } = await import('../app/controllers/weathers_controller.js')
  return new WeatherController().getForecast(ctx)
})

// ---------------------------
// Servir les fichiers statiques de React
// ---------------------------
router.get('/assets/*', async ({ params, response }) => {
  const filePath = join(appRoot, 'public/assets', params['*'])
  try {
    const file = await fs.readFile(filePath)
    return response.send(file)
  } catch {
    return response.status(404).send('Fichier introuvable')
  }
})

// ---------------------------
// Catch-all pour React SPA
// ---------------------------
router.any('*', async ({ response }) => {
  return response.download(join(appRoot, 'public/index.html'))
})
