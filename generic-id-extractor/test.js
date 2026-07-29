const axios = require('axios');

async function test(url) {
    try {
        const response = await axios.get(url, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Accept 3xx statuses
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });

        console.log(`Status: ${response.status} for ${url}`);
        
        // Handle Redirects (301, 302, etc.)
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.location;
            console.log(`Redirect Location: ${location}`);
            
            if (location) {
                // Try to extract ID from URL parameters
                const urlObj = new URL(location, 'https://www.facebook.com');
                const idFromUrl = urlObj.searchParams.get('id');
                if (idFromUrl) {
                    return console.log(`Success! ID from redirect: ${idFromUrl}`);
                }

                // If no ID in params, fetch the redirected URL
                console.log(`No ID in redirect params. Fetching ${location} ...`);
                return await fetchWithHtml(location);
            }
        } else if (response.status === 200) {
            console.log(`Received HTML. Length: ${response.data.length}`);
            extractFromHtml(response.data);
        }
    } catch (error) {
        console.log(`Error on ${url}: ${error.message} - ${error.response ? error.response.status : ''}`);
    }
}

async function fetchWithHtml(url) {
    try {
        const response = await axios.get(url, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400;
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        if (response.status === 200) {
             extractFromHtml(response.data);
        } else {
             console.log(`Redirect loop or other status: ${response.status}`);
        }
    } catch (error) {
         console.log(`Error on fetchWithHtml: ${error.message}`);
    }
}

function extractFromHtml(html) {
    const idMatch = html.match(/"userID":"(\d+)"/) || 
                    html.match(/"entity_id":"(\d+)"/) ||
                    html.match(/fb:\/\/profile\/(\d+)/) ||
                    html.match(/content="fb:\/\/page\/\?id=(\d+)"/);

    if (idMatch && idMatch[1]) {
        console.log(`Success! ID from HTML: ${idMatch[1]}`);
    } else {
        console.log(`ID not found in HTML.`);
    }
}

test('https://www.facebook.com/share/1Esv3XGFNc/');
test('https://www.facebook.com/zuck');
