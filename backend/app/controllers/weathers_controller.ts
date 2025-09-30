import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import env from '#start/env'

export default class WeatherController {
  private readonly API_KEY = env.get('OPENWEATHER_API_KEY')
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5'

  public async getWeather(ctx: HttpContext) {
    const { request, response } = ctx
    const city = request.input('city')
    if (!city) {
      return response.badRequest({ error: 'Le paramètre "city" est requis.' })
    }
    if (!this.API_KEY) {
      return response.status(500).json({ error: 'Clé API OpenWeather non configurée.' })
    }
    try {
      const { data } = await axios.get(`${this.BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.API_KEY,
          units: 'metric',
          lang: 'fr',
        },
      })
      return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        pressure: data.main.pressure,
        lat: data.coord.lat,
        lon: data.coord.lon,
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return response.notFound({ error: 'Ville non trouvée.' })
      }
      return response
        .status(500)
        .json({ error: 'Erreur lors de la récupération des données météo.' })
    }
  }

  public async getForecast(ctx: HttpContext) {
    const { request, response } = ctx
    const lat = request.input('lat')
    const lon = request.input('lon')
    if (!lat || !lon) {
      return response.badRequest({ error: 'Latitude et longitude sont requis.' })
    }
    if (!this.API_KEY) {
      return response.status(500).json({ error: 'Clé API OpenWeather non configurée.' })
    }
    try {
      const { data } = await axios.get(`${this.BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.API_KEY,
          units: 'metric',
          lang: 'fr',
        },
      })
      // Prévisions sur 5 jours (une par jour)
      const dailyForecasts = data.list
        .filter((_: any, index: number) => index % 8 === 0)
        .slice(0, 5)
      return dailyForecasts.map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString('fr-FR'),
        temperature: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
      }))
    } catch (error: any) {
      return response.status(500).json({ error: 'Erreur lors de la récupération des prévisions.' })
    }
  }
}
