// window.addEventListener('load', () => {
console.log('イストリ！')

// 設定読み込み
let isIsutoriOn = false
let minSec = 10000
let maxSec = 50000

let timer = null;
let videoObserver;
let docObserver;

let target;
let videoDom;
let ytdApp = document.querySelector('ytd-app')
const adClass = 'ad-showing'
let isStarted = false

chrome.runtime.onMessage.addListener((request, sender) => {
    // 設定更新
    clearIsutori()
    loadSetting()
});

// ページ遷移の監視
let href = location.href
if (location.href.indexOf('watch?') > -1) {
    loadSetting()
}
docObserver = new MutationObserver(function (mutations) {

    if (href !== location.href) {
        clearIsutori()
        if (location.href.indexOf('watch?') > -1) {
            ytdApp.addEventListener('yt-page-data-updated',
                loadSetting, {
                    once: true
                })
        }
        href = location.href
    }
});

docObserver.observe(document, {
    childList: true,
    subtree: true
});

function startIsutori() {
    isStarted = true
    console.log('isutori start!!')
    const videoDuration = videoDom.duration * 1000
    let computedMaxSec = maxSec
    if (videoDuration < maxSec) {
        computedMaxSec = videoDuration
    }

    const stopSec = Math.floor(Math.random() * (computedMaxSec - minSec) + minSec)
    timer = setTimeout(() => {
        videoDom.pause()
        timer = null
        console.log('isutori stop!')
    }, stopSec)
}

function clearIsutori() {
    if (videoDom) {
        videoDom.removeEventListener('loadedmetadata', startIsutori)
    }
    clearTimeout(timer)
    timer = null
    isStarted = false
    if (videoObserver) {
        videoObserver.disconnect()
    }
    console.log('isutori clear!!')
}



function init() {
    if (isIsutoriOn) {
        target = document.querySelector('#movie_player')
        videoDom = document.querySelector('.html5-main-video')

        if (target.classList.contains(adClass)) {
            // 広告があるとき
            // オブザーバーの作成
            videoObserver = new MutationObserver(records => {
                // 変化が発生したときの処理を記述
                records.forEach((record) => {
                    if (!record.target.classList.contains(adClass) && !isStarted) {
                        videoDom.addEventListener('loadedmetadata', startIsutori)
                    }
                })
            })
            // 監視の開始
            videoObserver.observe(target, {
                attributes: true,
                attributeFilter: ['class']
            })
        } else {
            // 広告がなかったとき
            startIsutori()
        }
    }
}

function waitFor(selector, callback, timeout) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        if (timeout) {
            return window.setTimeout(() => {
                return window.requestAnimationFrame(() => {
                    waitFor(selector, callback);
                });
            }, timeout);
        }
        return window.requestAnimationFrame(() => {
            waitFor(selector, callback);
        });
    }
}

function loadSetting() {
    chrome.storage.local.get(null, function (items) {
        isIsutoriOn = items.isIsutoriOn
        maxSec = items.maxSec * 1000
        minSec = items.minSec * 1000
        init();
    });
}