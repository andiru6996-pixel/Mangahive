export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { supabaseUrl, serviceKey, path, dataBase64, contentType } = req.body;

  if (!serviceKey) return res.status(400).json({ error: 'Service role key is required — paste it in the Supabase Connection panel' });
  if (!supabaseUrl || !path || !dataBase64) return res.status(400).json({ error: 'Missing supabaseUrl, path, or dataBase64' });

  try {
    const buffer = Buffer.from(dataBase64, 'base64');
    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/manga-images/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': contentType || 'image/png',
        'x-upsert': 'true'
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return res.status(uploadRes.status).json({ error: err });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/manga-images/${path}`;
    return res.status(200).json({ publicUrl });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
