// @ts-nocheck

browser.browserAction.onClicked.addListener(e => {
	if (localStorage.getItem('url')) {
		browser.tabs.create({
			url: localStorage.getItem('url'),
		});
	} else {
		browser.browserAction.setPopup({ popup: '/popup/popup.html' });
		browser.browserAction.openPopup();
		browser.browserAction.setPopup({ popup: '' });
	}
});

browser.runtime.onMessage.addListener(msg => {
	if (msg.removeUrl) {
		localStorage.removeItem('url');
		browser.browserAction.setIcon({
			path: { 16: '/icons/ico16.png', 32: '/icons/ico32.png' },
		});
	}
});
