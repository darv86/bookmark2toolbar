// @ts-nocheck
'use strict';

document.querySelector('#exResetId').addEventListener('click', e => {
	browser.runtime.sendMessage({ resetUrl: true });
	document.querySelector('#exLabelId').textContent = 'Enter url';
});

document.querySelector('#exFormId').addEventListener('submit', e => {
	e.preventDefault();
	const input = document.querySelector('#exInputId');
	const url = sanitizeUrl(input.value);
	localStorage.setItem('exUrl', url);
	input.value = '';
	document.querySelector('#exLabelId').textContent = 'Done!';
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
