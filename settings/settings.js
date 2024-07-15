// @ts-nocheck

document.querySelector('#exClearId').addEventListener('click', e => {
	browser.runtime.sendMessage({ removeUrl: true });
});
