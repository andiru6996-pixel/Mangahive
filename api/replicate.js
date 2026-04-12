export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, token, body, predictionId } = req.body;

  try {
    if (action === 'create') {
      // Create prediction
      const replicateRes = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!replicateRes.ok) {
        const err = await replicateRes.json().catch(() => ({}));
        return res.status(replicateRes.status).json({
          error: err?.detail || err?.error || `HTTP ${replicateRes.status}`
        });
      }

      const data = await replicateRes.json();
      return res.status(200).json(data);
    }

    if (action === 'poll') {
      // Poll prediction status
      const replicateRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!replicateRes.ok) {
        const err = await replicateRes.json().catch(() => ({}));
        return res.status(replicateRes.status).json({
          error: err?.detail || `HTTP ${replicateRes.status}`
        });
      }

      const data = await replicateRes.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    console.error('Replicate proxy error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
