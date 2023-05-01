
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
			<!-- <div class="mb-3">
				<label for="learningLanguage" class="form-label">Language (you are teaching)</label>
				<input type="text" name="language" class="form-control" id="learningLanguage" required>
			</div> -->

			<!-- <div class="mb-3">
				<label for="instructionLanguage" class="form-label">Instruction language</label>
				<input type="text" name="instruction_language" class="form-control" id="instructionLanguage" required>
			</div> -->
		

			<div class="mb-3">
				<div class="row g-2">
					<div class="col-md-6">
						<label for="learningLanguage" class="form-label">Language (you are teaching)</label>
						<input 
							id="learningLanguage"
							type="search" 
							name="language"
							hx-post="{{ @BASE }}/languageSearch/language" 
							hx-target="#languageSelectContainer"
							hx-swap="innerHTML"
							hx-trigger="keyup changed delay:500ms, search" 
							class="form-control"
							placeholder="Filter language selection"
							required>
					</div>
					<div id="languageSelectContainer" class="col-md-6"></div>
				</div>
			</div>

			<div class="mb-3">
				<div class="row g-2">
					<div class="col-md-6">
						<label for="instructionLanguage" class="form-label">Instruction language</label>
						<input 
							id="instructionLanguage"
							type="search" 
							name="instruction_language"
							hx-post="{{ @BASE }}/languageSearch/instruction_language" 
							hx-target="#instructionLanguageSelectContainer"
							hx-swap="innerHTML"
							hx-trigger="keyup changed delay:500ms, search" 
							class="form-control"
							placeholder="Filter language selection"
							required>
					</div>
					<div id="instructionLanguageSelectContainer" class="col-md-6"></div>
				</div>
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

