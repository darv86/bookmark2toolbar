// @ts-nocheck
'use strict';

if (typeof browser === 'undefined') {
	var browser = chrome;
}

const extensionId = browser.runtime.id;
const storage = browser.storage.local;

storage.get(extensionId).then(async () => await setCurrentIcon());

browser.runtime.onInstalled.addListener(() => {
	browser.contextMenus.create({
		id: 'exAddUrl',
		title: '➕ Add current page',
		contexts: ['action'],
	});
	browser.contextMenus.create({
		id: 'exRemoveUrl',
		title: '➖ Remove current page',
		contexts: ['action'],
	});
	browser.contextMenus.create({
		id: 'exChangeUrl',
		title: '🛠️ Change url',
		contexts: ['action'],
	});
	browser.contextMenus.create({
		id: 'exResetUrl',
		title: '🗑️ Reset url',
		contexts: ['action'],
	});
});

// to weak up the worker after a browser reload
browser.tabs.onUpdated.addListener(() => {});

browser.runtime.onMessage.addListener((msg) => {
	if (msg.addUrl) addUrl(msg.addUrl);
	if (msg.resetUrl) resetUrl();
});

browser.action.onClicked.addListener(async (tabInfo) => {
	const urls = (await storage.get(extensionId))[extensionId];
	if (urls) for (const url of urls.split(';')) browser.tabs.create({ url });
	else openPopup();
});

browser.contextMenus.onClicked.addListener((clickInfo, tabInfo) => {
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

async function addUrl(url) {
	const sanitizedUrl = sanitizeUrl(url).toString();
	const oldUrls =
		(await storage.get(extensionId))[extensionId] || sanitizedUrl;
	const newUrls = oldUrls.includes(sanitizedUrl)
		? oldUrls
				.split(';')
				.filter((url) => url !== sanitizedUrl)
				.concat(sanitizedUrl)
				.join(';')
		: oldUrls.concat(';', sanitizedUrl);
	await storage.set({ [extensionId]: newUrls });
	await setCurrentIcon();
}

async function removeUrl(url) {
	const sanitizedUrl = sanitizeUrl(url).toString();
	const oldUrls = (await storage.get(extensionId))[extensionId];
	if (!oldUrls) return;
	const oldUrlsArr = oldUrls.split(';');
	if (!oldUrlsArr.includes(sanitizedUrl)) return;
	const newUrls = oldUrlsArr.filter((url) => url !== sanitizedUrl).join(';');
	if (!newUrls) {
		await resetUrl();
		return;
	}
	await storage.set({ [extensionId]: newUrls });
	await setCurrentIcon();
}

async function resetUrl() {
	await storage.clear();
	// await storage.remove(extensionId);
	await setCurrentIcon();
}

function openPopup() {
	browser.action.setPopup({ popup: '/popup/popup.html' });
	browser.action.openPopup();
	browser.action.setPopup({ popup: '' });
}

async function setCurrentIcon() {
	const urls = (await storage.get(extensionId))[extensionId];
	if (!urls) {
		const path = { 16: '/icons/ico16.png', 32: '/icons/ico32.png' };
		browser.action.setIcon({ path });
		return;
	}
	if (urls.includes(';')) {
		const path = { 16: '/icons/group16.png', 32: '/icons/group32.png' };
		browser.action.setIcon({ path });
		return;
	}
	const domain = new URL(urls).hostname;
	try {
		const [img16, img32] = await Promise.all([
			fetchFavicon(domain),
			fetchFavicon(domain, 32),
		]);
		const imageData = { 16: img16, 32: img32 };
		browser.action.setIcon({ imageData });
	} catch (error) {
		const path = { 16: '/icons/ico16.png', 32: '/icons/ico32.png' };
		browser.action.setIcon({ path });
	}
}

async function fetchFavicon(domain, size = 16) {
	const service = `https://www.google.com/s2/favicons?domain=https://${domain}&sz=${size}`;
	const resp = await fetch(service);
	const blob = await resp.blob();
	const bitmap = await createImageBitmap(blob);
	const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(bitmap, 0, 0);
	const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
	return imageData;
}

function sanitizeUrl(str) {
	if (str.includes('www.')) str = str.replace('www.', '');
	if (str.startsWith('http')) return new URL(str);
	return new URL('https://' + str);
}
