/** Chromeのサポートバージョン */
var CHROME_SUPPORT_VER = 42;
/** Safariのサポートバージョン */
var SAFARI_SUPPORT_VER = 500;


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
***************************************************************/
function unregistSubscription() {
}


/***************************************************************
　Subscriptionの要求
　
　Pushサーバーに対してSubscriptionの登録を行う.
　登録に成功した場合にはコールバック関数の引数にSubscriptionIDを設定する.
　登録に失敗した場合にはコールバック関数の引数にnullを設定する.
***************************************************************/
function registSubscription(result) {
}


/***************************************************************
　Subscriptionの確認.
　
　登録済みの場合にはコールバック関数の引数にSubscriptionIDを設定する.
　未登録の場合にはコールバック関数の引数にnullを設定する.
***************************************************************/
function getSubscription(result) {
}


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


