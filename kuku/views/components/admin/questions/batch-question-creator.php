<form>
	<input type="hidden" name="lesson_id" value="{{ @@lesson_id }}">

	<div class="mb-3">
		<label for="batchQuestions" class="form-label">Add batch sentences:</label>
		<p>
			It should look something like this
			<br>
<pre>"Hän puhuu suomea hyvin","He speaks Finnish well"
"Teidän täytyy puhua hiljempaa.","You need to speak more quietly."</pre>
		</p>
		<textarea style="height:444px" id="batchQuestions" name="batchQuestions" class="form-control" maxlength="99999"></textarea>
	</div>

	<div class="mb-3">
		<button 
			type="submit" 
			class="btn btn-primary" 
			hx-post="{{ @BASE }}/saveBatchQuestions"
			hx-target="main">
			Save
		</button>
	</div>
</form>
