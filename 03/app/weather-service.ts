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

export type CityWeatherSummary = {
  location: WeatherLocation;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    precipitation: number;
    code: number;
    windSpeed: number;
    isDay: boolean;
  };
  today: {
    max: number;
    min: number;
    precipitationChance: number;
  };
};

type ForecastApiResponse = {
  timezone?: string;
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    is_day: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    relative_humidity_2m: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
};

type GeocodingResult = {
  id?: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

type GeocodingApiResponse = { results?: GeocodingResult[] };

export const featuredLocations: WeatherLocation[] = [
  { id: 'istanbul', name: 'İstanbul', country: 'Türkiye', latitude: 41.0082, longitude: 28.9784 },
  { id: 'ankara', name: 'Ankara', country: 'Türkiye', latitude: 39.9334, longitude: 32.8597 },
  { id: 'izmir', name: 'İzmir', country: 'Türkiye', latitude: 38.4237, longitude: 27.1428 },
  { id: 'antalya', name: 'Antalya', country: 'Türkiye', latitude: 36.8969, longitude: 30.7133 },
  { id: 'bursa', name: 'Bursa', country: 'Türkiye', latitude: 40.1950, longitude: 29.0600 },
  { id: 'adana', name: 'Adana', country: 'Türkiye', latitude: 37.0000, longitude: 35.3213 },
  { id: 'konya', name: 'Konya', country: 'Türkiye', latitude: 37.8746, longitude: 32.4932 },
  { id: 'gaziantep', name: 'Gaziantep', country: 'Türkiye', latitude: 37.0662, longitude: 37.3833 },
  { id: 'mersin', name: 'Mersin', country: 'Türkiye', latitude: 36.8121, longitude: 34.6415 },
  { id: 'diyarbakir', name: 'Diyarbakır', country: 'Türkiye', latitude: 37.9144, longitude: 40.2306 },
  { id: 'kayseri', name: 'Kayseri', country: 'Türkiye', latitude: 38.7225, longitude: 35.4875 },
  { id: 'samsun', name: 'Samsun', country: 'Türkiye', latitude: 41.2867, longitude: 36.3300 },
  { id: 'trabzon', name: 'Trabzon', country: 'Türkiye', latitude: 41.0027, longitude: 39.7168 },
  { id: 'erzurum', name: 'Erzurum', country: 'Türkiye', latitude: 39.9043, longitude: 41.2679 },
  { id: 'eskisehir', name: 'Eskişehir', country: 'Türkiye', latitude: 39.7767, longitude: 30.5206 },
  { id: 'sanliurfa', name: 'Şanlıurfa', country: 'Türkiye', latitude: 37.1674, longitude: 38.7955 },
  { id: 'van', name: 'Van', country: 'Türkiye', latitude: 38.4891, longitude: 43.4089 },
  { id: 'malatya', name: 'Malatya', country: 'Türkiye', latitude: 38.3552, longitude: 38.3095 },
  { id: 'antakya', name: 'Antakya', admin1: 'Hatay', country: 'Türkiye', latitude: 36.2021, longitude: 36.1600 },
  { id: 'mugla', name: 'Muğla', country: 'Türkiye', latitude: 37.2153, longitude: 28.3636 },
  { id: 'canakkale', name: 'Çanakkale', country: 'Türkiye', latitude: 40.1553, longitude: 26.4142 },
  { id: 'rize', name: 'Rize', country: 'Türkiye', latitude: 41.0201, longitude: 40.5234 },
  { id: 'kars', name: 'Kars', country: 'Türkiye', latitude: 40.6013, longitude: 43.0975 },
  { id: 'nevsehir', name: 'Nevşehir', country: 'Türkiye', latitude: 38.6244, longitude: 34.7239 },
  { id: 'london', name: 'Londra', country: 'Birleşik Krallık', latitude: 51.5074, longitude: -0.1278 },
  { id: 'paris', name: 'Paris', country: 'Fransa', latitude: 48.8566, longitude: 2.3522 },
  { id: 'berlin', name: 'Berlin', country: 'Almanya', latitude: 52.5200, longitude: 13.4050 },
  { id: 'rome', name: 'Roma', country: 'İtalya', latitude: 41.9028, longitude: 12.4964 },
  { id: 'madrid', name: 'Madrid', country: 'İspanya', latitude: 40.4168, longitude: -3.7038 },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Hollanda', latitude: 52.3676, longitude: 4.9041 },
  { id: 'moscow', name: 'Moskova', country: 'Rusya', latitude: 55.7558, longitude: 37.6173 },
  { id: 'cairo', name: 'Kahire', country: 'Mısır', latitude: 30.0444, longitude: 31.2357 },
  { id: 'dubai', name: 'Dubai', country: 'Birleşik Arap Emirlikleri', latitude: 25.2048, longitude: 55.2708 },
  { id: 'riyadh', name: 'Riyad', country: 'Suudi Arabistan', latitude: 24.7136, longitude: 46.6753 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japonya', latitude: 35.6762, longitude: 139.6503 },
  { id: 'seoul', name: 'Seul', country: 'Güney Kore', latitude: 37.5665, longitude: 126.9780 },
  { id: 'beijing', name: 'Pekin', country: 'Çin', latitude: 39.9042, longitude: 116.4074 },
  { id: 'singapore', name: 'Singapur', country: 'Singapur', latitude: 1.3521, longitude: 103.8198 },
  { id: 'bangkok', name: 'Bangkok', country: 'Tayland', latitude: 13.7563, longitude: 100.5018 },
  { id: 'mumbai', name: 'Mumbai', country: 'Hindistan', latitude: 19.0760, longitude: 72.8777 },
  { id: 'new-delhi', name: 'Yeni Delhi', country: 'Hindistan', latitude: 28.6139, longitude: 77.2090 },
  { id: 'new-york', name: 'New York', country: 'ABD', latitude: 40.7128, longitude: -74.0060 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'ABD', latitude: 34.0522, longitude: -118.2437 },
  { id: 'mexico-city', name: 'Mexico City', country: 'Meksika', latitude: 19.4326, longitude: -99.1332 },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brezilya', latitude: -23.5505, longitude: -46.6333 },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Arjantin', latitude: -34.6037, longitude: -58.3816 },
  { id: 'cape-town', name: 'Cape Town', country: 'Güney Afrika', latitude: -33.9249, longitude: 18.4241 },
  { id: 'sydney', name: 'Sidney', country: 'Avustralya', latitude: -33.8688, longitude: 151.2093 },
];

const resultCache = new Map<string, { expiresAt: number; data: WeatherData }>();
const pendingRequests = new Map<string, Promise<WeatherData>>();
const suggestionCache = new Map<string, { expiresAt: number; data: WeatherLocation[] }>();
const summaryCache = new Map<string, { expiresAt: number; data: CityWeatherSummary }>();
const CACHE_DURATION = 10 * 60 * 1000;
const SUGGESTION_CACHE_DURATION = 30 * 60 * 1000;

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
    const raw = await response.json() as ForecastApiResponse;
    if (!raw.current || !raw.hourly || !raw.daily) throw new Error('Bu konum için yeterli hava verisi bulunamadı.');
    const { current, hourly, daily } = raw;

    const data: WeatherData = {
      location: { ...location, timezone: raw.timezone },
      current: {
        time: current.time,
        temperature: round(current.temperature_2m),
        feelsLike: round(current.apparent_temperature),
        humidity: round(current.relative_humidity_2m),
        precipitation: current.precipitation ?? 0,
        code: current.weather_code ?? 0,
        cloudCover: round(current.cloud_cover),
        pressure: round(current.surface_pressure),
        windSpeed: round(current.wind_speed_10m),
        windDirection: round(current.wind_direction_10m),
        isDay: current.is_day === 1,
      },
      hourly: hourly.time.map((time: string, index: number) => ({
        time,
        temperature: round(hourly.temperature_2m[index]),
        precipitationChance: round(hourly.precipitation_probability[index]),
        humidity: round(hourly.relative_humidity_2m[index]),
        code: hourly.weather_code[index] ?? 0,
      })),
      daily: daily.time.map((date: string, index: number) => ({
        date,
        code: daily.weather_code[index] ?? 0,
        max: round(daily.temperature_2m_max[index]),
        min: round(daily.temperature_2m_min[index]),
        precipitationChance: round(daily.precipitation_probability_max[index]),
        sunrise: daily.sunrise[index],
        sunset: daily.sunset[index],
        uvIndex: Math.round((daily.uv_index_max[index] ?? 0) * 10) / 10,
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

export async function suggestCities(query: string, signal?: AbortSignal): Promise<WeatherLocation[]> {
  const value = query.trim();
  if (value.length < 2) return [];

  const cacheKey = value.toLocaleLowerCase('tr-TR');
  const cached = suggestionCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', value);
  url.searchParams.set('count', '7');
  url.searchParams.set('language', 'tr');
  url.searchParams.set('format', 'json');
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error('Şehir araması şu anda yapılamıyor. Lütfen tekrar deneyin.');
  const raw = await response.json() as GeocodingApiResponse;
  const locations: WeatherLocation[] = (raw.results ?? []).map((result) => ({
    id: String(result.id ?? `${result.latitude},${result.longitude}`),
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }));

  suggestionCache.set(cacheKey, { expiresAt: Date.now() + SUGGESTION_CACHE_DURATION, data: locations });
  return locations;
}

export async function searchCity(query: string): Promise<WeatherData> {
  const value = query.trim();
  if (value.length < 2) throw new Error('Lütfen en az iki harf içeren bir şehir adı yazın.');
  const result = (await suggestCities(value))[0];
  if (!result) throw new Error(`“${value}” için bir şehir bulamadık. Yazımı kontrol edip tekrar deneyin.`);

  return fetchWeather(result);
}

export async function fetchFeaturedWeather(locations: WeatherLocation[] = featuredLocations): Promise<CityWeatherSummary[]> {
  const uniqueLocations = locations.filter((location, index, all) => all.findIndex((item) => item.id === location.id || (item.latitude === location.latitude && item.longitude === location.longitude)) === index);
  const now = Date.now();
  const missing = uniqueLocations.filter((location) => {
    const key = `${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}`;
    return !summaryCache.get(key) || summaryCache.get(key)!.expiresAt <= now;
  });

  if (missing.length > 0) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', missing.map((location) => location.latitude).join(','));
    url.searchParams.set('longitude', missing.map((location) => location.longitude).join(','));
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '1');

    const response = await fetch(url);
    if (!response.ok) throw new Error('Şehir özetleri şu anda yüklenemiyor.');
    const responseData = await response.json() as ForecastApiResponse | ForecastApiResponse[];
    const rows = Array.isArray(responseData) ? responseData : [responseData];

    rows.forEach((raw, index) => {
      const location = missing[index];
      if (!location || !raw.current || !raw.daily) return;
      const summary: CityWeatherSummary = {
        location: { ...location, timezone: raw.timezone },
        current: {
          temperature: round(raw.current.temperature_2m),
          feelsLike: round(raw.current.apparent_temperature),
          humidity: round(raw.current.relative_humidity_2m),
          precipitation: raw.current.precipitation ?? 0,
          code: raw.current.weather_code ?? 0,
          windSpeed: round(raw.current.wind_speed_10m),
          isDay: raw.current.is_day === 1,
        },
        today: {
          max: round(raw.daily.temperature_2m_max[0]),
          min: round(raw.daily.temperature_2m_min[0]),
          precipitationChance: round(raw.daily.precipitation_probability_max[0]),
        },
      };
      const key = `${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}`;
      summaryCache.set(key, { expiresAt: Date.now() + CACHE_DURATION, data: summary });
    });
  }

  return uniqueLocations.flatMap((location) => {
    const key = `${location.latitude.toFixed(3)},${location.longitude.toFixed(3)}`;
    const cached = summaryCache.get(key)?.data;
    return cached ? [{ ...cached, location: { ...location, timezone: cached.location.timezone } }] : [];
  });
}
