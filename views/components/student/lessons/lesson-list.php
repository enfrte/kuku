<h2>Course</h2>
<h3 class="pb-3">{{ @course.title }}</h3>

<check if="{{ empty(@lessons) }}"><true><h4 class="pt-5">No Lessons</h4></true></check>

<h3>Lessons</h3>

<repeat group="{{ @lessons }}" value="{{ @lesson }}">
	<div class="card mb-4">
		<div class="card-body">
			<span class="badge bg-primary rounded-pill float-end">Level: {{ @lesson.level }}</span>
			<h3 class="mt-3">{{ @lesson.title }}</h3>
			<check if="!empty({{ @lesson.description }})">
				<p>Description: {{ @lesson.description }}</p>
			</check>
			<p>This could recycle questions/lesson.id and return a json object for Mithril to use.</p>
			<button 
				class="btn btn-success" 
				hx-get="{{ @BASE }}/questions/{{ @lesson.id }}"
				hx-target="main">
				Start lesson
			</button>	
		</div>
	</div>
</repeat>
