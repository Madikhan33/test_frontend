const API_URL = 'https://recycling-register-contacted-mirror.trycloudflare.com/praise'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ detail: 'Method not allowed' })
    return
  }

  const apiKey = process.env.API_KEY

  if (!apiKey) {
    res.status(500).json({ detail: 'API key not configured' })
    return
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ detail: 'Internal server error' })
  }
}
