<main class="container">

<h2>Questions for</h2>
<h4 class="pt-5">{{ @lesson.title }}</h4>

<button 
	type="button" 
	class="btn btn-primary mb-3"
	hx-get="{{ @BASE }}/createQuestion/{{ @lesson_id }}"
	hx-target="#newQuestion"
	hx-swap="innerHTML">
	Create new question
</button>

<div id="newQuestion">
	<check if="{{ empty(@questions) }}"><true><h3 class="pt-5">No questions</h3></true></check>
</div>

<repeat group="{{ @questions }}" value="{{ @question }}">
	<include href="views/components/admin/main/questions/question-creator-editor.php" />
</repeat>

</main>

<script>

	if (typeof editButtons != 'undefined') {
		// To remove the event listener
		editButtons.forEach(button => {
			button.removeEventListener('click', handleEditButtonClick);
		});
	}

	var editButtons = document.querySelectorAll('.edit-button');

	function handleEditButtonClick() {
		const question_id = this.dataset.editButton;
		const form = document.getElementById('questionForm'+question_id);
		const question = document.getElementById('questionContainer'+question_id);

		form.style.display = 'block';
		question.style.display = 'none';
		this.style.display = 'none';
	}

	editButtons.forEach(button => {
		button.addEventListener('click', handleEditButtonClick);
	});

</script>