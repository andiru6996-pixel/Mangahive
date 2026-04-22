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

    // Image generation returns binary — forward as-is
    const contentType = openaiRes.headers.get('content-type') || '';
    if (!openaiRes.ok) {
      const err = await openaiRes.json().catch(() => ({}));
      return res.status(openaiRes.status).json({ error: err?.error?.message || `HTTP ${openaiRes.status}` });
    }

    if (contentType.includes('image/')) {
      const buffer = await openaiRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.status(200).send(Buffer.from(buffer));
    }

    const data = await openaiRes.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
