<div class="card mb-4">
	<div class="card-body">

		<check if="{{ !empty(@questions) }}">
			<div id="questionContainer{{ @question['id'] }}">
				<true>
					<div class="col-md-6 mb-3">
						<label class="form-label">
							Native Phrase
						</label>
						<p>{{ @question['native_phrase'] }}</p>
					</div>
					<div class="col-md-6 mb-3">
						<label class="form-label">
							Foreign Phrase
						</label>
						<p>{{ @question['foreign_phrase'] }}</p>
					</div>
					<div class="col-md-6 mb-3">
						<label class="form-label">
							Alternative native phrases
						</label>
						<p>{{ @@question['alternative_native_phrase_text'] | raw }}</p>
					</div>
					<div class="col-md-6 mb-3">
						<label class="form-label">
							Alternative foreign phrases
						</label>
						<p>{{ @@question['alternative_foreign_phrase_text'] | raw }}</p>
					</div>
				</true>
			</div>
		</check>
		<form id="questionForm{{ @@question['id'] }}"
			<check if="{{ !empty(@questions) }}">
				<true>style="display:none;" id="question_container{{ @question['id'] }}"</true>
			</check>
			>
			<input type="hidden" name="lesson_id" value="{{ @lesson_id }}">
			<div class="col-md-12 mb-3">
				<label 
					for="native_phrase{{@@question['id']}}" 
					class="form-label">
					Native Phrase
				</label>
				<input 
					class="form-control" 
					id="native_phrase{{@@question['id']}}" 
					<check if="{{ empty(@questions) }}">
						<true>name="native_phrase"</true>
						<false>name="questions[{{@question['id']}}][native_phrase]"</false>
					</check>
					value="{{ @@question['native_phrase'] }}" 
					required>
			</div>
			<div class="col-md-12 mb-3">
				<label 
					for="foreign_phrase{{@@question['id']}}" 
					class="form-label">
					Foreign Phrase
				</label>
				<input type="text" 
					class="form-control" 
					id="foreign_phrase{{@@question['id']}}" 
					<check if="{{ empty(@questions) }}">
						<true>name="foreign_phrase"</true>
						<false>name="questions[{{@@question['id']}}][foreign_phrase]"</false>
					</check>
					value="{{@@question['foreign_phrase']}}" 
					required>
			</div>

			<div class="col-md-12 mb-3">
				<label 
					for="alternative_native_phrase{{@@question['id']}}" 
					class="form-label">
					Alternative native phrases
				</label>
				<textarea 
					class="form-control kuku-textarea-135" 
					<check if="{{ empty(@questions) }}">
						<true>name="alternative_native_phrase"</true>
						<false>name="questions[{{@@question['id']}}][alternative_native_phrase]"</false>
					</check>
					id="alternative_native_phrase{{@@question['id']}}">{{@@question['alternative_native_phrase_textarea']}}</textarea>
			</div>
		
			<div class="col-md-12 mb-3">
				<label 
					for="alternative_foreign_phrase{{@@question['id']}}" 
					class="form-label">
					Alternative foreign phrases
				</label>
				<textarea 
					class="form-control kuku-textarea-135" 
					<check if="{{ empty(@questions) }}">
						<true>name="alternative_foreign_phrase"</true>
						<false>name="questions[{{@@question['id']}}][alternative_foreign_phrase]"</false>
					</check>
					id="alternative_foreign_phrase{{@@question['id']}}">{{@@question['alternative_foreign_phrase_textarea']}}</textarea>
			</div>

			<button 
				type="button" 
				class="btn btn-primary mb-3"
				<check if="{{ empty(@questions) }}">
					<true>hx-post="{{ @BASE }}/saveQuestion"</true>
					<false>hx-post="{{ @BASE }}/updateQuestion"</false>
				</check>
				hx-target="main"
				hx-swap="outerHTML">
				Save
			</button>

		</form>

		<check if="{{ !empty(@questions) }}">
			<button 
				type="button" 
				data-edit-button="{{ @question['id'] }}"
				class="btn btn-light me-2 edit-button">
				Edit 
			</button>
		</check>

		<check if="{{ !empty(@questions) }}">
			<button 
				type="button" 
				class="btn btn-danger me-2"
				hx-delete="{{ @BASE }}/deleteQuestion/{{ @question['id'] }}/{{ @lesson_id }}"
				hx-target="main"
				hx-swap="outerHTML">
				Delete
			</button>
		</check>

	</div>
</div>
