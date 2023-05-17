<include href="/views/components/student/student-nav.php" />

<div x-data='{ questions: {{ @@questions }} }'>
	<div x-data="lessonInstance()" class="pt-2">

		<div class="progress-container pt-3 d-flex align-items-center justify-content-between">
			<div 
				hx-get="{{ @BASE }}/lessons/{{ @lesson.course_id }}" 
				hx-target="main"
				class="btn btn-lg pt-1 pb-1 ps-0 me-2" 
				type="button">
				<span class="bi bi-x-lg text-dark"></span>
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

		<div class="border border-secondary border-2 rounded-3 text-dark p-4 mt-4 pb-1">
			<p x-text="questions[questionNumber]['native_phrase']"></p>
		</div>

		<hr>

		<div class="answer-container">
			<template x-for="(answer, index) in answerArray" :key="index">
				<button 
					class="btn btn-sm btn-outline-secondary rounded-4 border-2 text-dark m-1 pt-2 pb-2" 
					x-text="answer" 
					x-on:mouseup="moveToChoice(answer, index)">
				</button>
			</template>
		</div>

		<hr class="mb-4">

		<div class="choice-container d-flex flex-wrap justify-content-center mb-1">
			<template x-for="(choice, index) in choiceArray" :key="index">
				<button 
					class="btn btn-sm btn-outline-secondary rounded-4 border-2 text-dark m-1 pt-2 pb-2" 
					x-text="choice" 
					x-on:mouseup="moveToAnswer(choice, index)">
				</button>
			</template>
		</div>

		<div class="d-grid">
			<button 
				:disabled="answerArray.length < 1" 
				class="btn btn-lg bt-100 btn-success bg-lightgreen rounded-4 text-black mt-3" 
				x-on:click="checkAnswer()">
				CHECK
			</button>
		</div>	

		<div 
			x-show="nextQuestionModal" 
			x-transition:enter="transition-transform transition-opacity duration-500" 
			x-transition:enter-start="transform translate-y-full" 
			x-transition:enter-end="transform translate-x-0"
			class="container fixed-bottom" 
			:class="{ 'bg-success': result === 'Correct', 'bg-danger': result === 'Incorrect' }"
			style="height: 200px;">
			<div class="container h-100">
				<div class="row h-100 align-items-end justify-content-center">
					<h3 x-text="result" class="text-light"></h3>
					<p x-text="resultMessage" class="text-light"></p>
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
					<h3 class="text-light">Lesson complete</h3>
					<p class="text-light">Maybe show performance information here.</p>
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

<check if="{{ !empty(@lesson.tutorial) }}">
	<div class="modal fade" id="tutorial" tabindex="-1" aria-labelledby="tutorialLabel" aria-hidden="true">
	<div class="modal-dialog modal-fullscreen">
		<div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title" id="tutorialLabel">{{ @lesson.title }}</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body container">
			{{ @lesson.tutorial }}
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Back to lesson</button>
		</div>
		</div>
	</div>
	</div>
</check>