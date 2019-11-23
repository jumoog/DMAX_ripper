if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " DMAX programme URL");
    console.log("for example: " + __filename + "https://www.dmax.de/programme/steel-buddies/");
    process.exit(-1);
}

const URL = process.argv[2];
const show = URL.split('/').pop() || URL.split('/').pop();
const puppeteer = require('puppeteer');
const fs = require('fs');
let episodes;
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
    try {
        episodes = text[api_show_key].videos.episode;
    } catch (e) {
        console.log(`${URL} is not valid`);
        await browser.close();
        process.exit(-1);
    }

    fs.writeFile('dump.sh', "#!/bin/bash\n", { flag: 'a+' }, (err) => {});
    for (var key in episodes)
    {
        console.log(`Season <${key}>`);
        fs.writeFile('dump.sh', `echo "Season <${key}>"\n`, { flag: 'a+' }, (err) => {});
        text[api_show_key].videos.episode[key].forEach(function (name) {
            fs.writeFile('dump.sh', `node loader.js "https://www.dmax.de/programme/${show}/video/${name.path.split("/")[1]}/"\n`, { flag: 'a+' }, (err) => {});
            console.log(`S${name.season}.E${name.episode} ${name.name}`);
        });
    }
    await browser.close();
})();