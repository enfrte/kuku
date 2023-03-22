<div class="row">
	<form>
		<input type="hidden" name="lesson_id" value="<?= ($lesson_id) ?>">
		<div class="col-md-6 mb-3">
			<label 
				for="native_phrase<?= (@$question['id']) ?>" 
				class="form-label">
				Native Phrase
			</label>
			<input 
				type="text" 
				class="form-control" 
				id="native_phrase<?= (@$question['id']) ?>" 
				name="questions[<?= (@$question['id']) ?>][native_phrase]" 
				value="<?= (@$question['native_phrase']) ?>" 
				required>
		</div>
		<div class="col-md-6 mb-3">
			<label 
				for="foreign_phrase<?= (@$question['id']) ?>" 
				class="form-label">
				Foreign Phrase
			</label>
			<input type="text" 
				class="form-control" 
				id="foreign_phrase<?= (@$question['id']) ?>" 
				name="questions[<?= (@$question['id']) ?>][foreign_phrase]" 
				value="<?= (@$question['foreign_phrase']) ?>" 
				required>
		</div>

		<div class="col-md-6 mb-3">
			<label 
				for="alternative_native_phrases<?= (@$question['id']) ?>" 
				class="form-label">
				Alternative native phrases
			</label>
			<textarea 
				class="form-control" 
				id="alternative_native_phrases<?= (@$question['id']) ?>" 
				name="questions[<?= (@$question['id']) ?>][alternative_native_phrases]"><?= (@$question['alternative_native_phrases']) ?></textarea>
		</div>
	
		<div class="col-md-6 mb-3">
			<label 
				for="alternative_foreign_phrases<?= (@$question['id']) ?>" 
				class="form-label">
				Alternative foreign phrases
			</label>
			<textarea 
				class="form-control" 
				id="alternative_foreign_phrases<?= (@$question['id']) ?>" 
				name="questions[<?= (@$question['id']) ?>][alternative_foreign_phrases]"><?= (@$question['alternative_foreign_phrases']) ?></textarea>
		</div>

		<?php if (empty($questions)): ?>
			<button 
				type="button" 
				class="btn btn-primary mb-3"
				hx-post="<?= ($BASE) ?>/saveQuestion"
				hx-target="main"
				hx-swap="outerHTML">
				Save
			</button>
		<?php endif; ?>

		<?php if (!empty($questions)): ?>
			<button 
				type="button" 
				class="btn btn-link mb-3">
				Edit 
			</button>
		<?php endif; ?>

	</form>

	<hr>
</div>
