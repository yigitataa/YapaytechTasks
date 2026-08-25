'use client';

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchFeaturedWeather,
  fetchWeather,
  featuredLocations,
  getWeatherCondition,
  searchCity,
  suggestCities,
  type WeatherData,
  type WeatherLocation,
} from './weather-service';

type SavedSearch = WeatherLocation & { favorite: boolean };

const STORAGE_KEY = 'yataclimate-searches-v1';
const dayFormatter = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' });
const dateFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });
const hourFormatter = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });

function WeatherGlyph({ kind, small = false }: { kind: string; small?: boolean }) {
  return <span className={`condition-icon condition-icon-${kind}${small ? ' condition-icon-small' : ''}`} aria-hidden="true"><i /><b /></span>;
}

function citySubtitle(location: WeatherLocation) {
  return [location.admin1, location.country].filter((part, index, all) => part && all.indexOf(part) === index).join(', ');
}

function formatHour(value: string) {
  return hourFormatter.format(new Date(value));
}

function weatherAnalysis(weather: WeatherData) {
  const notes: string[] = [];
  const rain = weather.daily[0]?.precipitationChance ?? 0;
  const uv = weather.daily[0]?.uvIndex ?? 0;
  if (rain >= 60) notes.push(`Yağış olasılığı %${rain}; şemsiyeyi yanında tutmak iyi fikir.`);
  else if (rain <= 20) notes.push('Yağış olasılığı düşük; açık hava planları için uygun görünüyor.');
  if (weather.current.windSpeed >= 30) notes.push('Rüzgâr zaman zaman kuvvetli hissedilebilir.');
  if (uv >= 6) notes.push(`UV indeksi ${uv}; öğle saatlerinde korunmayı unutma.`);
  if (weather.current.humidity >= 75) notes.push('Yüksek nem, hissedilen sıcaklığı belirginleştirebilir.');
  return notes.slice(0, 2).join(' ') || 'Koşullar dengeli; gün içinde belirgin bir hava riski beklenmiyor.';
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const normalizedText = text.toLocaleLowerCase('tr-TR');
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');
  const matchIndex = normalizedText.indexOf(normalizedQuery);
  if (!normalizedQuery || matchIndex < 0) return text;
  const matchEnd = matchIndex + normalizedQuery.length;
  return <>{text.slice(0, matchIndex)}<mark>{text.slice(matchIndex, matchEnd)}</mark>{text.slice(matchEnd)}</>;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState<WeatherData[]>([]);
  const [selected, setSelected] = useState<WeatherData | null>(null);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [suggestions, setSuggestions] = useState<WeatherLocation[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const requestNumber = useRef(0);
  const detailData = useRef<WeatherData | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setSearches(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      setHydrated(true);
    });
    fetchFeaturedWeather().then((data) => active && setFeatured(data)).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSuggestionsLoading(true);
      setSuggestionsLoaded(false);
      try {
        const matches = await suggestCities(value, controller.signal);
        if (controller.signal.aborted) return;
        setSuggestions(matches);
        setSuggestionsOpen(true);
        setSuggestionsLoaded(true);
        setActiveSuggestion(-1);
      } catch (caught) {
        if (controller.signal.aborted || (caught instanceof DOMException && caught.name === 'AbortError')) return;
        setSuggestions([]);
        setSuggestionsLoaded(true);
      } finally {
        if (!controller.signal.aborted) setSuggestionsLoading(false);
      }
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      requestNumber.current += 1;
      setLoading(false);
      setError('');
      setSuggestionsOpen(false);
      if (event.state?.yataclimateDetail && detailData.current) setSelected(detailData.current);
      else setSelected(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const favorites = useMemo(() => searches.filter((item) => item.favorite), [searches]);
  const history = useMemo(() => searches.filter((item) => !item.favorite), [searches]);

  function persist(next: SavedSearch[]) {
    setSearches(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function recordLocation(location: WeatherLocation) {
    const existing = searches.find((item) => item.id === location.id || (item.latitude === location.latitude && item.longitude === location.longitude));
    const next: SavedSearch[] = [
      { ...location, favorite: existing?.favorite ?? false },
      ...searches.filter((item) => item.id !== existing?.id && item.id !== location.id),
    ].slice(0, 10);
    persist(next);
  }

  function toggleFavorite(id: string) {
    persist(searches.map((item) => item.id === id ? { ...item, favorite: !item.favorite } : item));
  }

  function showDetail(data: WeatherData) {
    detailData.current = data;
    if (!window.history.state?.yataclimateDetail) {
      window.history.pushState({ ...(window.history.state ?? {}), yataclimateDetail: true }, '');
    }
    setSelected(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeDetail() {
    if (window.history.state?.yataclimateDetail) window.history.back();
    else setSelected(null);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setError('');
    setActiveSuggestion(-1);
    setSuggestions([]);
    const canSuggest = value.trim().length >= 2;
    setSuggestionsOpen(canSuggest);
    setSuggestionsLoading(canSuggest);
    setSuggestionsLoaded(false);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!suggestionsOpen) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter' && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      event.preventDefault();
      void chooseSuggestion(suggestions[activeSuggestion]);
    } else if (event.key === 'Escape') {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
  }

  async function chooseSuggestion(location: WeatherLocation) {
    setQuery('');
    setSuggestions([]);
    setSuggestionsOpen(false);
    setSuggestionsLoading(false);
    setSuggestionsLoaded(false);
    await openLocation(location);
  }

  async function openLocation(location: WeatherLocation, readyData?: WeatherData) {
    const currentRequest = ++requestNumber.current;
    setError('');
    setLoading(true);
    try {
      const data = readyData ?? await fetchWeather(location);
      if (currentRequest !== requestNumber.current) return;
      recordLocation(data.location);
      showDetail(data);
    } catch (caught) {
      if (currentRequest === requestNumber.current) setError(caught instanceof Error ? caught.message : 'Beklenmeyen bir sorun oluştu.');
    } finally {
      if (currentRequest === requestNumber.current) setLoading(false);
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (suggestionsOpen && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      await chooseSuggestion(suggestions[activeSuggestion]);
      return;
    }
    const currentRequest = ++requestNumber.current;
    setError('');
    setSuggestionsOpen(false);
    setLoading(true);
    try {
      const data = await searchCity(query);
      if (currentRequest !== requestNumber.current) return;
      recordLocation(data.location);
      showDetail(data);
      setQuery('');
    } catch (caught) {
      if (currentRequest === requestNumber.current) setError(caught instanceof Error ? caught.message : 'Beklenmeyen bir sorun oluştu.');
    } finally {
      if (currentRequest === requestNumber.current) setLoading(false);
    }
  }

  if (selected) {
    const condition = getWeatherCondition(selected.current.code, selected.current.isDay);
    const nextHours = selected.hourly.filter((hour) => new Date(hour.time).getTime() >= new Date(selected.current.time).getTime()).slice(0, 12);
    const saved = searches.find((item) => item.id === selected.location.id || (item.latitude === selected.location.latitude && item.longitude === selected.location.longitude));

    return (
      <main className={`detail-page detail-theme-${condition.theme}`}>
        <header className="site-header detail-header">
          <button className="brand-mark brand-button" type="button" onClick={closeDetail}>
            <span className="brand-symbol" aria-hidden="true"><i /></span>
            <span>YataClimate</span>
          </button>
          <button className="back-button" type="button" onClick={closeDetail}><span aria-hidden="true">←</span> Şehirlere dön</button>
        </header>

        <section className="detail-wrap">
          <div className="detail-hero-card">
            <div className="detail-location">
              <p className="detail-overline">CANLI DURUM · {formatHour(selected.current.time)}</p>
              <h1>{selected.location.name}</h1>
              <p>{citySubtitle(selected.location)}</p>
              <button className={`detail-favorite${saved?.favorite ? ' is-favorite' : ''}`} type="button" onClick={() => saved && toggleFavorite(saved.id)} aria-label={saved?.favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}>
                <span aria-hidden="true">{saved?.favorite ? '★' : '☆'}</span> {saved?.favorite ? 'Favorilerde' : 'Favoriye ekle'}
              </button>
            </div>
            <div className="weather-scene">
              <WeatherGlyph kind={condition.icon} />
              <span className="scene-ring scene-ring-one" /><span className="scene-ring scene-ring-two" />
            </div>
            <div className="temperature-block">
              <span className="temperature weather-value">{selected.current.temperature}°</span>
              <strong>{condition.label}</strong>
              <small>Hissedilen {selected.current.feelsLike}°</small>
            </div>
          </div>

          <section className="analysis-banner">
            <span className="analysis-index">01</span>
            <div><p>GÜNÜN ANALİZİ</p><h2>{weatherAnalysis(selected)}</h2></div>
          </section>

          <section className="metrics-grid" aria-label="Anlık hava detayları">
            <article><span>Nem</span><strong className="weather-value">%{selected.current.humidity}</strong><small>Havadaki nem oranı</small></article>
            <article><span>Rüzgâr</span><strong className="weather-value">{selected.current.windSpeed} <i>km/sa</i></strong><small>{selected.current.windDirection}° yönünden</small></article>
            <article><span>Basınç</span><strong className="weather-value">{selected.current.pressure} <i>hPa</i></strong><small>Yüzey basıncı</small></article>
            <article><span>Yağış</span><strong className="weather-value">{selected.current.precipitation} <i>mm</i></strong><small>Şu an ölçülen</small></article>
            <article><span>Bulut</span><strong className="weather-value">%{selected.current.cloudCover}</strong><small>Gökyüzü kapalılığı</small></article>
            <article><span>UV</span><strong className="weather-value">{selected.daily[0]?.uvIndex ?? 0}</strong><small>Günlük en yüksek</small></article>
          </section>

          <section className="forecast-panel hourly-panel">
            <div className="panel-title"><div><p>ÖNÜMÜZDEKİ SAATLER</p><h2>Saatlik tahmin</h2></div><span>12 saat</span></div>
            <div className="hourly-list">
              {nextHours.map((hour, index) => {
                const hourCondition = getWeatherCondition(hour.code, true);
                return (
                  <article className={index === 0 ? 'is-now' : ''} key={hour.time}>
                    <time>{index === 0 ? 'Şimdi' : formatHour(hour.time)}</time>
                    <WeatherGlyph kind={hourCondition.icon} small />
                    <strong className="weather-value">{hour.temperature}°</strong>
                    <span className="rain-chance">%{hour.precipitationChance}</span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="forecast-panel daily-panel">
            <div className="panel-title"><div><p>HAFTANIN GÖRÜNÜMÜ</p><h2>7 günlük tahmin</h2></div><span>{selected.location.timezone?.replace('_', ' ')}</span></div>
            <div className="daily-list">
              {selected.daily.map((day, index) => {
                const dayCondition = getWeatherCondition(day.code, true);
                return (
                  <article key={day.date}>
                    <div className="day-name"><strong>{index === 0 ? 'Bugün' : dayFormatter.format(new Date(`${day.date}T12:00:00`))}</strong><small>{dateFormatter.format(new Date(`${day.date}T12:00:00`))}</small></div>
                    <div className="day-condition"><WeatherGlyph kind={dayCondition.icon} small /><span>{dayCondition.label}</span></div>
                    <span className="day-rain">%{day.precipitationChance} yağış</span>
                    <div className="day-temps"><strong className="weather-value">{day.max}°</strong><span className="weather-value">{day.min}°</span></div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="sun-strip">
            <div><span className="sun-dot" /><p>Gün doğumu<strong>{formatHour(selected.daily[0].sunrise)}</strong></p></div>
            <span className="sun-path" />
            <div><span className="moon-dot" /><p>Gün batımı<strong>{formatHour(selected.daily[0].sunset)}</strong></p></div>
          </section>
        </section>
        <footer className="site-footer">YataClimate · Veriler Open-Meteo tarafından sağlanır.</footer>
        {loading && <LoadingOverlay />}
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="sky-orb sky-orb-one" aria-hidden="true" />
      <div className="sky-orb sky-orb-two" aria-hidden="true" />
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="YataClimate ana sayfa"><span className="brand-symbol" aria-hidden="true"><i /></span><span>YataClimate</span></a>
        <nav className="mini-nav" aria-label="Sayfa bölümleri">
          <a href="#favorites">Favoriler <span>{favorites.length}</span></a>
          <a href="#history">Geçmiş <span>{history.length}</span></a>
        </nav>
        <div className="live-pill"><span /> Canlı hava verisi</div>
      </header>

      <section className="hero" id="top">
        <div className="search-area">
          <form className={`search-box${suggestionsOpen ? ' has-suggestions' : ''}`} onSubmit={handleSearch}>
            <span className="search-icon" aria-hidden="true" />
            <label className="sr-only" htmlFor="city-search">Şehir ara</label>
            <input
              id="city-search"
              name="city"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => query.trim().length >= 2 && setSuggestionsOpen(true)}
              onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 120)}
              placeholder="Şehir ara — örn. Eskişehir"
              autoComplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={suggestionsOpen}
              aria-controls="city-suggestions"
              aria-activedescendant={activeSuggestion >= 0 ? `city-suggestion-${activeSuggestion}` : undefined}
            />
            <button type="submit" disabled={loading}>Havayı gör <span aria-hidden="true">↗</span></button>
          </form>

          {suggestionsOpen && query.trim().length >= 2 && (
            <div className="suggestion-menu" id="city-suggestions" role="listbox" aria-label="Şehir önerileri">
              <div className="suggestion-heading"><span>ŞEHİR ÖNERİLERİ</span>{suggestionsLoading && <i>aranıyor…</i>}</div>
              {suggestionsLoading && suggestions.length === 0 && (
                <div className="suggestion-skeleton" aria-hidden="true"><span /><span /><span /></div>
              )}
              {!suggestionsLoading && suggestionsLoaded && suggestions.length === 0 && (
                <div className="suggestion-empty"><span aria-hidden="true">⌕</span><p>Bu aramayla eşleşen bir şehir bulamadık.</p></div>
              )}
              {suggestions.map((location, index) => (
                <button
                  id={`city-suggestion-${index}`}
                  className={`suggestion-item${activeSuggestion === index ? ' is-active' : ''}`}
                  type="button"
                  role="option"
                  aria-selected={activeSuggestion === index}
                  key={`${location.id}-${location.latitude}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  onClick={() => void chooseSuggestion(location)}
                >
                  <span className="suggestion-pin" aria-hidden="true"><i /></span>
                  <span className="suggestion-copy"><strong><HighlightedText text={location.name} query={query} /></strong><small>{citySubtitle(location)}</small></span>
                  <span className="suggestion-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
              {suggestions.length > 0 && <p className="suggestion-tip">↑ ↓ ile seç · Enter ile aç</p>}
            </div>
          )}

          {error && <div className="error-message" role="alert"><span aria-hidden="true">!</span>{error}<button type="button" onClick={() => setError('')} aria-label="Hata mesajını kapat">×</button></div>}
        </div>
      </section>

      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="section-heading"><div><p className="section-kicker">ŞİMDİ TÜRKİYE</p><h2 id="featured-heading">Öne çıkan şehirler</h2></div><p>Bir şehre dokun, detaylı tahmini keşfet.</p></div>
        <div className="city-grid">
          {featuredLocations.map((location, index) => {
            const weather = featured.find((item) => item.location.id === location.id);
            const condition = weather ? getWeatherCondition(weather.current.code, weather.current.isDay) : null;
            const tones = ['sunny', 'clear', 'warm'];
            return (
              <button className={`city-card city-card-${tones[index]}`} type="button" key={location.id} onClick={() => openLocation(location, weather)}>
                <span className="card-number">0{index + 1}</span>
                {condition ? <WeatherGlyph kind={condition.icon} /> : <span className="card-loader" aria-hidden="true" />}
                <span className="city-content"><strong>{location.name}</strong><small>{condition?.label ?? 'Hava verisi alınıyor'}</small></span>
                <span className="city-temp weather-value">{weather ? `${weather.current.temperature}°` : '—'}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="collections" aria-label="Kayıtlı şehirler">
        <div className="collection-card favorite-card" id="favorites">
          <div className="collection-heading"><div><p>★ FAVORİLER</p><h2>Öncelikli şehirler</h2></div><span>{favorites.length}</span></div>
          {hydrated && favorites.length > 0 ? (
            <div className="saved-list">{favorites.map((item) => <SavedCity key={item.id} item={item} onOpen={() => openLocation(item)} onStar={() => toggleFavorite(item.id)} />)}</div>
          ) : <EmptyCollection symbol="☆" text="Geçmiş aramalardaki yıldıza dokun; favorilerin burada öne çıksın." />}
        </div>
        <div className="collection-card history-card" id="history">
          <div className="collection-heading"><div><p>SON ARAMALAR</p><h2>Arama geçmişi</h2></div><span>{history.length}</span></div>
          {hydrated && history.length > 0 ? (
            <div className="saved-list">{history.map((item) => <SavedCity key={item.id} item={item} onOpen={() => openLocation(item)} onStar={() => toggleFavorite(item.id)} />)}</div>
          ) : <EmptyCollection symbol="⌕" text="Aradığın şehirler burada, en yenisi en üstte görünecek." />}
        </div>
      </section>

      <section className="activity-strip" aria-label="Veri saklama bilgisi"><p><span className="activity-dot" /> Aramalarınız ve favorileriniz yalnızca bu cihazda saklanır.</p><span className="activity-note">10 dakikalık akıllı önbellek gereksiz istekleri azaltır.</span></section>
      <footer className="site-footer">YataClimate · Veriler Open-Meteo tarafından sağlanır.</footer>
      {loading && <LoadingOverlay />}
    </main>
  );
}

function SavedCity({ item, onOpen, onStar }: { item: SavedSearch; onOpen: () => void; onStar: () => void }) {
  return (
    <div className="saved-city">
      <button className="saved-city-main" type="button" onClick={onOpen}><span>{item.name.charAt(0)}</span><span><strong>{item.name}</strong><small>{citySubtitle(item)}</small></span></button>
      <button className={`star-button${item.favorite ? ' is-favorite' : ''}`} type="button" onClick={onStar} aria-label={item.favorite ? `${item.name} şehrini favorilerden çıkar` : `${item.name} şehrini favorilere ekle`}><span aria-hidden="true">{item.favorite ? '★' : '☆'}</span></button>
    </div>
  );
}

function EmptyCollection({ symbol, text }: { symbol: string; text: string }) {
  return <div className="empty-collection"><span aria-hidden="true">{symbol}</span><p>{text}</p></div>;
}

function LoadingOverlay() {
  return <div className="loading-overlay" role="status" aria-live="polite"><div className="loading-sun"><span /></div><strong>Gökyüzü okunuyor</strong><small>En güncel veriler hazırlanıyor…</small></div>;
}
