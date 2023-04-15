<button 
	hx-get="{{ @BASE }}/lessons/{{ @lesson.course_id }}" 
	type="button" 
	class="btn btn-link mb-3">
	⟵ Quit
</button>

<div id="progress"></div>
<div id="question"></div>
<div id="answer-area"></div>
<div id="choice-area"></div>
<div id="question-navigation"></div>

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

let questions = {{ @@questions | raw }};
console.log('questions', questions);
let progressPercent = 0;
let questionNumber = 0;
let currentQuestion = function (questionNumber) {
	return questions[questionNumber]['native_phrase'];
};
let currentQuestionArray = function (questionNumber) {
	return questions[questionNumber]['native_phrase'];
};
let answerArray = [];
let result;
let commonButton = "button.btn.btn-success.mt-3"; 
let choicePhrase = 'native_phrase_array';
let answerPhrase = 'foreign_phrase_array';

let updateProgress = function() {
	console.log(questionNumber, questions.length);
	if ((questionNumber + 1) == questions.length) {
		// Replace the progress button with an exit button
		console.log('The end.');
		let questionNavigation = document.getElementById('question-navigation');
		m.mount(questionNavigation, ExitButton);
		htmx.process(questionNavigation); // tell htmx to acknowledge ExitButton
		return;
	}
	questionNumber++;
	progressPercent = Math.ceil((questionNumber / questions.length) * 100);
}

let outputChoices = function() {

};

//nextQuestion();


// COMPONENTS 

let ExitButton = {
	view: function() {
		return m(commonButton, { 'hx-get': '{{ @BASE }}/lessons/{{ @lesson.course_id }}' }, 'Back to lessons');
	}
};

let Progress = {
	view: function() {
		return m(
			".progress", { style: { backgroundColor: "green", width: progressPercent + '%' } }, ''
		);
	}
};

let Question = {
	view: function() {
		return [
			m("p.question",	{ style: {}	}, currentQuestion(questionNumber) ),
		];
	}
};

let AnswerArea = {
	answers: function() { return answerArray },

	view: function() {
		return [
			this.answers().map((a) => m(
				"button.btn.btn-sm.btn-secondary", 
				{
					style: 'margin: 2.5px;',
					onclick: function() {
						//answerArray.push(q);
					}
				}, 
				a
			)),
			//m("button.btn.btn-sm.btn-secondary", {}, 'answer-pool'),
			m("hr",	null ),
		];
	}
};

let ChoiceArea = {
	choices: questions[questionNumber][choicePhrase],

	view: function() {
		return [
			this.choices.map((val, index, arr) => m(
				"button.btn.btn-sm.btn-secondary", 
				{
					style: 'margin: 2.5px;',
					onclick: () => {
						answerArray.push(val);
						arr.splice(index, 1);
					}
				}, 
				val
			))
		];
	}
};

let QuestionNavigation = {

	nextQuestion: function() {
		currentQuestion = currentQuestion(questionNumber);
		console.log(currentQuestion);
	},

	checkAnswer: function() {
		updateProgress();
		//console.log('checkAnswer');
	},

	view: function() {
		return [
			m(
				commonButton, 
				{ onclick: (result == true || result == false) ? this.nextQuestion : this.checkAnswer }, 
				(result == true || result == false) ? 'CONTINUE' : 'CHECK'
			)
		];
	}
	
};

// Mount stuff 

m.mount(document.getElementById('progress'), Progress)
m.mount(document.getElementById('question'), Question)
m.mount(document.getElementById('answer-area'), AnswerArea)
m.mount(document.getElementById('choice-area'), ChoiceArea)
m.mount(document.getElementById('question-navigation'), QuestionNavigation)

// Get things rolling 

currentQuestion(questionNumber);

</script>