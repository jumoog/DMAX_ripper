const URL = "https://www.dmax.de/programme/steel-buddies/";
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(id => window.__APP_INITIAL_STATE__);
    text["/api/show-detail/steel-buddies"].videos.episode[3].forEach(function (name) {
        console.log(name.path);
    });
    await browser.close();
})();