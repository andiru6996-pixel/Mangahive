export const maxDuration = 60; // Vercel Pro: 60s; Hobby: capped at 10s

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, endpoint, body } = req.body;
  if (!token || !endpoint || !body) return res.status(400).json({ error: 'Missing token, endpoint, or body' });

  try {
    const openaiRes = await fetch(`https://api.openai.com${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      return res.status(openaiRes.status).json({ error: err?.error?.message || `HTTP ${openaiRes.status}` });
    }

    const data = await openaiRes.json();

    // For image generation: fetch the CDN image server-side and return as binary
    // (the CDN URL blocks browser CORS fetches)
    const imgUrl = data?.data?.[0]?.url;
    if (imgUrl) {
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) return res.status(502).json({ error: 'Failed to fetch generated image from CDN' });
      const buffer = await imgRes.arrayBuffer();
      res.setHeader('Content-Type', 'image/png');
      return res.status(200).send(Buffer.from(buffer));
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
