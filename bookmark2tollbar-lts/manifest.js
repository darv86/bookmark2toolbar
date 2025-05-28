const manifest = {
	manifest_version: 3,
	version: '1.0.0',
	name: 'Bookmark2Toolbar - 1/3',
	description: 'Add a bookmark to the toolbar',

	background: {
		scripts: ['background.js'],
	},

	'//comment_action': 'browser_action for manifest v2',
	action: {
		default_icon: {
			16: 'icons/ico16.png',
			32: 'icons/ico32.png',
			48: 'icons/ico48.png',
			128: 'icons/ico128.png',
		},
	},

	'//comment_browser_specific_settings':
		'browser_specific_settings.gecko specific for firefox and safari',
	browser_specific_settings: {
		gecko: {
			id: '86darv@gmail.com.book2tool.1',
		},
	},

	'//comment_permissions': '"menus" only for manifest v2',
	permissions: ['menus', 'activeTab'],
};
