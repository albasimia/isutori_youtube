// window.addEventListener('load', () => {
console.log('イストリ！')

// 設定読み込み
let isIsutoriOn = false
let minSec = 10000
let maxSec = 60000
let isAutoRestart = false
let restertInterval = 30000

let timer = null
let restertTimer = null
let videoObserver
let docObserver

let target
let videoDom
let ytdApp = document.querySelector('ytd-app')
const adClass = 'ad-showing'

let isSetListner = false
let isStarted = false

chrome.runtime.onMessage.addListener((request, sender) => {
    // 設定更新
    removeListeners()
    if (request.isIsutoriOn) {
        addListeners()
    }
    if (request.isAutoRestart) {
        clearRestert()
    }
    loadSetting()
    clearIsutori()
});

// ページ遷移の監視
let href = location.href
if (location.href.indexOf('watch?') > -1) {
    loadSetting()
}
docObserver = new MutationObserver(function (mutations) {

    if (href !== location.href) {
        clearRestert()
        clearIsutori()
        removeListeners()
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
    console.log('isutori start!!')
    if (!isSetListner) {
        addListeners()
    }
    isStarted = true
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
        setRestert()
    }, stopSec)
}

function clearIsutori() {
    if (isStarted) {
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
}



function init() {
    if (isIsutoriOn) {
        target = document.querySelector('#movie_player')
        videoDom = document.querySelector('.html5-main-video')

        if (target.classList.contains(adClass)) {
            // 広告があるとき
            console.log('広告あり')
            // オブザーバーの作成
            videoObserver = new MutationObserver(records => {
                // 変化が発生したときの処理を記述
                records.forEach((record) => {
                    if (!record.target.classList.contains(adClass) && !isStarted) {
                        videoDom.addEventListener('loadedmetadata', startIsutori)
                    }
                    if (record.target.classList.contains(adClass) && isStarted) {
                        clearRestert()
                        clearIsutori()
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
            console.log('広告なし')
            if (!videoDom.paused) {
                startIsutori()
            } else if (!isSetListner) {
                addListeners()
            }
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
        isAutoRestart = items.isAutoRestart
        restertInterval = items.restertInterval * 1000
        init();
    });
}

function addListeners() {
    videoDom.addEventListener('play', startIsutori)
    videoDom.addEventListener('pause', clearIsutori)
    videoDom.addEventListener('ended', clearRestert)
    isSetListner = true
    console.log('add listeners')
}

function removeListeners() {
    videoDom.removeEventListener('play', startIsutori)
    videoDom.removeEventListener('pause', clearIsutori)
    videoDom.removeEventListener('ended', clearIsutori)
    isSetListner = false
    console.log('remove listeners')
}

// TODO: 動画終了時の処理
function setRestert() {
    if (isAutoRestart) {
        console.log('set restert')
        try {
            restertTimer = setTimeout(() => {
                if (videoDom.paused) {
                    videoDom.play()
                }
            }, restertInterval)
        } catch (error) {
            clearRestert()
        }
    }
}

function clearRestert() {
    if (restertTimer) {
        console.log('clear restert')
        clearTimeout(restertTimer)
        restertTimer = null
    }
}