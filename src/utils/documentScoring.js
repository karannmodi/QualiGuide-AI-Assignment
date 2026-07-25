import { STOPWORDS } from '../constants/stopwords.js';

export function scoreDocuments(text, documents) {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = clean.split(/\s+/).filter((w) => w && !STOPWORDS.has(w));
  if (words.length === 0) return [];

  return documents
    .map((doc) => {
      const bodyText = (doc.title + ' ' + doc.fullText).toLowerCase();
      let score = 0;
      words.forEach((w) => {
        if (doc.tags.some((t) => t.toLowerCase().includes(w) || w.includes(t.toLowerCase()))) score += 3;
        else if (bodyText.includes(w)) score += 1;
      });
      return { doc, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function matchQuestion(question, documents) {
  const ranked = scoreDocuments(question, documents);
  const top = ranked[0];
  return top && top.score >= 3 ? top.doc : null;
}
