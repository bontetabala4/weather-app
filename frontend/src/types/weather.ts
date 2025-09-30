export interface WeatherData {
  city: string
  country: string
  temperature: number
  feels_like: number
  description: string
  icon: string
  humidity: number
  wind_speed: number
  pressure: number
  lat: number
  lon: number
}

export interface ForecastData {
  date: string
  temperature: number
  description: string
  icon: string
  humidity: number
  wind_speed: number
}