const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { authenticator } = require('otplib');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Server is running...!");
})

// 2FA Generation Endpoint
app.post('/api/2fa', (req, res) => {
    const { secret } = req.body;
    
    if (!secret || secret.trim() === '') {
        return res.status(400).json({ success: false, error: 'Secret key is required' });
    }

    try {
        // Clean up the secret (remove spaces, etc.)
        const cleanSecret = secret.replace(/\s+/g, '').toUpperCase();
        const token = authenticator.generate(cleanSecret);
        const timeRemaining = authenticator.timeRemaining();
        
        return res.json({ 
            success: true, 
            token,
            timeRemaining 
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: 'Invalid secret key format' });
    }
});

// UID Extraction Endpoint (Facebook Only)
app.post('/api/extract-id', async (req, res) => {
    const { profileUrl } = req.body;

    if (!profileUrl) {
        return res.status(400).json({ success: false, error: 'URL is required' });
    }

    try {
        const urlObj = new URL(profileUrl);
        const idFromUrl = urlObj.searchParams.get('id') || urlObj.searchParams.get('fbid');
        if (idFromUrl) {
            return res.json({ success: true, id: idFromUrl });
        }
    } catch (e) {
        // Ignored, proceed to scraping
    }

    try {
        const response = await axios.get(profileUrl, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400;
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const html = response.data || '';
        let idMatch = null;

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.location;
            if (location) {
                try {
                    const urlObj = new URL(location, 'https://www.facebook.com');
                    const idFromUrl = urlObj.searchParams.get('id');
                    if (idFromUrl) return res.json({ success: true, id: idFromUrl });
                } catch (e) {}
            }
        }
        
        idMatch = html.match(/"userID":"(\d+)"/) || 
                  html.match(/"entity_id":"(\d+)"/) ||
                  html.match(/fb:\/\/profile\/(\d+)/) ||
                  html.match(/content="fb:\/\/page\/\?id=(\d+)"/);

        if (idMatch && idMatch[1]) {
            return res.json({ success: true, id: idMatch[1] });
        } else {
            return res.json({ 
                success: false, 
                error: `ID not found. The profile might be strictly private.` 
            });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch the URL. Make sure it is a valid link.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});