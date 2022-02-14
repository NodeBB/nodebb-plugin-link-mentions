<form role="form" class="link-mentions-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Add Mentions</div>
		<div class="col-sm-10 col-xs-12 quick-form">
			<p class="lead">
				You can add keyword/link pairs using the form below. Changes are kept after saving. Duplicate keywords will be discarded.
			</p>
			<div class="form-group">
				<label for="keyword">Keyword</label>
				<input type="text" id="keyword" name="keyword" title="Keyword" class="form-control" placeholder="Fajita" required>
			</div>
			<div class="form-group">
				<label for="link">URL</label>
				<input type="url" id="link" name="link" title="link" class="form-control" placeholder="https://example.com/fajita" required>
			</div>
			<button type="button" id="add-pair" class="btn btn-info">Add Pair</button>
		</div>
	</div>

	<br /><br />

	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Mention List</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group" data-type="sorted-list" data-sorted-list="mention-list" data-item-template="admin/plugins/link-mentions/partials/sorted-list/item" data-form-template="admin/plugins/link-mentions/partials/sorted-list/form">
				<ul data-type="list" class="list-group"></ul>
			</div>
		</div>
	</div>

	<br />
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
