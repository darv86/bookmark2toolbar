// @ts-nocheck

// browser.runtime.openOptionsPage();

function sanitizeUrl(str) {
	if (str.includes('www.')) str = str.replace('www.', '');
	if (str.startsWith('http')) return new URL(str);
	else return new URL('https://' + str);
}

document.querySelector('#exFormId').addEventListener('submit', e => {
	e.preventDefault();
	const input = document.querySelector('#exInputId');
	const url = sanitizeUrl(input.value);
	localStorage.setItem('url', url);
	input.value = '';
	document.querySelector('#exLabelId').textContent = 'Done!';
	browser.browserAction.setIcon({
		path: {
			16: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=16`,
			32: `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`,
		},
	});
});

document.querySelector('#exResetId').addEventListener('click', e => {
	browser.runtime.sendMessage({ removeUrl: true });
	document.querySelector('#exLabelId').textContent = 'Enter url';
});
