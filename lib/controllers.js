'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res/* , next */) {
	res.render('admin/plugins/link-mentions', {});
};

module.exports = Controllers;
