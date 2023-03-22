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

<div id="newQuestion"></div>

<check if="{{ empty(@questions) }}"><true><h3 class="pt-5">No questions</h3></true></check>

<repeat group="{{ @questions }}" value="{{ @question }}">
	
	<include href="views/components/admin/main/questions/question-creator-editor.php" />

</repeat>

</main>