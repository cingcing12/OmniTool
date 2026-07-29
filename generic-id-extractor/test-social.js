const axios = require('axios');
const cheerio = require('cheerio'); // Using cheerio as it's in package.json

async function fetchHtml(url) {
    try {
        const response = await axios.get(url, {
            maxRedirects: 5,
            validateStatus: () => true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        return { html: response.data, status: response.status };
    } catch (e) {
        return { error: e.message };
    }
}

async function test() {
    console.log("--- Instagram ---");
    const ig = await fetchHtml('https://www.instagram.com/zuck/');
    console.log("Status:", ig.status);
    if (ig.html) {
        const match = ig.html.match(/"id":"(\d{5,})"/g) || ig.html.match(/"profile_id":"(\d+)"/g) || ig.html.match(/"user_id":"(\d+)"/g);
        console.log("IG Matches:", match ? match.slice(0, 5) : 'Not found');
    }

    console.log("--- TikTok ---");
    const tt = await fetchHtml('https://www.tiktok.com/@tiktok');
    console.log("Status:", tt.status);
    if (tt.html) {
        const match = tt.html.match(/"authorId":"(\d+)"/g) || tt.html.match(/"id":"(\d{10,})"/g) || tt.html.match(/"userId":"(\d+)"/g);
        console.log("TT Matches:", match ? match.slice(0, 5) : 'Not found');
    }

    console.log("--- X/Twitter ---");
    const tw = await fetchHtml('https://twitter.com/elonmusk');
    console.log("Status:", tw.status);
    if (tw.html) {
        const match = tw.html.match(/"rest_id":"(\d+)"/g) || tw.html.match(/"user_id":"(\d+)"/g) || tw.html.match(/"id":"(\d{5,})"/g);
        console.log("TW Matches:", match ? match.slice(0, 5) : 'Not found');
    }
}
test();
