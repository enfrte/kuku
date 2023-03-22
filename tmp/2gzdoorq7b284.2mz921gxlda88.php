<main class="container">

<form>
	<input type="hidden" id="course_id" name="course_id" value="<?= (@$course_id) ?>">

	<div class="mb-3">
		<label for="title" class="form-label">Title:</label>
		<input type="text" id="title" name="title" class="form-control" required maxlength="255">
	</div>

	<div class="mb-3">
		<label for="tutorial" class="form-label">Tutorial:</label>
		<textarea id="tutorial" name="tutorial" class="form-control" maxlength="99999"></textarea>
	</div>

	<div class="mb-3">
		<label for="level" class="form-label">Level:</label>
		<input type="number" id="level" name="level" class="form-control" value="0" required>
	</div>

	<div class="form-check mb-3">
		<input class="form-check-input" type="checkbox" name="in_production" value="0" id="in_production">
		<label class="form-check-label" for="in_production">
			Publish lesson
		</label>
	</div>

	<div class="mb-3">
		<button 
			type="submit" 
			class="btn btn-primary" 
			hx-post="<?= ($BASE) ?>/saveLesson" 
			hx-target="main" 
			hx-swap="outerHTML">
			Save
		</button>
	</div>
</form>

</main>