async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

let shortId;
async function createShortUrl () {
    let nowTab = await getCurrentTab();
    let getShort = await fetch("https://ur0.cc/api.php?create=true&url="+encodeURIComponent(nowTab.url));
    let getJson = await getShort.json();
    let shortLink = document.getElementById("shortLink");
    if (getJson.code === 200) {
        shortLink.value = getJson.shorturl;
        shortId = getJson.short;
        new QRCode("qrcode", {
            text: shortLink.value,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.M
        });
    } else if (getJson.code === 403) {
        shortLink.value = i18n("correctUrl");
    } else {
        shortLink.value = getJson.msg;
    }
}

async function copyValue () {
    let shortLink = document.getElementById("shortLink");
    shortLink.select();
    document.execCommand('copy');
}

function qrDownload () {
    const img = document.querySelector('#qrcode > img');
    const canvas = document.createElement('canvas');
    canvas.width = img.width + 10;
    canvas.height = img.height + 10;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 5, 5);
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ur0_${shortId}.png`;
    a.click();
}

document.querySelector('#qrButton').addEventListener('click', qrDownload)

createShortUrl();

function i18n (key) {
    let n = chrome.i18n.getMessage(key);
    return n ? n : key;
}

document.getElementById("qrButton").innerText = i18n("saveQr");