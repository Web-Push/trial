var isLogin = false;

/** ページ読み込み処理 */
window.addEventListener('load', function() {
    // WebPush対応ブラウザかチェックする
    initialize(initializeResult);
    getSubscription(isRegister);


});

/** 全てのボタンを無効にする */
function unSupported() {
    var all = document.all;
    for (i = 0; i < all.length; i++) {
        var el= all(i);
        if (el.tagName == "INPUT") {
            if (el.type == "button") {
                el.disabled = true;
            }
        }
    }
}


/** ログイン・ログアウトボタンを押された時の処理 */
function onLogin(btn) {
    if (isLogin == false) {
        btn.value ='ログアウト';
        isLogin= true;
    } else {
        btn.value ='au IDにログイン';
        isLogin= false;
    }
}

/** 購読・解約ボタンを押された時の処理 */
function buyTopic(btn, topic) {
    if (btn.value == '購読') {
        btn.value = '解約';
        registSubscription(registerResult);
    } else {
        btn.value = '購読';
        unregistSubscription();
    }
}



function initializeResult(result) {
    // WebPush対応ブラウザであればSWの登録等の処理をする
    // WebPush非対応ブラウザであれば全てのボタンを無効にして操作できないようにする
    if (result == true) {
        document.getElementById('support').innerText = 'このブラウザはWebPushの対応ブラウザです';
    } else {
        document.getElementById('support').innerText = 'このブラウザはWebPushに対応していないためご利用できません';
        unSupported();
    }
}

function registerResult(result) {
    console.log(result);
}

function isRegister(result) {
    console.log(result);
}

