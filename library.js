'use strict';

const XRegExp = require('xregexp');

const meta = require.main.require('./src/meta');
const slugify = require.main.require('./src/slugify');
const socketPlugins = require.main.require('./src/socket.io/plugins');
const utils = require.main.require('./src/utils');

const controllers = require('./lib/controllers');
const utility = require('./lib/utility');

const plugin = module.exports;

socketPlugins.linkMentions = {};

const PLUGIN_HASH = 'link-mentions';

const SYMBOL = '|';
const REGEX = XRegExp(`(?:^|\\s|\\>|;)(\\${SYMBOL}[\\p{L}\\d\\-_.]+)`, 'g');
const isLatinMention = /@[\w\d\-_.]+$/;

plugin.init = async (params) => {
	const { router, middleware } = params;
	const routeHelpers = require.main.require('./src/routes/helpers');

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/link-mentions', middleware, [], controllers.renderAdminPage);
};

plugin.addAdminNavigation = function (header, callback) {
	header.plugins.push({
		route: '/plugins/link-mentions',
		icon: 'fa-tint',
		name: 'Link Mentions',
	});

	callback(null, header);
};

plugin.validateSettings = function (data) {
	const { plugin, settings } = data;
	if (PLUGIN_HASH !== plugin) {
		return data;
	}

	if (!Array.isArray(settings['mention-list'])) {
		settings['mention-list'] = [];
	}

	const keywords = settings['mention-list'].map(pair => pair.keyword);

	data.settings = {
		'mention-list': settings['mention-list']
			.filter((pair, idx) => pair.keyword.trim() &&
				pair.link.trim() &&
				utils.isAbsoluteUrl(pair.link) &&
				idx === keywords.indexOf(pair.keyword))
			.map((pair) => {
				pair.keyword = utils.stripHTMLTags(pair.keyword.trim());
				pair.link = utils.stripHTMLTags(pair.link.trim());
				return pair;
			}),
	};

	return data;
};

socketPlugins.linkMentions.keywordSearch = async function (socket, data) {
	const query = data.query || '';
	const settings = await meta.settings.get(PLUGIN_HASH);
	if (!settings || !Array.isArray(settings['mention-list'])) {
		return [];
	}
	return settings['mention-list'].map(pair => pair.keyword).filter(k => k.startsWith(query));
};

plugin.parsePost = async function (data) {
	if (!data || !data.postData || !data.postData.content) {
		return data;
	}
	data.postData.content = await plugin.parseRaw(data.postData.content);
	return data;
};

plugin.parseRaw = async function (content) {
	let matches = [];
	let splitContent = utility.split(content, false, false, true);

	splitContent.forEach(function (cleanedContent, i) {
		// skip code/blockquote
		if ((i % 2) === 0) {
			matches = matches.concat(cleanedContent.match(REGEX) || []);
		}
	});

	if (!matches.length) {
		return content;
	}

	// Filter duplicates, clean up cruft
	matches = matches.filter((cur, idx) => idx === matches.indexOf(cur))
		.map(function (match) {
			const atIndex = match.indexOf(SYMBOL);
			return atIndex !== 0 ? match.slice(atIndex) : match;
		});

	const keyword2Pair = await getKeyword2PairTable();

	matches.forEach((match) => {
		match = removePunctuationSuffix(match.slice(1));
		const pair = keyword2Pair[slugify(match)];

		if (!pair) {
			return;
		}

		const matchRegex = isLatinMention.test(match) ?
			new RegExp(`(?:^|\\s|>|;)\\${SYMBOL}${match}\\b`, 'g') :
			new RegExp(`(?:^|\\s|>|;)\\${SYMBOL}${match}`, 'g');

		splitContent = splitContent.map((c, i) => {
			if ((i % 2) === 1) {
				return c;
			}
			return c.replace(matchRegex, function (inlineMatch) {
				// Adding leftover bits
				const plain = inlineMatch.slice(0, inlineMatch.indexOf(SYMBOL));
				return `${plain}<a class="plugin-link-mentions-keyword plugin-mentions-a" href="${pair.link}">${pair.keyword}</a>`;
			});
		});
	});

	return splitContent.join('');
};

async function getKeyword2PairTable() {
	const settings = await meta.settings.get(PLUGIN_HASH);
	if (!settings || !Array.isArray(settings['mention-list'])) {
		return {};
	}
	return Object.fromEntries(settings['mention-list'].map(pair => [slugify(pair.keyword), { ...pair }]));
}

function removePunctuationSuffix(string) {
	return string.replace(/[!?.]*$/, '');
}

module.exports = plugin;
