var API_KEY = window.GoogleSamples.Config.gcmAPIKey;
var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';


/** Chromeのサポートバージョン */
var CHROME_SUPPORT_VER = 42;
/** Safariのサポートバージョン */
var SAFARI_SUPPORT_VER = 500;


/** 表示しているブラウザがSafariか否か（接続先のPushサーバーの選別に使用） */
var IS_SAFARI = false;


/***************************************************************
　OPOライブラリの初期化要求.
　
　UAからWebPush対応ブラウザか否かの判定する.
　WebPush対応ブラウザの場合にはServiceWorkerの登録処理を行う.
　WebPush非対応ブラウザの場合にはコールバック関数の引数にfalseを設定する.
***************************************************************/
function initialize(result) {
    // WebPush対応ブラウザか否かの返却値
    var isSupport = false;

    // UAを取得
    var agent = navigator.userAgent; 
    console.log('userAgent=' + agent);

    // UAの判定式
    if (navigator.platform.search('Mac') != -1) { 
        console.log('Mac');
        if ((agent.search('Chrome') != -1) && (agent.search('OPR') == -1)) {
            console.log('chrome');
            isSupport = checkBrowserVersion('Chrome', CHROME_SUPPORT_VER);
        } else if ((agent.search('Safari') != -1) && (agent.search('Chrome') == -1) && (agent.search('OPR') == -1) && (agent.search('Presto') == -1)) {
            console.log('Safari');
            isSupport = true;
            IS_SAFARI = true;
        }
    } else if (agent.search('Windows') != -1) {
        console.log('Windows');
        if ((agent.search('Chrome') != -1) && (agent.search('OPR') == -1)) {
            console.log('chrome');
            isSupport = checkBrowserVersion('Chrome', CHROME_SUPPORT_VER);
        }
    } else if (agent.search('Android') != -1) {
        console.log('Android');
        if ((agent.search('Chrome') != -1) && (agent.search('OPR') == -1)) {
            console.log('chrome');
            isSupport = checkBrowserVersion('Chrome', CHROME_SUPPORT_VER);
        }
    } else {
        console.log('対象外のブラウザです');
    }

    // 表示しているブラウザがSafariの時にはSarviceWorkerの登録はしない
    if (IS_SAFARI) {
        result(true);
        return;
    }

    if (isSupport == true) {
        // サポート対象のブラウザであればServiceWorkerの登録を試みる
        // ServiceWorkerの登録結果も込みで初期化処理の成否判定とする
        registServiceWorker(result);
    } else {
        // 非サポートのブラウザであれば引数にfalseを指定してコールバック関数を呼び出す
        result(false);
    }
}


/***************************************************************
　Subscriptionの解除
　
　Chromeの場合にはGCMに対してSubscriptionの解除要求を行う.
　Safariの場合にはAPNSに対してSubscriptionの解除要求を行う.
***************************************************************/
function unregistSubscription() {
    if (IS_SAFARI) {
    } else {
        unregisterGCM();
    }
}


/***************************************************************
　Subscriptionの要求
　
　Chromeの場合にはGCMに対してSubscriptionの登録要求を行う.
　Safariの場合にはAPNSに対してSubscriptionの登録要求を行う.
***************************************************************/
function registSubscription(result) {
    if (IS_SAFARI) {
        registerAPNs(result);
    } else {
        registerGCM(result);
    }
}


/***************************************************************
　Subscriptionの確認.
　
　Chromeの場合にはGCMに対してSubscriptionの確認要求を行う.
　Safariの場合にはAPNSに対してSubscriptionの確認要求を行う.
***************************************************************/
function getSubscription(result) {
    if (IS_SAFARI) {
    } else {
        getSubscriptionGCM(result);
    }
}



/**  Public Function End  **/


/***************************************************************
　
　＜＜　注意　＞＞
　ここより下の関数はライブラリ内部で使用する関数のため、
　サービスサイト側から直接呼び出したときの動作保証はしない.
　
***************************************************************/

/***************************************************************
　UAからバージョンのみ抽出してサポートバージョンかを判定する.
　
　true：WebPushをサポートしているブラウザ.
　false：WebPushをサポートしていないブラウザ.
***************************************************************/
function checkBrowserVersion(searchWord, supportVer) {
    var ret = false;
    var agent = navigator.userAgent; 
    var index = agent.search(searchWord);
    agent = agent.substr(index + 7);

    var browserVer = agent.split('.');
    console.log(browserVer[0]);
    if (browserVer[0] >= supportVer) {
        ret = true;
    }

    return ret;
}


/***************************************************************
　ServiceWorkerの登録処理.
　
　ServiceWorkerの登録に成功した場合にはコールバック関数の引数にtrueを設定する.
　ServiceWorkerの登録に失敗した場合にはコールバック関数の引数にfalseを設定する.
***************************************************************/
function registServiceWorker(result) {
    var ret = false;

    // ServiceWorkerの登録
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log('ServiceWorkerの登録に成功しました');
            result(true);
        }).catch(function(err) {
            console.log('ServiceWorkerの登録に失敗しました');
            result(false);
        });
    } else {
        console.log('ServiceWorkerのAPIが無効です');
        result(false);
    }
}



/***************************************************************
　Subscriptionの要求
　
　GCMに対してSubscriptionの登録を行う.
　登録に成功した場合にはコールバック関数の引数にSubscriptionIDを設定する.
　登録に失敗した場合にはコールバック関数の引数にnullを設定する.
***************************************************************/
function registerGCM(result) {
    navigator.serviceWorker.ready.then(function(registration) {
        registration.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {
            console.log('subscribe 成功');
            result(subscription);
        }).catch(function(e) {
            console.log('subscribe 失敗');
            result(null);
        });
    }).catch(function(e) {
        console.log('ServiceWorkerがReady状態ではない');
    });
}

/***************************************************************
　Subscriptionの解除
　
　GCMに対してSubscriptionの解除を行う.
***************************************************************/
function unregisterGCM() {
    navigator.serviceWorker.ready.then(function(registration) {
        registration.pushManager.getSubscription().then(function(subscription) {
            subscription.unsubscribe().then(function() {
                console.log('unsubscribe 成功');
            }).catch(function(e) {
                console.log('unsubscribe 失敗');
            });

            // ServiceWorker の解除
            registration.unregister().then(onResult);
        }).catch(function(e) {
            console.log('Subscriptionが取得できない');
            // ServiceWorker の解除
            registration.unregister().then(onResult);
        });
    }).catch(function(e) {
        console.log('ServiceWorkerがReady状態ではない');
    });
}

/***************************************************************
　Subscriptionの確認.
　
　GCMに対してSubscriptionの登録確認を行う.
　登録済みの場合にはコールバック関数の引数にSubscriptionIDを設定する.
　未登録の場合にはコールバック関数の引数にnullを設定する.
***************************************************************/
function getSubscriptionGCM(result) {
    navigator.serviceWorker.ready.then(function(registration) {
        registration.pushManager.getSubscription().then(function(subscription) {
            if (subscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') == 0) {
                result(subscription.endpoint);
            } else {
                console.log('Subscriptionの値がおかしい');
                result(null);
            }
        }).catch(function(e) {
            console.log('Subscriptionが取得できない');
            result(null);
        });
    }).catch(function(e) {
        console.log('ServiceWorkerがReady状態ではない');
        result(null);
    });
}


// ServiceWorker の解除要求の結果（ログを出すだけ）
function onResult(result){
    console.log(result);
}




function registerAPNs(result) {
    // Ensure that the user can receive Safari Push Notifications.
    if ('safari' in window && 'pushNotification' in window.safari) {
        var permissionData = window.safari.pushNotification.permission('web.io.github.web-push');
        checkRemotePermission(permissionData);
    }
};
 
var checkRemotePermission = function (permissionData) {
    console.log('checkRemotePermission');
    if (permissionData.permission === 'default') {
        console.log('default');
        // This is a new web service URL and its validity is unknown.
        window.safari.pushNotification.requestPermission(
            'https://web-push.github.io/', // The web service URL.
            'web.io.github.web-push',     // The Website Push ID.
            {}, // Data that you choose to send to your server to help you identify the user.
            checkRemotePermission         // The callback function.
        );
    }
    else if (permissionData.permission === 'denied') {
        // The user said no.
        console.log('denied');
    }
    else if (permissionData.permission === 'granted') {
        // The web service URL is a valid push provider, and the user said yes.
        // permissionData.deviceToken is now available to use.
        console.log('granted');
    } else {
        console.log('else');
    }
};
