/** Push通知を受けたときの処理 */
self.addEventListener('push', function(event) {
	console.log('Received a push message', event);
});

/** Notificationをクリックしたときの処理 */
self.addEventListener('notificationclick', function(event) {
	console.log('On notification click: ', event.notification.tag);
});

/** ServiceWorkerのactivateが完了したときの処理 */
self.addEventListener('activate', function(event) {
  console.log('activate Complete');
});

