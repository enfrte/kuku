<main class="container" data-bs-theme="light">

<h1>Make a new course</h1>

<form>
    <div class="mb-3">
		<label for="title" class="form-label">Title</label>
		<input type="text" name="title" class="form-control" id="title" required>
    </div>
	<div class="mb-3">
		<label for="description" class="form-label">Description</label>
		<textarea name="description" class="form-control" id="description" cols="30" rows="5"></textarea>
	</div>

	<div class="mb-3">
		<label for="language" class="form-label">Language (you are teaching)</label>
		<input type="text" name="language" class="form-control" id="language" required>
	</div>

	<div class="mb-3">
		<label for="instruction_language" class="form-label">Instruction language</label>
		<input type="text" name="instruction_language" class="form-control" id="instruction_language" required>
	</div>

	<div class="form-check mb-3">
		<input class="form-check-input" type="checkbox" name="in_production" value="1" id="in_production">
		<label class="form-check-label" for="in_production">
			Publish course
		</label>
	</div>

	<div class="mb-3">
		<button type="submit" class="btn btn-primary" 
			hx-post="<?= ($BASE) ?>/saveCourse" 
			hx-target="main" 
			hx-swap="outerHTML">
			Create
		</button>
	</div>
</form>

</main>