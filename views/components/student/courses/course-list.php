<div class="course_list">
	
	<h1 class="pt-3 pb-3">Courses</h1>

	<repeat group="{{ @courses }}" value="{{ @course }}">
		
		<div hx-get="{{ @BASE }}/lessons/{{ @course.id }}" class="card mb-4">
			<div class="card-body">

				<svg style="width: 78px; height: 62; min-width: 78px; margin: 10px;">
					<image width="78" height="62" href="{{ @BASE }}/assets/img/flag_ie.svg"></image>
				</svg>

				<h3 class="pt-3">{{ @course.title }}</h3>

			</div>
		</div>

	</repeat>

</div>
