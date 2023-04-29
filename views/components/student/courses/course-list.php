<include href="/views/components/student/student-nav.php" />

<div class="course_list">
	
	<h1 class="pt-3 pb-3">Courses<!-- Student --></h1>

	<repeat group="{{ @courses }}" value="{{ @course }}">
		
		<div hx-get="{{ @BASE }}/lessons/{{ @course.id }}" class="card mb-4 pointer">
			<div class="d-flex flex-column justify-content-center align-items-center card-body">

				<svg style="width: 78px; height: 62px; min-width: 78px; margin-top: 10px;">
					<image width="78" height="62" href="{{ @BASE }}/assets/img/flag_ie.svg"></image>
				</svg>

				<h3 class="pt-3">{{ @course.title }}</h3>

				<check if="{{!empty(@course.description)}}">
					<div>{{ @course.description }}</div>
				</check>

			</div>
		</div>

	</repeat>

</div>
