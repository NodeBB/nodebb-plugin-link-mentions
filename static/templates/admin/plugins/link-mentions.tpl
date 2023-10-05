<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->

	<div class="row m-0">
		<div id="spy-container" class="col-12 px-0 mb-4" tabindex="0">
			<div class="mb-3">
				<h5 class="">Add Link Mentions</h5>
				<div class="quick-form">
					<p class="lead">
						You can add keyword/link pairs using the form below. Changes are kept after saving. Duplicate keywords will be discarded.
					</p>
					<div class="mb-3">
						<label class="form-label" for="keyword">Keyword</label>
						<input type="text" id="keyword" name="keyword" title="Keyword" class="form-control" placeholder="Fajita" required>
					</div>
					<div class="mb-3">
						<label class="form-label" for="link">URL</label>
						<input type="url" id="link" name="link" title="link" class="form-control" placeholder="https://example.com/fajita" required>
					</div>
					<button type="button" id="add-pair" class="btn btn-info">Add Pair</button>
				</div>
			</div>

			<form role="form" class="link-mentions-settings">
				<div class="">
					<h5>Link Mention List</h5>
					<div class="">
						<div class="form-group" data-type="sorted-list" data-sorted-list="mention-list" data-item-template="admin/plugins/link-mentions/partials/sorted-list/item" data-form-template="admin/plugins/link-mentions/partials/sorted-list/form">
							<ul data-type="list" class="list-group"></ul>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
