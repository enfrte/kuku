<check if="{{ !empty($_SESSION['user']['admin']) }}">
	<true>
		<h2 class="pt-5 pb-3">Welcome admin</h2>
		<p>Use the menu to view courses to edit, or create a new course.</p>
		<p>When you logout, you can try out the courses as a student.</p>
	</true>
	<false>
		<h2>Error.</h2>
	</false>
</check>
