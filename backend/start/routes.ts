/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

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
