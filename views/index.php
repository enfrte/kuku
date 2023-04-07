<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>

	<script src="https://unpkg.com/htmx.org@1.8.6" integrity="sha384-Bj8qm/6B+71E6FQSySofJOUjA/gq330vEqjFx9LakWybUySyI1IQHwPtbTU7bNwx" crossorigin="anonymous"></script>
	
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>

	<style>
		.container {
			max-width: 666px;
		}
		.dropdown-item, .nav-item {
			cursor: pointer;
		}
		.kuku-textarea-135 {
			height: 135px;
		}

		.pointer {
			cursor: pointer;
		}
	</style>
</head>
<body data-bs-theme="dark">

<nav class="container">
<check if="{{ !empty($_SESSION['user']['admin']) }}">
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
	<false>
		<ul class="nav justify-content-end pt-3">
			<li 
				class="nav-item nav-link" 
				hx-get="{{ @BASE }}/courses" 
				hx-target="main">
				Courses
			</li>
		</ul>
	</false>
</check>
</nav>

<check if="{{ !empty($_SESSION['user']['admin']) }}">
	<true>
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


</body>
</html>