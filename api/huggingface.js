export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, model, body } = req.body;

  if (!token || !model || !body) {
    return res.status(400).json({ error: 'Missing token, model, or body' });
  }

  try {
    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!hfRes.ok) {
      const text = await hfRes.text();
      return res.status(hfRes.status).json({ error: text.substring(0, 500) });
    }

    const buffer = await hfRes.arrayBuffer();
    const contentType = hfRes.headers.get('content-type') || 'image/png';
    res.setHeader('Content-Type', contentType);
    res.status(200).send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
