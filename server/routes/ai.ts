import { Router } from 'express';

const router = Router();

const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

router.post('/generate', async (req, res) => {
  try {
    const { prompt, temperature = 0.3, maxOutputTokens = 768 } = req.body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const response = await fetch(`${MODEL_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message =
        errorBody?.error?.message ||
        `Gemini API error: ${response.status} ${response.statusText}`;
      return res.status(response.status).json({ error: message });
    }

    const data = await response.json();
    const text =
      data?.candidates
        ?.flatMap((candidate: any) => candidate?.content?.parts ?? [])
        ?.map((part: any) => part?.text)
        ?.filter(Boolean)
        ?.join('\n')
        ?.trim() || '';

    if (!text) {
      return res.status(502).json({ error: 'Gemini response was empty.' });
    }

    res.json({ text });
  } catch (error) {
    console.error('Gemini proxy error:', error);
    res.status(500).json({ error: 'Failed to generate AI output.' });
  }
});

export default router;

