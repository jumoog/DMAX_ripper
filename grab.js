const URL = "https://www.dmax.de/programme/steel-buddies/";
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(id => window.__APP_INITIAL_STATE__);
    let episodes = text["/api/show-detail/steel-buddies"].videos.episode;
    fs.writeFile('dump.sh', "#!/bin/bash\n", { flag: 'a+' }, (err) => {});
    for (var key in episodes)
    {
        fs.writeFile('dump.sh', `echo "Season <${key}>"\n`, { flag: 'a+' }, (err) => {});
        text["/api/show-detail/steel-buddies"].videos.episode[key].forEach(function (name) {
            fs.writeFile('dump.sh', `node loader.js "https://www.dmax.de/programme/steel-buddies/video/${name.path.split("/")[1]}/"\n`, { flag: 'a+' }, (err) => {});
            console.log(`https://www.dmax.de/programme/steel-buddies/video/${name.path.split("/")[1]}/`);
        });
    }
    await browser.close();
})();