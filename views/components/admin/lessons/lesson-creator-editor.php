<check if="{{ !empty(@lesson) }}">
	<true><h4 class="pt-3">Edit: {{ @lesson.title }}</h4></true>
	<false><h4 class="pt-3">Make a new lesson</h4></false>
</check>

<form>
	<check if="{{ !empty(@lesson) }}">
		<true>
			<input type="hidden" name="id" value="{{ @lesson.id }}">
			<input type="hidden" name="course_id" value="{{ @lesson.course_id }}">
		</true>
		<false>
			<input type="hidden" name="course_id" value="{{ @@course_id }}">
		</false>
	</check>

	<div class="mb-3">
		<label for="title" class="form-label">Title:</label>
		<input type="text" id="title" name="title" value="{{ @@lesson.title }}" class="form-control" maxlength="255" required>
	</div>

	<div class="mb-3">
		<label for="tutorial" class="form-label">Description:</label>
		<textarea id="description" name="description" class="form-control" maxlength="300">{{ @@lesson.description }}</textarea>
	</div>

	<div class="mb-3">
		<label for="tutorial" class="form-label">Tutorial:</label>
		<textarea id="tutorial" name="tutorial" class="form-control" maxlength="99999">{{ @@lesson.tutorial }}</textarea>
	</div>

	<div class="mb-3">
		<label for="level" class="form-label">Level:</label>
		<input 
			type="number" 
			id="level" 
			name="level" 
			class="form-control" 
			<check if="{{ empty(@lesson) }}">
				<true>
					value="0" 
				</true>
				<false>
					value="{{ @lesson.level }}"
				</false>
			</check> 
			required>
	</div>

	<div class="form-check mb-3">
		<input 
			class="form-check-input" 
			type="checkbox" 
			name="in_production" 
			id="in_production"
			value="1"
			{{ !empty(@lesson.in_production) ? 'checked' : '' }}>
		<label class="form-check-label" for="in_production">
			Publish lesson
		</label>
	</div>

	<div class="mb-3">
		<button 
			type="submit" 
			class="btn btn-primary" 
			<check if="{{ empty(@lesson) }}">
				<true>
					hx-post="{{ @BASE }}/saveLesson" 
				</true>
				<false>
					hx-post="{{ @BASE }}/updateLesson" 
				</false>
			</check>
			hx-target="main">
			<check if="{{ empty(@lesson) }}">
				<true>Save</true>
				<false>Update</false>
			</check>
		</button>
	</div>
</form>
