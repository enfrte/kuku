<main class="container">

<h2>Questions for</h2>
<h4 class="pt-5"><?= ($lesson['title']) ?></h4>

<button 
	type="button" 
	class="btn btn-primary mb-3"
	hx-get="<?= ($BASE) ?>/createQuestion/<?= ($lesson_id) ?>"
	hx-target="#newQuestion"
	hx-swap="innerHTML">
	Create new question
</button>

<div id="newQuestion"></div>

<?php if (empty($questions)): ?><h3 class="pt-5">No questions</h3><?php endif; ?>

<?php foreach (($questions?:[]) as $question): ?>
	
	<?php echo $this->render('views/components/admin/main/questions/question-creator-editor.php',NULL,get_defined_vars(),0); ?>

<?php endforeach; ?>

</main>