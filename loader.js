const URL = process.argv[2];
const {
    spawn
} = require('child_process');
const ffmpeg = require('ffmpeg-static');

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(URL);
    const text = await page.evaluate(id => window.__APP_INITIAL_STATE__);
    const streamUrlDash = text["/api/video-playback/" + URL.split("/")[4] + "/" + URL.split("/")[6]].playback.streamUrlHls;
    const episodeNumber = text["/api/video-playback/" + URL.split("/")[4] + "/" + URL.split("/")[6]].video.episodeNumber;
    const seasonNumber = text["/api/video-playback/" + URL.split("/")[4] + "/" + URL.split("/")[6]].video.seasonNumber;
    const title = text["/api/video-playback/" + URL.split("/")[4] + "/" + URL.split("/")[6]].video.name;
    const fileName = "S" + seasonNumber + ".F" + episodeNumber + "." + title + ".mp4";
    startCapture(fileName, streamUrlDash);
})();


function startCapture(filename, url) {
    let captureProcess = spawn(ffmpeg.path, [
        '-i',
        url,
        '-c',
        'copy',
        filename,
    ], {
        detached: true,
        stdio: ['ignore' /* stdin */, 'ignore' /* stdout */, 'ignore' /* stderr */]
    });

    if (captureProcess.pid) {
        console.log(filename, 'Start recording...');
    }

    captureProcess.on('close', () => {
        console.log("closed")
    });

    captureProcess.on('error', (err) => {
        console.log(user, 'Error occurred while capturing file ' + filename + '.ts (' + err + ')');
    });
}
