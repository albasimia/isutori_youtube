let timer = null;
const defaults = {
    isIsutoriOn: false,
    minSec: 10,
    maxSec: 60,
    isAutoRestart: false,
    restertInterval: 30,
}

function save_options() {
    const isIsutoriOn = document.getElementById('isutori_on').checked;
    const minSec = document.getElementById('min_seconds').value;
    const maxSec = document.getElementById('max_seconds').value;
    const isAutoRestart = document.getElementById('auto_restert').checked;
    const restertInterval = document.getElementById('restert_interval').value;
    if (Number(minSec) >= Number(maxSec)) {
        var status = document.getElementById('status');
        status.textContent = '最小秒数は最大秒数より小さくしてください。';
        clearTimeout(timer);
        timer = setTimeout(function () {
            status.textContent = '';
        }, 3000)
        return false
    }
    const newOption = {
        isIsutoriOn: isIsutoriOn,
        minSec: minSec,
        maxSec: maxSec,
        isAutoRestart: isAutoRestart,
        restertInterval: restertInterval,
    };
    chrome.storage.local.set(newOption, function () {
        // Update status to let user know options were saved.
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, newOption);
        });
        var status = document.getElementById('status');
        status.textContent = '保存されました';
        clearTimeout(timer);
        setTimeout(function () {
            status.textContent = '';
        }, 3000)
    });
}

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get(defaults, function (items) {
        document.getElementById('isutori_on').checked = items.isIsutoriOn;
        document.getElementById('min_seconds').value = items.minSec;
        document.getElementById('max_seconds').value = items.maxSec;
        document.getElementById('auto_restert').checked = items.isAutoRestart;
        document.getElementById('restert_interval').value = items.restertInterval;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);