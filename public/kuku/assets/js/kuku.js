function lessonInstance() {
	return {
		/* questions: [
			{ native_phrase: 'Hello, world!', foreign_phrase: 'Hei, maailma!', native_phrase_array: ['Hello,', 'world!'], foreign_phrase_array: ['Hei,', 'maailma!'] },
			{ native_phrase: 'Goodbye, world!', foreign_phrase: 'Heipä, maailma!', native_phrase_array: ['Goodbye,', 'world!'], foreign_phrase_array: ['Heipä,', 'maailma!'] }
		] || [], */
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
			//debugger;
			this.result = 'Correct';
			const qst = this.questions[this.questionNumber]['foreign_phrase_array'];
			const ans = this.answerArray;

			if (qst.length !== ans.length) {
				this.result = 'Incorrect';
			}
			else {
				for (let i = 0; i < qst.length; i++) {
					if (qst[i] !== ans[i].word) {
						this.result = 'Incorrect';
					}
				}
			}

			if (this.result === 'Incorrect') {
				this.checkAlternativeAnswers();
			}

			this.resultMessage = this.questions[this.questionNumber]['foreign_phrase'];
			this.nextQuestionModal = true;
		},

		checkAlternativeAnswers: function() {
			//debugger;
			const ans = this.answerArray;
			const alt_arr = this.questions[this.questionNumber]['alternative_foreign_phrase'] || [];

			alt_arr.forEach(alt_arr_item => {
				this.result = 'Correct';

				if (alt_arr_item.length !== ans.length) {
					this.result = 'Incorrect';
				}
				else {
					for (let i = 0; i < alt_arr_item.length; i++) {
						if (alt_arr_item[i] !== ans[i].word) {
							this.result = 'Incorrect';
						}
					}
				}

				if (this.result === 'Correct') {
					return; // break out of forEach()
				}
			});
		},

		addToAnswer: function(choice, id) {
			//debugger;
			this.answerArray.push(choice);
			this.choiceArray.forEach((choice) => {
				if (choice.id === id) {
					choice.hidden = true;
				}
			});
		},

		removeFromAnswer: function(index, id) {
			//debugger;
			this.answerArray.splice(index, 1);
			this.choiceArray.forEach((choice) => {
				if (choice.id === id) {
					choice.hidden = false;
				}
			});
		}, 

		populateChoiceAnswerArea: function() {
			//debugger;
			this.choiceArray = [...this.questions[this.questionNumber]['foreign_phrase_object']];
			this.shuffleChoices(this.generateRandomWord());
			this.answerArray = [];
		},

		nextQuestion: function () {
			this.nextQuestionModal = false;

			if ((this.questionNumber + 1) == this.questions.length) {
				// Replace the progress button with an exit button
				this.exit = true;
				this.progressPercent = 100;
				return;
			}
			
			this.questionNumber++;
			this.updateProgressBar();
			this.populateChoiceAnswerArea();
		},

		shuffleChoices: function(randomWord = false) {
			//debugger;
			let array = this.choiceArray;

			if (randomWord) {
				const newChoiceObj = { id: (array.length), word: randomWord, hidden: false, width: 0, height: 0 }
				array.push(newChoiceObj);
			}
			
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		},

		// Generates a random word from a collection of unique words not found in the answer.
		generateRandomWord: function () {
			//debugger;
			let questions = this.questions;
			let uniqueWords = [];
			let currentQuestion = questions[this.questionNumber]['foreign_phrase_array'];

			questions.forEach(question => {
				question['foreign_phrase_array'].forEach( word => {
					if(uniqueWords.indexOf(word) === -1 && currentQuestion.indexOf(word) === -1) {
						uniqueWords.push(word); // Push if not already in array and also not in current question
					}
				} );
			});

			return uniqueWords[Math.floor(Math.random() * uniqueWords.length)];
		},

		updateOffsets() {
			//debugger;
			const choiceButton = this.$refs.choiceButton;
			this.widthOffset = choiceButton.offsetWidth;
			this.heightOffset = choiceButton.offsetHeight;
		},

		foo: function (event, index, id) {
			//console.log(event.target.offsetWidth);
			//console.log('foo:', event, index, id);
		},

		init: function () {
			this.populateChoiceAnswerArea();
			//this.updateOffsets();
			//console.log(this.questions);
			//console.log(this.choiceArray);
		}
	}
}

// If there's an error response, show it in the toast
document.addEventListener('htmx:responseError', event => {
	const toastEl = document.getElementById('toast');
	toastEl.querySelector('.toast-body').textContent = event.detail.xhr.responseText;
	const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
	toast.show();
});
