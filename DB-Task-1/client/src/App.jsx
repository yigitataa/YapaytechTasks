import { useState } from 'react';
import AuthorsPage from './pages/AuthorsPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';

function App() {
  const [activePage, setActivePage] = useState('library');

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Kişisel arşiv</p>
          <h1>Kitaplık ve Okuma Günlüğü</h1>
        </div>
        <nav aria-label="Ana menü" className="main-nav">
          <button
            className={activePage === 'library' ? 'nav-link active' : 'nav-link'}
            type="button"
            onClick={() => setActivePage('library')}
          >
            Kitaplığım
          </button>
          <button
            className={activePage === 'authors' ? 'nav-link active' : 'nav-link'}
            type="button"
            onClick={() => setActivePage('authors')}
          >
            Yazarlar
          </button>
        </nav>
      </header>

      <main>
        {activePage === 'library' ? <LibraryPage /> : <AuthorsPage />}
      </main>
    </div>
  );
}

export default App;
