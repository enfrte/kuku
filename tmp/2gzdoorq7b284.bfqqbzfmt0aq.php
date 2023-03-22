<main class="container">

<h1 class="pt-3">Courses</h1>

<?php if (empty($courses)): ?><h4 class="pt-5">No Courses</h4><?php endif; ?>

<?php foreach (($courses?:[]) as $course): ?>
    <h3 class="pt-5"><?= ($course['title']) ?></h3>
	<p><?= ($course['description']) ?></p>
	<div class="table-responsive">
		<table class="table table-bordered">
			<thead>
				<tr>
					<th>Subject language</th>
					<th>Language of instruction</th>
					<th>Version</th>
					<th>In production</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><?= ($course['language']) ?></td>
					<td><?= ($course['instruction_language']) ?></td>
					<td><?= ($course['version']) ?></td>
					<td>
						<?php if (!empty($course['in_production'])): ?>
							
								Yes
							
							<?php else: ?>
								No
							
						<?php endif; ?>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="btn-group">
		<button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
			Course menu
		</button>
		<ul class="dropdown-menu">
			<li 
				class="dropdown-item" 
				hx-get="<?= ($BASE) ?>/lessons/<?= ($course['id']) ?>"
				hx-target="main"
				hx-swap="outerHTML">
				Course lessons
			</li>	
			<li 
				class="dropdown-item" 
				hx-get="<?= ($BASE) ?>/editCourse/<?= ($course['id']) ?>"
				hx-target="main"
				hx-swap="outerHTML">
				Edit course details
			</li>
			<li><hr class="dropdown-divider"></li>
			<li 
				class="dropdown-item" 
				hx-get="<?= ($BASE) ?>/deleteCourse/<?= ($course['id']) ?>"
				hx-target="main"
				hx-swap="outerHTML">
				Delete course
			</li>
		</ul>
	</div>

<?php endforeach; ?>

</main>