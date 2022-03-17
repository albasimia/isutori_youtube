// window.addEventListener('load', () => {
console.log('イストリ！')

// 設定読み込み
const minSec = 10000
const maxSec = 50000

let timer = null;
let videoObserver;
let docObserver;

let target;
let videoDom;
let ytdApp = document.querySelector('ytd-app')
const adClass = 'ad-showing'
let isStarted = false

const startIsutori = () => {
    isStarted = true
    console.log('isutori start!!')
    const videoDuration = videoDom.duration * 1000
    console.log({
        videoDuration
    })
    let computedMaxSec = maxSec
    if (videoDuration < maxSec) {
        computedMaxSec = videoDuration
    }
    console.log({
        computedMaxSec
    })

    const stopSec = Math.floor(Math.random() * (computedMaxSec - minSec) + minSec)
    console.log({
        stopSec
    })
    timer = setTimeout(() => {
        videoDom.pause()
        timer = null
        console.log('isutori stop!')
    }, stopSec)
}

// ページ遷移の監視
let href = location.href
if (location.href.indexOf('watch?') > 0) {
    init()
}
docObserver = new MutationObserver(function (mutations) {

    if (href !== location.href) {
        if (videoDom) {
            videoDom.removeEventListener('loadedmetadata', startIsutori)
        }
        clearTimeout(timer)
        timer = null
        isStarted = false
        videoObserver.disconnect()
        console.log('isutori clear!!')
        if (location.href.indexOf('watch?') > 0) {
            ytdApp.addEventListener('yt-page-data-updated',
                init, {
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

function init() {
    target = document.querySelector('#movie_player')
    videoDom = document.querySelector('.html5-main-video')

    if (target.classList.contains(adClass)) {
        // 広告があるとき
        // console.log('広告あり')
        // オブザーバーの作成
        videoObserver = new MutationObserver(records => {
            // 変化が発生したときの処理を記述
            records.forEach((record) => {
                if (!record.target.classList.contains(adClass) && !isStarted) {
                    // console.log('広告終わり')
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
        // console.log('広告なし')
        startIsutori()
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
// })