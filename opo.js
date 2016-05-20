/** Chromeのサポートバージョン */
var CHROME_SUPPORT_VER = 42;
/** Safariのサポートバージョン */
var SAFARI_SUPPORT_VER = 500;


/***************************************************************
　UAからWebPush対応ブラウザか否かの判定
　
　戻り値：true 対応ブラウザ
　　　　　false 非対応ブラウザ
***************************************************************/
function initialize() {
	// WebPush対応ブラウザか否かの返却値
	var ret = false;

	// UAを取得
	var agent = navigator.userAgent; 
	console.log('userAgent=' + agent);

	// UAの判定式
	if (navigator.platform.search('Mac') != -1) { 
		console.log('Mac');
		if ((agent.search('Chrome') != -1) && (agent.search('OPR') == -1)) {
			console.log('chrome');
			ret = checkBrowserVersion('Chrome', CHROME_SUPPORT_VER);
		} else if ((agent.search('Safari') != -1) && (agent.search('Chrome') == -1) && (agent.search('OPR') == -1) && (agent.search('Presto') == -1)) {
			console.log('Safari');
			ret = true;
		}
	} else if (agent.search('Windows') != -1) {
		console.log('Windows');
		if ((agent.search('Chrome') != -1) && (agent.search('OPR') == -1)) {
			console.log('chrome');
			ret = checkBrowserVersion('Chrome', CHROME_SUPPORT_VER);
		}
	} else if (agent.search('Android') != -1) {
		console.log('Android');
		if ((agent.search('Chrome') != -1) && (agent.search('OPR') == -1)) {
			console.log('chrome');
			ret = checkBrowserVersion('Chrome', CHROME_SUPPORT_VER);
		}
	} else {
		console.log('対象外のブラウザです');
	}

	// サポート対象のブラウザであればServiceWorkerの登録を試みる
	// ServiceWorkerの登録結果も込みで初期化処理の成否判定とする
	if (ret == true) {
		ret = registServiceWorker();
	}

	return ret;	
}


/***************************************************************
　WebPushの解除
***************************************************************/
function unsubscribe() {
}


/***************************************************************
　WebPushの有効化
　
　戻り値：SubscriptionID
***************************************************************/
function subscribe() {
}


/***************************************************************
　WebPushが有効であればSubscriptionIDを返却する
　
　戻り値：SubscriptionID
　　　　　※unsubscribe済みの時にはnull
***************************************************************/
function isSubscription() {
}


/***************************************************************
　UAからバージョンのみ抽出してサポートバージョンかを判定する
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
　ServiceWorkerの登録処理
***************************************************************/
function registServiceWorker() {
	var ret = false;

	// ServiceWorkerの登録
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./sw.js').then(function(registration) {
			console.log('ServiceWorkerの登録に成功しました');
			ret = true;
		});
	} else {
		console.log('ServiceWorkerの登録に失敗しました');
	}

	return ret;
}


