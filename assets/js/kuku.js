function lessonInstance() {
	return {
		questions: [
			{ native_phrase: 'Hello, world!', foreign_phrase: 'Hei, maailma!', native_phrase_array: ['Hello,', 'world!'], foreign_phrase_array: ['Hei,', 'maailma!'] },
			{ native_phrase: 'Goodbye, world!', foreign_phrase: 'Heipä, maailma!', native_phrase_array: ['Goodbye,', 'world!'], foreign_phrase_array: ['Heipä,', 'maailma!'] }
		] || [],
		//questions: {{ @@questions | raw }} || [];
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
			const qst = this.questions[this.questionNumber]['foreign_phrase_array'];
			const ans = this.answerArray;

			if (qst.length !== ans.length) {
				this.result = 'Incorrect';
			}
			else {
				for (let i = 0; i < qst.length; i++) {
					if (qst[i] !== ans[i]) {
						this.result = 'Incorrect';
					}
				}
			}

			if (this.result === 'Incorrect') {
				this.checkAlternativeAnswers();
			}
			/* console.log('q:',q);
			console.log('a:',a);
			console.log(result);
			 */
			this.resultMessage = this.questions[this.questionNumber]['foreign_phrase'];
			this.nextQuestionModal = true;
		},

		checkAlternativeAnswers() {
			const ans = this.answerArray;
			const alt_arr = this.questions[this.questionNumber]['alternative_foreign_phrase'] || [];

			alt_arr.forEach(alt_arr_item => {
				this.result = 'Correct';

				if (alt_arr_item.length !== ans.length) {
					this.result = 'Incorrect';
				}
				else {
					for (let i = 0; i < alt_arr_item.length; i++) {
						if (alt_arr_item[i] !== ans[i]) {
							this.result = 'Incorrect';
						}
					}
				}

				if (this.result === 'Correct') {
					return; // Break
				}
			});
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
