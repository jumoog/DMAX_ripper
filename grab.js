if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " DMAX programme URL");
    console.log("for example: " + __filename + "https://www.dmax.de/programme/steel-buddies/");
    process.exit(-1);
}

const URL = process.argv[2];
const show = URL.split('/').pop() || URL.split('/').pop();
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(id => window.__APP_INITIAL_STATE__);
    let api_show_key = "/api/show-detail/"+show;
    let episodes = text[api_show_key].videos.episode;
    fs.writeFile('dump.sh', "#!/bin/bash\n", { flag: 'a+' }, (err) => {});
    for (var key in episodes)
    {
        fs.writeFile('dump.sh', `echo "Season <${key}>"\n`, { flag: 'a+' }, (err) => {});
        text[api_show_key].videos.episode[key].forEach(function (name) {
            fs.writeFile('dump.sh', `node loader.js "https://www.dmax.de/programme/${show}/video/${name.path.split("/")[1]}/"\n`, { flag: 'a+' }, (err) => {});
            console.log(`https://www.dmax.de/programme/${show}/video/${name.path.split("/")[1]}/`);
        });
    }
    await browser.close();
})();