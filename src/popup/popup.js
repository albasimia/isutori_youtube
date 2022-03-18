const defaults = {
    isIsutoriOn: false,
    minSec: 10,
    maxSec: 60,
}

function save_options() {
    const isIsutoriOn = document.getElementById('isutori_on').checked;
    const minSec = document.getElementById('min_seconds').value;
    const maxSec = document.getElementById('max_seconds').value;
    chrome.storage.local.set({
        isIsutoriOn: isIsutoriOn,
        minSec: minSec,
        maxSec: maxSec,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = '保存されました';
        setTimeout(function(){
            status.textContent = '';
        },3000)
    });
}

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get(defaults, function (items) {
        document.getElementById('isutori_on').checked = items.isIsutoriOn;
        document.getElementById('min_seconds').value = items.minSec;
        document.getElementById('max_seconds').value = items.maxSec;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);