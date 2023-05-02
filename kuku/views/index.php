<include href="/views/header.htm" />

<check if="{{ !empty($_SESSION['user']['admin']) }}">
	<true>
		<nav id="mainMenu" class="container">
			<true>
				<ul class="nav justify-content-end pt-3">
					<li 
						class="nav-item nav-link" 
						hx-get="{{ @BASE }}/courses" 
						hx-target="main">
						Courses
					</li>
					<li 
						class="nav-item nav-link" 
						hx-get="{{ @BASE }}/createCourse" 
						hx-target="main">
						New Course
					</li>
					<li 
						class="nav-item nav-link">
						<a href="{{ @BASE }}/logout">Logout</a>
					</li>
				</ul>
			</true>
		</nav>
		<main 
			class="container"
			hx-get="{{ @BASE }}/welcome" 
			hx-trigger="load" 
			hx-target="this">
		</main>
	</true>
	<false>
		<main 
			class="container"
			hx-get="{{ @BASE }}/courses" 
			hx-trigger="load" 
			hx-target="this">
		</main>
	</false>
</check>

<include href="/views/footer.htm" />