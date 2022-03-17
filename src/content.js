window.addEventListener('load', () => {
    console.log('イストリ！')

    // 設定読み込み
    const minSec = 10000
    const maxSec = 50000

    const target = document.querySelector('#movie_player')
    const videoDom = document.querySelector('.html5-main-video')



    const adClass = 'ad-showing'
    let isStarted = false

    if (target.classList.contains(adClass)) {
        // 広告があるとき
        // オブザーバーの作成
        const observer = new MutationObserver(records => {
            // 変化が発生したときの処理を記述
            records.forEach((record) => {
                if (!record.target.classList.contains(adClass) && !isStarted) {
                    startIsutori()
                }
            })
        })
        // 監視の開始
        observer.observe(target, {
            attributes: true,
            attributeFilter: ['class']
        })
    } else {
        // 広告がなかったとき
        startIsutori()
    }

    function startIsutori(params) {
        isStarted = true
        console.log('isutori start!!')
        videoDom.addEventListener('loadedmetadata', function () {
            const videoDuration = videoDom.duration * 1000
            console.log({videoDuration})
            let computedMaxSec = maxSec
            if (videoDuration < maxSec) {
                computedMaxSec = videoDuration
            }
            console.log({computedMaxSec})

            const stopSec = Math.floor(Math.random() * (computedMaxSec - minSec) + minSec)
            console.log({stopSec})
            setTimeout(() => {
                videoDom.pause()
                console.log('isutori stop!')
            }, stopSec)
        })

    }
})