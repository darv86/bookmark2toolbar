// @ts-nocheck
function openPage() {
	// browser.tabs.create({
	// 	url: 'https://youtube.com',
	// });
	// browser.runtime.openOptionsPage();
	// https://www.google.com/s2/favicons?domain=dev.to&sz=512
	// new Promise((res, rej)=> {
	// })
	browser.browserAction.setIcon({
		path: 'https://www.google.com/s2/favicons?domain=webdesignok.com&sz=32',
	});
}

browser.browserAction.onClicked.addListener(openPage);
