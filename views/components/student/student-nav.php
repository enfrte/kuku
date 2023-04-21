
<nav id="mainMenu" class="container">
	<check if="{{ empty(@lesson.course_id) }}">
		<ul class="nav justify-content-end pt-3">
			<li 
				class="nav-item nav-link" 
				hx-get="{{ @BASE }}/courses" 
				hx-target="main">
				Courses
			</li>
		</ul>
	</check>
	
	<check if="{{ !empty(@lesson.tutorial) }}">
		<ul class="nav justify-content-end pt-3">
			<li class="nav-item nav-link" data-bs-toggle="modal" data-bs-target="#tutorial">
				Tutorial
			</li>
		</ul>
	</check>
</nav>
