const URL = process.argv[2];
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
const
    {
        spawn
    } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    const page = await browser.newPage();
    await page.goto(URL);
    let show_name = URL.split("/")[4];
    let episode_name = URL.split("/")[6];
    const text = await page.evaluate(id => window.__APP_INITIAL_STATE__);
    const streamUrlDash = text["/api/video-playback/" + show_name + "/" + episode_name].playback.streamUrlHls;
    const episodeNumber = text["/api/video-playback/" + show_name + "/" + episode_name].video.episodeNumber.toString().padStart(2, '0');
    const seasonNumber = text["/api/video-playback/" + show_name + "/" + episode_name].video.seasonNumber.toString().padStart(2, '0');
    const title = text["/api/video-playback/" + show_name + "/" + episode_name].video.name;
    const fileName = "S" + seasonNumber + ".F" + episodeNumber + "." + title + ".mp4";
    await browser.close();
    startCapture(fileName, streamUrlDash);
})();

function startCapture(filename, url) {
    let captureProcess = spawn(ffmpeg.path, [
        '-i',
        url,
        '-c',
        'copy',
        filename,
    ],
        {
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
    process.on('SIGINT', function () {
        process.kill(captureProcess.pid);
        sleep(1000).then(() => {
            process.exit(0);
        });
    });
}