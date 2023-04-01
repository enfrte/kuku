<button 
	hx-get="{{ @BASE }}/lessons/{{ @lesson_id }}" 
	type="button" 
	class="btn btn-link mb-3">
	⟵ Back
</button>

<h2>Lesson</h2>
<h4 class="pb-3">{{ @lesson.title }}</h4>

<button 
	type="button" 
	class="btn btn-primary mb-3"
	hx-get="{{ @BASE }}/createQuestion/{{ @lesson_id }}"
	hx-target="#newQuestion"
	hx-swap="innerHTML">
	Create new question
</button>

<h2>Questions</h2>

<div id="newQuestion">
	<check if="{{ empty(@questions) }}"><true><h3 class="pt-5">No questions</h3></true></check>
</div>

<repeat group="{{ @questions }}" value="{{ @question }}">
	<include href="views/components/admin/questions/question-creator-editor.php" />
</repeat>

<script>

	if (typeof editButtons != 'undefined') {
		// Remove the event listener
		editButtons.forEach(button => {
			button.removeEventListener('click', handleEditButtonClick);
		});
	}

	var editButtons = document.querySelectorAll('.edit-button');

	editButtons.forEach(button => {
		button.addEventListener('click', handleEditButtonClick);
	});
	
	function handleEditButtonClick() {
		const question_id = this.dataset.editButton;
		const form = document.getElementById('questionForm'+question_id);
		const question = document.getElementById('questionContainer'+question_id);

		form.style.display = 'block';
		question.style.display = 'none';
		this.style.display = 'none';
	}

</script>