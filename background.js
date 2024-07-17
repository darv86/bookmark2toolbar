// @ts-nocheck
'use strict';

browser.runtime.onInstalled.addListener(details => {
	localStorage.removeItem('exUrl');
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

browser.runtime.onMessage.addListener(msg => msg.resetUrl && resetUrl());

browser.browserAction.onClicked.addListener(e => {
	if (localStorage.getItem('exUrl')) browser.tabs.create({ url: localStorage.getItem('exUrl') });
	else openPopup();
	logger({ data: e });
});

browser.menus.onClicked.addListener(info => {
	const menuItem = {
		exChangeUrl() {
			resetUrl();
			openPopup();
		},
		exResetUrl() {
			resetUrl();
		},
	};
	const action = info.menuItemId;
	menuItem[action]();
});

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
