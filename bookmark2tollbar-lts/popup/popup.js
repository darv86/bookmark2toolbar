// @ts-nocheck
'use strict';

const label = document.querySelector('.ex-label');
const input = document.querySelector('.ex-input');

document.querySelector('.ex-form').addEventListener('submit', e => {
	e.preventDefault();
	const url = input.value;
	browser.runtime.sendMessage({ addUrl: url });
	input.value = '';
	label.textContent = 'Done!';
});

document.querySelector('.ex-btn-reset').addEventListener('click', e => {
	browser.runtime.sendMessage({ resetUrl: true });
	label.textContent = 'Enter url';
	input.value = '';
});
