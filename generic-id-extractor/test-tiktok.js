const axios = require('axios');

async function testTikTok() {
    try {
        console.log("Fetching from countik...");
        const response = await axios.get('https://countik.com/api/userinfo/pheak_967');
        console.log("Status:", response.status);
        console.log(response.data);
    } catch (err) {
        console.error("Error:", err);
    }
}

testTikTok();
