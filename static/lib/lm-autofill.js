'use strict';

/* globals $, document, socket, window */

$(document).ready(function () {
	const SYMBOL = '|';

	$(window).on('composer:autocomplete:init', function (ev, data) {
		let slugify;
		let prevTerm = '';
		let noMatch = false;

		const strategy = {
			match: new RegExp(`\\B\\${SYMBOL}(([^\\s\\n]\\s?)*)?$`),
			search: function (term, callback) {
				// Don't search on further key presses if there's no match already
				if (term && term.startsWith(prevTerm) && noMatch) {
					return callback([]);
				}
				noMatch = false;
				prevTerm = term;

				// Get composer metadata
				const uuid = data.options.className && data.options.className.match(/dropdown-(.+?)\s/)[1];
				require(['composer', 'slugify'], function (composer, _slugify) {
					slugify = _slugify;
					socket.emit('plugins.linkMentions.keywordSearch', {
						query: term,
						composerObj: composer.posts[uuid],
					}, function (err, pairs) {
						if (err) {
							return callback([]);
						}

						noMatch = pairs.length < 1;
						callback(pairs.sort((a, b) => a.toLocaleLowerCase() > b.toLocaleLowerCase()));
					});
				});
			},
			index: 1,
			replace: function (mention) {
				mention = $('<div/>').html(mention).text();
				return SYMBOL + slugify(mention, true) + ' ';
			},
			cache: true,
		};

		data.strategies.push(strategy);
	});
});
