// @ts-nocheck
'use strict';

browser.runtime.onInstalled.addListener(details => {
	localStorage.removeItem('exUrl');
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
});

browser.runtime.onMessage.addListener(msg => {
	if (msg.addUrl) addUrl(msg.addUrl);
	if (msg.resetUrl) resetUrl();
});

browser.browserAction.onClicked.addListener(tabInfo => {
	if (localStorage.getItem('exUrl')) browser.tabs.create({ url: localStorage.getItem('exUrl') });
	else openPopup();
});

browser.menus.onClicked.addListener((clickInfo, tabInfo) => {
	const menuItem = {
		exAddUrl() {
			resetUrl();
			addUrl(tabInfo.url);
		},
		exChangeUrl() {
			resetUrl();
			openPopup();
		},
		exResetUrl() {
			resetUrl();
		},
	};
	const action = clickInfo.menuItemId;
	menuItem[action]();
});

function addUrl(url) {
	const urlObj = sanitizeUrl(url);
	localStorage.setItem('exUrl', urlObj);
	browser.browserAction.setIcon({
		path: {
			16: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=16`,
			32: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
		},
	});
}

function resetUrl() {
	localStorage.removeItem('exUrl');
	browser.browserAction.setIcon({ path: { 16: '/icons/ico16.png', 32: '/icons/ico32.png' } });
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
