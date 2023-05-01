<?php echo $this->render('/views/components/student/student-nav.php',NULL,get_defined_vars(),0); ?>

<h2>Course</h2>
<h3 class="pb-3"><?= ($course['title']) ?></h3>

<?php if (empty($lessons)): ?><h4 class="pt-5">No Lessons</h4><?php endif; ?>

<h3>Lessons</h3>

<?php foreach (($lessons?:[]) as $lesson): ?>
	<div class="card mb-4">
		<div class="card-body">
			<span class="badge bg-primary rounded-pill float-end">Level: <?= ($lesson['level']) ?></span>
			<h3 class="mt-3"><?= ($lesson['title']) ?></h3>
			<?php if (!empty( $lesson['description'] )): ?>
				<p>Description: <?= ($lesson['description']) ?></p>
			<?php endif; ?>
			<a 
				class="btn btn-success" 
				hx-target="main" hx-get="<?= ($BASE) ?>/questions/<?= ($lesson['id']) ?>">
				Start lesson
			</a>
		</div>
	</div>
<?php endforeach; ?>
