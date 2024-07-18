// @ts-nocheck
'use strict';

document.querySelector('.ex-btn-reset').addEventListener('click', e => {
	browser.runtime.sendMessage({ resetUrl: true });
	document.querySelector('.ex-label').textContent = 'Enter url';
});

document.querySelector('.ex-form').addEventListener('submit', e => {
	e.preventDefault();
	const input = document.querySelector('.ex-input');
	const url = sanitizeUrl(input.value);
	localStorage.setItem('exUrl', url);
	input.value = '';
	document.querySelector('.ex-label').textContent = 'Done!';
	browser.browserAction.setIcon({
		path: {
			16: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=16`,
			32: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`,
		},
	});
});

function sanitizeUrl(str) {
	if (str.includes('www.')) str = str.replace('www.', '');
	if (str.startsWith('http')) return new URL(str);
	return new URL('https://' + str);
}

// "options_ui": {
// 	"page": "settings/settings.html"
// },
