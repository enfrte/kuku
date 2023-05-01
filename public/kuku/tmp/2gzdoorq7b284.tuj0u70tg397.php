
<nav id="mainMenu" class="container">
	<?php if (empty($lesson['course_id'])): ?>
		<ul class="nav justify-content-end pt-3">
			<li 
				class="nav-item nav-link" 
				hx-get="<?= ($BASE) ?>/courses" 
				hx-target="main">
				Courses
			</li>
		</ul>
	<?php endif; ?>
	
	<?php if (!empty($lesson['tutorial'])): ?>
		<ul class="nav justify-content-end pt-3">
			<li class="nav-item nav-link" data-bs-toggle="modal" data-bs-target="#tutorial">
				Tutorial
			</li>
		</ul>
	<?php endif; ?>
</nav>
