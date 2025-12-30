/**
 * LinkedIn Post Rewrite Prompt Template
 * Generates both LinkedIn text and image prompt
 */
export const LINKEDIN_REWRITE_PROMPT = `Sei un esperto di content marketing per LinkedIn nel settore AI e Marketing digitale.

ARTICOLO ORIGINALE:
Titolo: {{title}}
Contenuto: {{content}}
Fonte: {{source}}

ISTRUZIONI:
1. Riscrivi questo articolo come post LinkedIn professionale
2. Lunghezza: 150-300 parole (ideale per engagement)
3. Struttura:
   - Hook iniziale catchy (prima riga cruciale per catturare attenzione)
   - 2-3 punti chiave con emoji appropriati
   - Call-to-action finale che stimoli la discussione
4. Tono: {{tone}} (mantieni questo tono costante)
5. Includi 3-5 hashtag rilevanti alla fine
6. NON copiare testo letteralmente - RIFORMULA sempre con parole tue
7. Rendi il contenuto coinvolgente e adatto al pubblico LinkedIn
8. Genera anche un prompt dettagliato per creare un'immagine correlata

IMPORTANTE: Genera ANCHE un prompt per l'immagine che sia:
- Specifico per questo contenuto (non generico)
- Descriva scene, colori, stile visivo
- Adatto per un'immagine LinkedIn professionale
- 2-3 frasi descrittive

OUTPUT in formato JSON (SOLO JSON, niente altro):
{
  "linkedin_post": "Il testo completo del post LinkedIn...",
  "image_prompt": "Prompt dettagliato di 2-3 frasi per generare un'immagine unica e pertinente per questo specifico contenuto. Descrivi lo stile visivo, i colori, gli elementi chiave da rappresentare, la composizione."
}

Rispondi SOLO con il JSON, niente altro testo prima o dopo.`;

/**
 * Fill template with article data
 */
export function fillTemplate(template, article, tone = 'professional') {
  return template
    .replace('{{title}}', article.title)
    .replace('{{content}}', article.content || article.description || '')
    .replace('{{source}}', article.source)
    .replace('{{tone}}', tone);
}

/**
 * Available tones
 */
export const TONES = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  INSPIRATIONAL: 'inspirational'
};

/**
 * Tone descriptions for prompts
 */
export const TONE_DESCRIPTIONS = {
  professional: 'Professionale ma accessibile, con linguaggio chiaro e diretto',
  casual: 'Casual e colloquiale, come una conversazione tra colleghi',
  inspirational: 'Ispirazionale e motivante, con enfasi su opportunità e crescita'
};

export default {
  LINKEDIN_REWRITE_PROMPT,
  fillTemplate,
  TONES,
  TONE_DESCRIPTIONS
};
