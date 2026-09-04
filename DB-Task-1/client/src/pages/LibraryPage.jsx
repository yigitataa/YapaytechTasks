import { useEffect, useState } from 'react';
import BookForm from '../components/BookForm.jsx';
import * as authorsService from '../services/authorsService.js';
import * as booksService from '../services/booksService.js';
import { getErrorMessage } from '../services/api.js';

const pageSize = 8;
const statusLabels = {
  to_read: 'Okunacak',
  reading: 'Okunuyor',
  completed: 'Tamamlandı',
};

function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ title: '', status: '' });
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formBook, setFormBook] = useState(undefined);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadAuthors() {
      try {
        const result = await authorsService.listAuthors();
        if (!ignore) {
          setAuthors(result);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getErrorMessage(requestError));
        }
      }
    }

    loadAuthors();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    let ignore = false;

    async function loadBooks() {
      setIsLoading(true);
      setError('');

      try {
        const result = await booksService.listBooks({
          ...filters,
          page,
          limit: pageSize,
        });

        if (!ignore) {
          setBooks(result.data);
          setPagination(result.pagination);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadBooks();
    return () => {
      ignore = true;
    };
  }, [filters, page, refreshKey]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setFilters((current) => ({ ...current, title: searchInput.trim() }));
  }

  function handleStatusChange(event) {
    setPage(1);
    setFilters((current) => ({ ...current, status: event.target.value }));
  }

  function openCreateForm() {
    setError('');
    setSuccess('');
    setFormBook(null);
  }

  function openEditForm(book) {
    setError('');
    setSuccess('');
    setFormBook(book);
  }

  async function handleSave(bookData) {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (formBook) {
        await booksService.updateBook(formBook.id, bookData);
        setSuccess('Kitap başarıyla güncellendi.');
      } else {
        await booksService.createBook(bookData);
        setSuccess('Kitap başarıyla eklendi.');
      }

      setFormBook(undefined);
      setPage(1);
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(book) {
    const confirmed = window.confirm(
      `“${book.title}” kitabını silmek istediğinizden emin misiniz?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await booksService.deleteBook(book.id);
      setSuccess('Kitap başarıyla silindi.');

      if (books.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setRefreshKey((current) => current + 1);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <p className="eyebrow">Koleksiyon</p>
          <h2>Kitaplığım</h2>
          <p className="intro-copy">
            Kitaplarını ara, okuma durumunu takip et ve yeni kayıtlar ekle.
          </p>
        </div>
        <button className="button primary" type="button" onClick={openCreateForm}>
          + Kitap ekle
        </button>
      </section>

      {formBook !== undefined && (
        <BookForm
          book={formBook}
          authors={authors}
          isSubmitting={isSubmitting}
          onSubmit={handleSave}
          onCancel={() => setFormBook(undefined)}
        />
      )}

      <div className="message-area" aria-live="polite">
        {error && <p className="notice error">{error}</p>}
        {success && <p className="notice success">{success}</p>}
      </div>

      <section className="panel">
        <form className="filters" onSubmit={handleSearch}>
          <label className="search-field">
            <span className="sr-only">Kitap adına göre ara</span>
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Kitap adına göre ara…"
            />
          </label>
          <button className="button secondary" type="submit">
            Ara
          </button>
          <label>
            <span className="sr-only">Okuma durumuna göre filtrele</span>
            <select value={filters.status} onChange={handleStatusChange}>
              <option value="">Tüm durumlar</option>
              <option value="to_read">Okunacak</option>
              <option value="reading">Okunuyor</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </label>
        </form>

        <div className="list-summary">
          <strong>{pagination.total} kitap</strong>
          {(filters.title || filters.status) && (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                setSearchInput('');
                setFilters({ title: '', status: '' });
                setPage(1);
              }}
            >
              Filtreleri temizle
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="state-box">Kitaplar yükleniyor…</div>
        ) : books.length === 0 ? (
          <div className="state-box">
            <strong>Gösterilecek kitap bulunamadı.</strong>
            <span>Yeni bir kitap ekleyebilir veya filtreleri değiştirebilirsin.</span>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <article className="book-card" key={book.id}>
                <div className="book-card-top">
                  <span className={`status-badge ${book.status}`}>
                    {statusLabels[book.status]}
                  </span>
                  <span className="book-mark" aria-hidden="true">K</span>
                </div>
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.authorName}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="button secondary small"
                    type="button"
                    onClick={() => openEditForm(book)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="button danger small"
                    type="button"
                    onClick={() => handleDelete(book)}
                  >
                    Sil
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="pagination" aria-label="Sayfalama">
            <button
              className="button secondary small"
              type="button"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((current) => current - 1)}
            >
              Önceki
            </button>
            <span>
              Sayfa <strong>{pagination.page}</strong> / {pagination.totalPages}
            </span>
            <button
              className="button secondary small"
              type="button"
              disabled={page === pagination.totalPages || isLoading}
              onClick={() => setPage((current) => current + 1)}
            >
              Sonraki
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default LibraryPage;
