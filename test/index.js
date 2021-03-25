'use strict';

const assert = require('assert');

const meta = require.main.require('./src/meta');

const plugin = require('../library');

const PLUGIN_HASH = 'link-mentions';

describe('nodebb-plugin-link-mentions', function () {
	const settings = {
		'mention-list': [{
			keyword: 'Great Product',
			link: 'https://example.com/great-product',
		}, {
			keyword: 'Example Item',
			link: 'https://www.example.com/example-item',
		}],
	};

	before(async () => {
		await meta.settings.set(PLUGIN_HASH, { ...settings });
	});

	it('should save settings while filtering invalid values', async function () {
		const values = {
			'mention-list': [...settings['mention-list'], {
				keyword: 'Great Product',
				link: 'https://duplicatekeyword.com',
			}, {
				keyword: '',
				link: 'https://emptykeyword.com',
			}, {
				keyword: 'Empty link',
				link: '',
			}, {
				keyword: 'Invalid URL',
				link: 'notaurl',
			}],
		};
		const result = await plugin.validateSettings({ plugin: PLUGIN_HASH, settings: values });
		assert.deepStrictEqual(result.settings, settings);
	});

	it('should parse mentions correctly', async function () {
		const content = 'this is a |Great-Product post with <code>stuff in code</code> and a\n\n<blockquote>blockquote or two</blockquote>' +
			'this is |Example-Item a post with `stuff in code` and a \n\n>blockquote or two' +
			'`code starts` with regular |Great-Product text afterwards' +
			'<code>code starts</code> with regular |Example-Item text afterwards';

		const expected = 'this is a <a class="plugin-link-mentions-keyword plugin-mentions-a" href="https://example.com/great-product">Great Product</a> post with <code>stuff in code</code> and a\n\n<blockquote>blockquote or two</blockquote>this is <a class="plugin-link-mentions-keyword plugin-mentions-a" href="https://www.example.com/example-item">Example Item</a> a post with `stuff in code` and a \n\n>blockquote or two`code starts` with regular <a class="plugin-link-mentions-keyword plugin-mentions-a" href="https://example.com/great-product">Great Product</a> text afterwards<code>code starts</code> with regular <a class="plugin-link-mentions-keyword plugin-mentions-a" href="https://www.example.com/example-item">Example Item</a> text afterwards';

		const result = await plugin.parseRaw(content);
		assert.strictEqual(result, expected);
	});
});
