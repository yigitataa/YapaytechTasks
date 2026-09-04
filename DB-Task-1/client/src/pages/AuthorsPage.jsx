import { useEffect, useState } from 'react';
import * as authorsService from '../services/authorsService.js';
import { getErrorMessage } from '../services/api.js';

function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState('');
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadAuthors() {
      setIsLoading(true);
      setError('');

      try {
        const result = await authorsService.listAuthors();
        if (!ignore) {
          setAuthors(result);
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

    loadAuthors();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  function startEditing(author) {
    setEditingAuthor(author);
    setName(author.name);
    setError('');
    setSuccess('');
  }

  function resetForm() {
    setEditingAuthor(null);
    setName('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingAuthor) {
        await authorsService.updateAuthor(editingAuthor.id, name.trim());
        setSuccess('Yazar başarıyla güncellendi.');
      } else {
        await authorsService.createAuthor(name.trim());
        setSuccess('Yazar başarıyla eklendi.');
      }

      resetForm();
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(author) {
    const confirmed = window.confirm(
      `“${author.name}” yazarını silmek istediğinizden emin misiniz?`,
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await authorsService.deleteAuthor(author.id);
      setSuccess('Yazar başarıyla silindi.');
      if (editingAuthor?.id === author.id) {
        resetForm();
      }
      setRefreshKey((current) => current + 1);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <p className="eyebrow">Katalog</p>
          <h2>Yazarlar</h2>
          <p className="intro-copy">
            Kitap formlarında kullanılacak yazar kayıtlarını yönet.
          </p>
        </div>
      </section>

      <div className="authors-layout">
        <section className="panel form-panel" aria-labelledby="author-form-title">
          <p className="eyebrow">{editingAuthor ? 'Kaydı güncelle' : 'Yeni kayıt'}</p>
          <h2 id="author-form-title">
            {editingAuthor ? 'Yazarı düzenle' : 'Yazar ekle'}
          </h2>
          <form className="author-form" onSubmit={handleSubmit}>
            <label>
              Yazar adı
              <input
                required
                maxLength="200"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. Sabahattin Ali"
              />
            </label>
            <div className="form-actions">
              <button
                className="button primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Kaydediliyor…'
                  : editingAuthor
                    ? 'Değişiklikleri kaydet'
                    : 'Yazarı kaydet'}
              </button>
              {editingAuthor && (
                <button
                  className="button secondary"
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Vazgeç
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="panel authors-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Kayıtlar</p>
              <h2>Yazar listesi</h2>
            </div>
            <span className="count-pill">{authors.length}</span>
          </div>

          <div className="message-area" aria-live="polite">
            {error && <p className="notice error">{error}</p>}
            {success && <p className="notice success">{success}</p>}
          </div>

          {isLoading ? (
            <div className="state-box">Yazarlar yükleniyor…</div>
          ) : authors.length === 0 ? (
            <div className="state-box">
              <strong>Henüz yazar eklenmemiş.</strong>
              <span>Soldaki formdan ilk yazarı oluşturabilirsin.</span>
            </div>
          ) : (
            <ul className="author-list">
              {authors.map((author) => (
                <li key={author.id}>
                  <span className="author-avatar" aria-hidden="true">
                    {author.name.charAt(0).toLocaleUpperCase('tr-TR')}
                  </span>
                  <strong>{author.name}</strong>
                  <div className="row-actions">
                    <button
                      className="button secondary small"
                      type="button"
                      onClick={() => startEditing(author)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="button danger small"
                      type="button"
                      onClick={() => handleDelete(author)}
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default AuthorsPage;
