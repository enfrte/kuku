<h2>Course</h2>
<h3 class="pb-3">{{ @course.title }}</h3>

<button 
	type="button" 
	class="btn btn-primary mb-3"
	hx-get="{{ @BASE }}/createLesson/{{ @course_id }}"
	hx-target="main">
	Create new lesson
</button>

<check if="{{ empty(@lessons) }}"><true><h4 class="pt-5">No Lessons</h4></true></check>

<h3>Lessons</h3>

<repeat group="{{ @lessons }}" value="{{ @lesson }}">
	<div class="card mb-4">
		<div class="card-body">
			<h3 class="mt-3">{{ @lesson.title }}</h3>
			<p>{{ @lesson.tutorial }}</p>
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Description</th>
							<th>Level</th>
							<th>In production</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ @lesson.description }}</td>
							<td>{{ @lesson.level }}</td>
							<td>
								<check if="{{ !empty(@lesson.in_production) }}">
									<true>
										Yes
									</true>
									<false>
										No
									</false>
								</check>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="btn-group">
				<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
					Lesson menu
				</button>
				<ul class="dropdown-menu">
					<li 
						class="dropdown-item" 
						hx-get="{{ @BASE }}/questions/{{ @lesson.id }}"
						hx-target="main">
						Add sentences
					</li>
					<li 
						class="dropdown-item" 
						hx-get="{{ @BASE }}/batchQuestions/{{ @lesson.id }}"
						hx-target="main">
						Add batch sentences
					</li>
					<li 
						class="dropdown-item" 
						hx-get="{{ @BASE }}/editLesson/{{ @lesson.id }}"
						hx-target="main">
						Edit lesson details
					</li>
					<li><hr class="dropdown-divider"></li>
					<li 
						class="dropdown-item" 
						hx-get="{{ @BASE }}/deleteLesson/{{ @lesson.id }}"
						hx-vals='{ "course_id": {{ @course_id }} }'
						hx-target="main">
						Delete lesson
					</li>
				</ul>
			</div>
		</div>
	</div>
</repeat>
