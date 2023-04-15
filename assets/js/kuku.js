function lessonInstance() {
	return {
		questions: [
			{ native_phrase: 'Hello, world!', foreign_phrase: 'Hei, maailma!', native_phrase_array: ['Hello,', 'world!'], foreign_phrase_array: ['Hei,', 'maailma!'] },
			{ native_phrase: 'Goodbye, world!', foreign_phrase: 'Heipä, maailma!', native_phrase_array: ['Goodbye,', 'world!'], foreign_phrase_array: ['Heipä,', 'maailma!'] }
		] || [],
		questionNumber: 0,
		progressPercent: 0,
		question: '',
		answerArray: [],
		choiceArray: [],
		result: '',
		resultMessage: '',
		exit: false,
		nextQuestionModal: false,

		updateProgressBar: function() {
			this.progressPercent = Math.ceil((this.questionNumber / this.questions.length) * 100);
		},
		
		checkAnswer: function() {
			this.result = 'Correct';
			const q = this.questions[this.questionNumber]['foreign_phrase_array'];
			const a = this.answerArray;

			if (q.length !== a.length) {
				this.result = 'Incorrect';
			}
			else {
				for (let i = 0; i < q.length; i++) {
					if (q[i] !== a[i]) {
						this.result = 'Incorrect';
					}
				}
			}
			/* console.log('q:',q);
			console.log('a:',a);
			console.log(result);
			 */
			this.resultMessage = this.questions[this.questionNumber]['foreign_phrase'];
			this.nextQuestionModal = true;
		},

		moveToAnswer: function(choice, index) {
			this.answerArray.push(choice);
			this.choiceArray.splice(index, 1);
		},

		moveToChoice: function(answer, index) {
			this.choiceArray.push(answer);
			this.answerArray.splice(index, 1);
		}, 

		resetChoiceAnswerArea: function() {
			this.choiceArray = [...this.questions[this.questionNumber]['foreign_phrase_array']];
			this.answerArray = [];
		},

		nextQuestion: function () {
			//this.answerArray.length > 0 ? this.nextQuestionModal = true : this.nextQuestionModal = false;
			this.nextQuestionModal = false;

			if ((this.questionNumber + 1) == this.questions.length) {
				// Replace the progress button with an exit button
				this.exit = true;
				this.progressPercent = 100;
				return;
			}
			
			this.questionNumber++;
			this.updateProgressBar();
			this.resetChoiceAnswerArea();
		},

		init: function () {
			this.choiceArray = [...this.questions[this.questionNumber]['foreign_phrase_array']];
		}
	}
}
