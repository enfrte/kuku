<check if="{{ !empty(@course) }}">
	<true><h4 class="pt-3">Edit: {{ @@course.title }}</h4></true>
	<false><h4 class="pt-3">Make a new course</h4></false>
</check>

<form>
	<check if="{{ !empty(@course.id) }}">
		<true>
			<input type="hidden" name="id" value="{{ @@course.id }}">
		</true>
	</check>
    <div class="mb-3">
		<label for="title" class="form-label">Title</label>
		<input type="text" name="title" class="form-control" id="title" value="{{ @@course.title }}" required>
    </div>
	<div class="mb-3">
		<label for="description" class="form-label">Description</label>
		<textarea name="description" class="form-control" id="description" cols="30" rows="5">{{ @@course.description }}</textarea>
	</div>
	
	<check if="{{ empty(@course) }}">
		<true>
			<div class="mb-3">
				<label for="language" class="form-label">Language (you are teaching)</label>
				<input type="text" name="language" class="form-control" id="language" required>
			</div>

			<div class="mb-3">
				<label for="instruction_language" class="form-label">Instruction language</label>
				<input type="text" name="instruction_language" class="form-control" id="instruction_language" required>
			</div>
		</true>
	</check>

	<div class="mb-3">
		<label for="version" class="form-label">Version</label>
		<input type="number" name="version" class="form-control" id="version" value="1">
	</div>

	<div class="form-check mb-3">
		<input 
			class="form-check-input" 
			type="checkbox" 
			name="in_production" 
			id="in_production" 
			value="1" 
			{{ !empty(@course.in_production) ? 'checked' : '' }}>
		<label class="form-check-label" for="in_production">
			Publish course
		</label>
	</div>

	<div class="mb-3">
		<button type="submit" class="btn btn-primary" 
			hx-post="{{ @BASE }}{{ empty(@course.id) ? '/saveCourse' : '/updateCourse' }}"
			hx-target="main">
			{{ !empty(@course.id) ? 'Update' : 'Create' }}
		</button>
	</div>
</form>
