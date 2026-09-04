import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  authorId: '',
  status: 'to_read',
};

function BookForm({ book, authors, isSubmitting, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(
      book
        ? {
            title: book.title,
            authorId: book.authorId,
            status: book.status,
          }
        : { ...emptyForm, authorId: authors[0]?.id ?? '' },
    );
  }, [book, authors]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    onSubmit({ ...form, title: form.title.trim() });
  }

  return (
    <section className="panel form-panel" aria-labelledby="book-form-title">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">{book ? 'Kaydı güncelle' : 'Yeni kayıt'}</p>
          <h2 id="book-form-title">{book ? 'Kitabı düzenle' : 'Kitap ekle'}</h2>
        </div>
        <button className="button ghost" type="button" onClick={onCancel}>
          Kapat
        </button>
      </div>

      {authors.length === 0 ? (
        <p className="notice info">
          Kitap eklemek için önce Yazarlar ekranından bir yazar oluşturun.
        </p>
      ) : (
        <form className="book-form" onSubmit={handleSubmit}>
          <label>
            Kitap adı
            <input
              autoFocus
              required
              maxLength="300"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Örn. Kürk Mantolu Madonna"
            />
          </label>

          <label>
            Yazar
            <select
              required
              name="authorId"
              value={form.authorId}
              onChange={handleChange}
            >
              <option value="" disabled>
                Yazar seçin
              </option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Okuma durumu
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="to_read">Okunacak</option>
              <option value="reading">Okunuyor</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </label>

          <div className="form-actions">
            <button
              className="button primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Kaydediliyor…'
                : book
                  ? 'Değişiklikleri kaydet'
                  : 'Kitabı kaydet'}
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default BookForm;
