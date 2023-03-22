<main class="container">


<button 
	type="button" 
	class="btn btn-primary"
	hx-get="<?= ($BASE) ?>/createLesson/<?= ($course_id) ?>"
	hx-target="main"
	hx-swap="outerHTML">
	Create new lesson
</button>

<h2 class="pt-5"><?= ($course['title']) ?></h2>

<?php foreach (($lessons?:[]) as $lesson): ?>
    <h3 class="pt-3"><?= ($lesson['title']) ?></h3>
	<p><?= ($lesson['tutorial']) ?></p>
	<div class="table-responsive">
		<table class="table table-bordered">
			<thead>
				<tr>
					<th>Level</th>
					<th>In production</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><?= ($lesson['level']) ?></td>
					<td>
						<?php if (!empty($lesson['in_production'])): ?>
							
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
			Lesson menu
		</button>
		<ul class="dropdown-menu">
			<li 
				class="dropdown-item" 
				hx-get="<?= ($BASE) ?>/questions/<?= ($lesson['id']) ?>"
				hx-target="main"
				hx-swap="outerHTML">
				Add sentences
			</li>	
			<li 
				class="dropdown-item" 
				hx-get="<?= ($BASE) ?>/updateLesson/<?= ($lesson['id']) ?>"
				hx-target="main"
				hx-swap="outerHTML">
				Edit lesson details
			</li>
			<li><hr class="dropdown-divider"></li>
			<li 
				class="dropdown-item" 
				hx-get="<?= ($BASE) ?>/deleteLesson/<?= ($lesson['id']) ?>"
				hx-vals='{ "course_id": <?= ($course_id) ?> }'
				hx-target="main"
				hx-swap="outerHTML">
				Delete lesson
			</li>
		</ul>
	</div>

<?php endforeach; ?>

</main>