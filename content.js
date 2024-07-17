// @ts-nocheck
'use strict';

browser.runtime.onMessage.addListener(msg => {
	if (msg.log) {
		console.log(msg.log);
	}
});

console.log('from content');

// "content_scripts": [
// 	{
// 		"matches": ["<all_urls>"],
// 		"js": ["content.js"]
// 	}
// ],
