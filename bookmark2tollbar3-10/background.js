// @ts-nocheck
'use strict';

const extensionId = browser.runtime.id;

browser.menus.create({
	id: 'exAddUrl',
	title: 'Add current page',
	contexts: ['browser_action'],
	icons: {
		16: 'icons/add16.png',
		32: 'icons/add32.png',
	},
});
browser.menus.create({
	id: 'exRemoveUrl',
	title: 'Remove current page',
	contexts: ['browser_action'],
	icons: {
		16: 'icons/remove16.png',
		32: 'icons/remove32.png',
	},
});
browser.menus.create({
	id: 'exChangeUrl',
	title: 'Change url',
	contexts: ['browser_action'],
	icons: {
		16: 'icons/change16.png',
		32: 'icons/change32.png',
	},
});
browser.menus.create({
	id: 'exResetUrl',
	title: 'Reset url',
	contexts: ['browser_action'],
	icons: {
		16: 'icons/reset16.png',
		32: 'icons/reset32.png',
	},
});

if (localStorage.getItem(extensionId)) setCurrentIcon();

browser.runtime.onInstalled.addListener(resetUrl);
browser.runtime.onInstalled.removeListener(resetUrl);

browser.runtime.onMessage.addListener(msg => {
	if (msg.addUrl) addUrl(msg.addUrl);
	if (msg.resetUrl) resetUrl();
});

browser.browserAction.onClicked.addListener(tabInfo => {
	const urls = localStorage.getItem(extensionId);
	if (urls) for (const url of urls.split(';')) browser.tabs.create({ url });
	else openPopup();
});

browser.menus.onClicked.addListener((clickInfo, tabInfo) => {
	const menuItem = {
		exAddUrl() {
			addUrl(tabInfo.url);
		},
		exRemoveUrl() {
			removeUrl(tabInfo.url);
		},
		exChangeUrl() {
			openPopup();
		},
		exResetUrl() {
			resetUrl();
		},
	};
	const action = clickInfo.menuItemId;
	menuItem[action]();
});

function setCurrentIcon() {
	const urls = localStorage.getItem(extensionId);
	let path = null;
	if (!urls) {
		path = { 16: '/icons/ico16.png', 32: '/icons/ico32.png' };
	} else if (urls.includes(';')) {
		path = { 16: '/icons/group16.png', 32: '/icons/group32.png' };
	} else {
		const icon = `https://www.google.com/s2/favicons?domain=https://${new URL(urls).hostname}&sz=`;
		path = { 16: icon + 16, 32: icon + 32 };
	}
	browser.browserAction.setIcon({ path });
}

function addUrl(url) {
	const sanitizedUrl = sanitizeUrl(url).toString();
	const oldUrls = localStorage.getItem(extensionId) || sanitizedUrl;
	const newUrls = oldUrls.includes(sanitizedUrl)
		? oldUrls
				.split(';')
				.filter(url => url !== sanitizedUrl)
				.concat(sanitizedUrl)
				.join(';')
		: oldUrls.concat(';', sanitizedUrl);
	localStorage.setItem(extensionId, newUrls);
	setCurrentIcon();
}

function removeUrl(url) {
	const sanitizedUrl = sanitizeUrl(url).toString();
	const oldUrls = localStorage.getItem(extensionId);
	if (!oldUrls) return;
	const oldUrlsArr = oldUrls.split(';');
	if (!oldUrlsArr.includes(sanitizedUrl)) return;
	const newUrls = oldUrlsArr.filter(url => url !== sanitizedUrl).join(';');
	if (!newUrls) {
		resetUrl();
		return;
	}
	localStorage.setItem(extensionId, newUrls);
	setCurrentIcon();
}

function resetUrl() {
	localStorage.removeItem(extensionId);
	setCurrentIcon();
}

function openPopup() {
	browser.browserAction.setPopup({ popup: '/popup/popup.html' });
	browser.browserAction.openPopup();
	browser.browserAction.setPopup({ popup: '' });
}

function logger(data) {
	browser.tabs
		.query({
			currentWindow: true,
			active: true,
		})
		.then(openedTabs => {
			browser.tabs.sendMessage(openedTabs[0].id, {
				log: data,
			});
		});
}

function sanitizeUrl(str) {
	if (str.includes('www.')) str = str.replace('www.', '');
	if (str.startsWith('http')) return new URL(str);
	return new URL('https://' + str);
}
