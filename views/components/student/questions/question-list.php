<button 
	hx-get="{{ @BASE }}/lessons/{{ @lesson.course_id }}" 
	type="button" 
	class="btn btn-link mb-3">
	⟵ Quit
</button>



<script>
/*
	App state 
		questions: []
		progress: 0;
		questionNumber: 0;

	setProgressPercent
	setQuestionNumber
	addToAnswer
	removeFromAnswer
	showQuestion
	ShowAnswer
	checkAnswer

*/

var questions = {{ @@questions | raw }};
var progress = 0;
var questionNumber = 0;
var main = document.getElementsByTagName('main')[0];

let Progress = {
	view: function() {
        return m("p", progress);
    }
};

m.mount(main, Progress)

//console.log('questions', questions);

</script>