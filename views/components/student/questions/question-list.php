
<div x-data='{ questions: {{ @@questions | raw }} }'>
	<div x-data="lessonInstance()" class="pt-2">

		<div class="progress-container pt-3 d-flex align-items-center justify-content-between">
			<div 
				hx-get="{{ @BASE }}/lessons/{{ @lesson.course_id }}" 
				hx-target="main"
				class="btn btn-lg pt-1 pb-1 ps-0 me-2" 
				type="button">
				<span class="bi bi-x-lg text-white"></span>
		</div>

			<div class="progress-bar-container d-block w-100">
				<div class="progress">
					<div 
						class="progress-bar bg-lightgreen" 
						role="progressbar" 
						:style="'width:'+progressPercent+'%;'" 
						:aria-valuenow="progressPercent" 
						aria-valuemin="0" 
						aria-valuemax="100">
					</div>
				</div>
			</div>
		</div>

		<div class="border border-secondary border-2 rounded-3 text-white p-4 mt-4 pb-1">
			<p x-text="questions[questionNumber]['native_phrase']"></p>
		</div>

		<hr>

		<div class="answer-container">
			<template x-for="(answer, index) in answerArray" :key="index">
				<button 
					class="btn btn-sm btn-outline-secondary rounded-4 border-2 text-white m-1 pt-2 pb-2" 
					x-text="answer" 
					x-on:click="moveToChoice(answer, index)">
				</button>
			</template>
		</div>

		<hr class="mb-4">

		<div class="choice-container d-flex justify-content-center mb-1">
			<template x-for="(choice, index) in choiceArray" :key="index">
				<button 
					class="btn btn-sm btn-outline-secondary rounded-4 border-2 text-white m-1 pt-2 pb-2" 
					x-text="choice" 
					x-on:click="moveToAnswer(choice, index)">
				</button>
			</template>
		</div>

		<div class="d-grid">
			<button 
				:disabled="answerArray.length < 1" 
				class="btn btn-lg bt-100 btn-light bg-lightgreen rounded-4 text-black mt-3" 
				x-on:click="checkAnswer()">
				CHECK
			</button>
		</div>	

		<div 
			x-show="nextQuestionModal" 
			x-transition:enter="transition-transform transition-opacity duration-500" 
			x-transition:enter-start="transform translate-y-full" 
			x-transition:enter-end="transform translate-x-0"
			class="fixed-bottom" 
			:class="{ 'bg-success': result === 'Correct', 'bg-danger': result === 'Incorrect' }"
			style="height: 200px;">
			<div class="container h-100">
				<div class="row h-100 align-items-end justify-content-center">
					<h3 x-text="result"></h3>
					<p x-text="resultMessage" class="text-white"></p>
					<button 
						class="btn btn-light btn-lg btn-block mt-auto mb-4"
						x-on:click="nextQuestion">CONTINUE</button>
				</div>
			</div>
		</div>

		<div 
			x-show="exit" 
			x-transition:enter="transition-transform transition-opacity duration-500" 
			x-transition:enter-start="transform translate-y-full" 
			x-transition:enter-end="transform translate-x-0"
			class="fixed-bottom bg-grey" 
			style="height: 200px;">
			<div class="container h-100">
				<div class="row h-100 align-items-end justify-content-center">
					<h3>Lesson complete</h3>
					<p>Maybe show performance information here.</p>
					<button 
						hx-get="{{ @BASE }}/lessons/{{ @lesson.course_id }}" 
						hx-target="main"
						class="btn btn-primary btn-lg btn-block mt-auto mb-4">
						EXIT
					</button>
				</div>
			</div>
		</div>

		<!-- <div class="d-grid">
			<button class="btn btn-lg bt-100 btn-secondary bg-lightgreen rounded-4 text-black mt-3" x-on:click="console.log(questions)">
				Log Questions
			</button>
		</div> -->
		
	</div>
</div>