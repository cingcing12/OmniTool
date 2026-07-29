const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function testTiktok() {
    console.log("Launching puppeteer with stealth...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Disguise as normal browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });

    console.log("Navigating to TikTok...");
    try {
        await page.goto('https://www.tiktok.com/@pheak_967?_r=1&_t=ZS-98Qgam2mpVc', { waitUntil: 'networkidle2', timeout: 30000 });
        
        // TikTok stores all initial state in a script tag with id "__UNIVERSAL_DATA_FOR_REHYDRATION__" or "SIGI_STATE"
        const stateStr = await page.evaluate(() => {
            const universalData = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
            if (universalData) return universalData.textContent;
            const sigiData = document.getElementById('SIGI_STATE');
            if (sigiData) return sigiData.textContent;
            return null;
        });

        if (stateStr) {
            console.log("Found state data. Length:", stateStr.length);
            const state = JSON.parse(stateStr);
            console.log("Extracted successfully.");
            
            // Try to find user info
            const userModule = state.__DEFAULT_SCOPE__ ? state.__DEFAULT_SCOPE__["webapp.user-detail"] : state.UserModule;
            
            if (userModule) {
                console.log("Found UserModule");
                const userInfo = userModule.userInfo ? userModule.userInfo.user : userModule.users ? Object.values(userModule.users)[0] : null;
                const stats = userModule.userInfo ? userModule.userInfo.stats : userModule.stats ? Object.values(userModule.stats)[0] : null;
                
                if (userInfo) {
                    console.log({
                        id: userInfo.id,
                        uniqueId: userInfo.uniqueId,
                        nickname: userInfo.nickname,
                        avatarThumb: userInfo.avatarThumb,
                        signature: userInfo.signature,
                        followerCount: stats ? stats.followerCount : 'N/A',
                        followingCount: stats ? stats.followingCount : 'N/A',
                        heartCount: stats ? stats.heartCount : 'N/A',
                        videoCount: stats ? stats.videoCount : 'N/A',
                    });
                } else {
                    console.log("User info not found in UserModule:", Object.keys(userModule));
                }
            } else {
                console.log("Keys in state:", Object.keys(state));
            }
            
        } else {
            console.log("Could not find state data script tag. Saving HTML to dump.html");
            const html = await page.content();
            require('fs').writeFileSync('dump.html', html);
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await browser.close();
    }
}

testTiktok();
