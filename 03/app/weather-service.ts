export type WeatherLocation = {
  id: string;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type WeatherCondition = {
  label: string;
  icon: 'clear' | 'cloud' | 'rain' | 'snow' | 'storm' | 'fog';
  theme: 'day' | 'mist' | 'rain' | 'snow' | 'storm' | 'night';
};

export type WeatherData = {
  location: WeatherLocation;
  current: {
    time: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    precipitation: number;
    code: number;
    cloudCover: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    isDay: boolean;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    precipitationChance: number;
    humidity: number;
    code: number;
  }>;
  daily: Array<{
    date: string;
    code: number;
    max: number;
    min: number;
    precipitationChance: number;
    sunrise: string;
    sunset: string;
    uvIndex: number;
  }>;
};

export const featuredLocations: WeatherLocation[] = [
  { id: 'istanbul', name: 'İstanbul', country: 'Türkiye', latitude: 41.0082, longitude: 28.9784 },
  { id: 'ankara', name: 'Ankara', country: 'Türkiye', latitude: 39.9334, longitude: 32.8597 },
  { id: 'izmir', name: 'İzmir', country: 'Türkiye', latitude: 38.4237, longitude: 27.1428 },
];

const resultCache = new Map<string, { expiresAt: number; data: WeatherData }>();
const pendingRequests = new Map<string, Promise<WeatherData>>();
const CACHE_DURATION = 10 * 60 * 1000;

const round = (value: number | undefined) => Math.round(value ?? 0);

export function getWeatherCondition(code: number, isDay = true): WeatherCondition {
  if (!isDay && code <= 3) return { label: code === 0 ? 'Açık gece' : 'Gece bulutlu', icon: code === 0 ? 'clear' : 'cloud', theme: 'night' };
  if (code === 0) return { label: 'Açık ve güneşli', icon: 'clear', theme: 'day' };
  if (code === 1 || code === 2) return { label: 'Parçalı bulutlu', icon: 'cloud', theme: 'day' };
  if (code === 3) return { label: 'Kapalı', icon: 'cloud', theme: 'mist' };
  if (code === 45 || code === 48) return { label: 'Sisli', icon: 'fog', theme: 'mist' };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { label: code >= 80 ? 'Sağanak yağışlı' : 'Yağmurlu', icon: 'rain', theme: 'rain' };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: 'Kar yağışlı', icon: 'snow', theme: 'snow' };
  if (code >= 95) return { label: 'Gök gürültülü', icon: 'storm', theme: 'storm' };
  return { label: 'Değişken', icon: 'cloud', theme: 'mist' };
}

function weatherUrl(location: WeatherLocation) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m');
  url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,weather_code,relative_humidity_2m');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '7');
  return url;
}

export async function fetchWeather(location: WeatherLocation): Promise<WeatherData> {
  const key = `${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}`;
  const cached = resultCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.data;
  const pending = pendingRequests.get(key);
  if (pending) return pending;

  const request = (async () => {
    const response = await fetch(weatherUrl(location));
    if (!response.ok) throw new Error('Hava servisine şu anda ulaşılamıyor. Lütfen biraz sonra tekrar deneyin.');
    const raw = await response.json();
    if (!raw.current || !raw.hourly || !raw.daily) throw new Error('Bu konum için yeterli hava verisi bulunamadı.');

    const data: WeatherData = {
      location: { ...location, timezone: raw.timezone },
      current: {
        time: raw.current.time,
        temperature: round(raw.current.temperature_2m),
        feelsLike: round(raw.current.apparent_temperature),
        humidity: round(raw.current.relative_humidity_2m),
        precipitation: raw.current.precipitation ?? 0,
        code: raw.current.weather_code ?? 0,
        cloudCover: round(raw.current.cloud_cover),
        pressure: round(raw.current.surface_pressure),
        windSpeed: round(raw.current.wind_speed_10m),
        windDirection: round(raw.current.wind_direction_10m),
        isDay: raw.current.is_day === 1,
      },
      hourly: raw.hourly.time.map((time: string, index: number) => ({
        time,
        temperature: round(raw.hourly.temperature_2m[index]),
        precipitationChance: round(raw.hourly.precipitation_probability[index]),
        humidity: round(raw.hourly.relative_humidity_2m[index]),
        code: raw.hourly.weather_code[index] ?? 0,
      })),
      daily: raw.daily.time.map((date: string, index: number) => ({
        date,
        code: raw.daily.weather_code[index] ?? 0,
        max: round(raw.daily.temperature_2m_max[index]),
        min: round(raw.daily.temperature_2m_min[index]),
        precipitationChance: round(raw.daily.precipitation_probability_max[index]),
        sunrise: raw.daily.sunrise[index],
        sunset: raw.daily.sunset[index],
        uvIndex: Math.round((raw.daily.uv_index_max[index] ?? 0) * 10) / 10,
      })),
    };

    resultCache.set(key, { expiresAt: Date.now() + CACHE_DURATION, data });
    return data;
  })();

  pendingRequests.set(key, request);
  try {
    return await request;
  } finally {
    pendingRequests.delete(key);
  }
}

export async function searchCity(query: string): Promise<WeatherData> {
  const value = query.trim();
  if (value.length < 2) throw new Error('Lütfen en az iki harf içeren bir şehir adı yazın.');

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', value);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'tr');
  url.searchParams.set('format', 'json');
  const response = await fetch(url);
  if (!response.ok) throw new Error('Şehir araması şu anda yapılamıyor. Lütfen tekrar deneyin.');
  const raw = await response.json();
  const result = raw.results?.[0];
  if (!result) throw new Error(`“${value}” için bir şehir bulamadık. Yazımı kontrol edip tekrar deneyin.`);

  return fetchWeather({
    id: String(result.id ?? `${result.latitude},${result.longitude}`),
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  });
}

export async function fetchFeaturedWeather() {
  return Promise.all(featuredLocations.map(fetchWeather));
}
