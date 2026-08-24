const optionLetters = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));

export function normalizeQuestions(parsed) {
  const source = Array.isArray(parsed) ? parsed : parsed.questions;

  if (!Array.isArray(source) || source.length === 0) {
    throw new Error('JSON dosyasında en az bir sorudan oluşan bir dizi bulunmalı.');
  }

  return source.map((item, index) => {
    const question = item.question ?? item.soru ?? item.text;
    const letteredOptions = optionLetters
      .filter((letter) => typeof item[letter] === 'string')
      .map((letter) => item[letter]);
    const options = item.options ?? item.secenekler ?? item.choices ?? letteredOptions;
    const answerValue = item.answer ?? item.correctAnswer ?? item.dogruCevap;

    if (typeof question !== 'string' || !question.trim()) {
      throw new Error(`${index + 1}. sorunun metni eksik.`);
    }
    if (!Array.isArray(options) || options.length < 2 || options.some((option) => typeof option !== 'string')) {
      throw new Error(`${index + 1}. soruda en az iki metin seçeneği bulunmalı.`);
    }

    let answer = answerValue;
    if (typeof answerValue === 'string') {
      const letterIndex = /^[A-Z]$/i.test(answerValue)
        ? answerValue.toUpperCase().charCodeAt(0) - 65
        : -1;
      answer = letterIndex >= 0 ? letterIndex : options.indexOf(answerValue);
    }

    if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
      throw new Error(`${index + 1}. sorunun doğru cevap değeri geçersiz.`);
    }

    return {
      id: item.id ?? index + 1,
      category: item.category ?? item.kategori ?? 'Quiz',
      question: question.trim(),
      options,
      answer,
      explanation: item.explanation ?? item.aciklama ?? '',
    };
  });
}
