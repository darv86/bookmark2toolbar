// @ts-nocheck
'use strict';

const label = document.querySelector('.ex-label');
const input = document.querySelector('.ex-input');

document.querySelector('.ex-btn-reset').addEventListener('click', e => {
	browser.runtime.sendMessage({ resetUrl: true });
	label.textContent = 'Enter url';
	input.value = '';
});

document.querySelector('.ex-form').addEventListener('submit', e => {
	e.preventDefault();
	const url = sanitizeUrl(input.value);
	localStorage.setItem('exUrl', url);
	input.value = '';
	label.textContent = 'Done!';
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
