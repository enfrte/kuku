<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Kuku</title>

	<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
	<!-- <script src="https://unpkg.com/mithril/mithril.js"></script> -->
	<script src="https://unpkg.com/htmx.org@1.8.6" integrity="sha384-Bj8qm/6B+71E6FQSySofJOUjA/gq330vEqjFx9LakWybUySyI1IQHwPtbTU7bNwx" crossorigin="anonymous"></script>
	
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">

	<link rel="stylesheet" href="<?= ($BASE) ?>/assets/css/custom.css">
	<script src="<?= ($BASE) ?>/assets/js/kuku.js"></script>
</head>
<body>

<?php if (!empty($_SESSION['user']['admin'])): ?>
	
		<nav id="mainMenu" class="container">
			
				<ul class="nav justify-content-end pt-3">
					<li 
						class="nav-item nav-link" 
						hx-get="<?= ($BASE) ?>/courses" 
						hx-target="main">
						Courses
					</li>
					<li 
						class="nav-item nav-link" 
						hx-get="<?= ($BASE) ?>/createCourse" 
						hx-target="main">
						New Course
					</li>
					<li 
						class="nav-item nav-link">
						<a href="<?= ($BASE) ?>/logout">Logout</a>
					</li>
				</ul>
			
		</nav>
		<main 
			class="container"
			hx-get="<?= ($BASE) ?>/welcome" 
			hx-trigger="load" 
			hx-target="this">
		</main>
	
	<?php else: ?>
		<main 
			class="container"
			hx-get="<?= ($BASE) ?>/courses" 
			hx-trigger="load" 
			hx-target="this">
		</main>
	
<?php endif; ?>

<?php echo $this->render('/views/components/error-toast.php',NULL,get_defined_vars(),0); ?>

</body>
</html>