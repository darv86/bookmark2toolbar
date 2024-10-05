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
	const group = localStorage.getItem(extensionId).includes(';');
	const faviconUrl = group
		? 'icons/group'
		: `https://www.google.com/s2/favicons?domain=https://${
				new URL(localStorage.getItem(extensionId)).hostname
		  }&sz=`;
	browser.browserAction.setIcon({
		path: {
			16: faviconUrl + 16 + (group ? '.png' : ''),
			32: faviconUrl + 32 + (group ? '.png' : ''),
		},
	});
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

function resetUrl() {
	localStorage.removeItem(extensionId);
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
