<div class="card mb-4">
	<div class="card-body">

		<check if="{{ !empty(@questions) }}">
			<div id="questionContainer{{ @question['id'] }}" class="row">
				<true>
					<div class="col-6 mb-3">
						<label class="form-label">
							Native Phrase
						</label>
						<p>{{ @question['native_phrase'] }}</p>
					</div>
					<div class="col-6 mb-3">
						<label class="form-label">
							Foreign Phrase
						</label>
						<p>{{ @question['foreign_phrase'] }}</p>
					</div>
					<hr>
					<div class="col-6 mb-3">
						<label class="form-label">
							Alternative native phrases
						</label>
						<p>{{ @@question['alternative_native_phrase_text'] | raw }}</p>
					</div>
					<div class="col-6 mb-3">
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
			<input type="hidden" name="question_id" value="{{ @@question['id'] }}">
			<div class="col-md-12 mb-3">
				<label 
					for="native_phrase{{ @@question['id'] }}" 
					class="form-label">
					Native Phrase
				</label>
				<input 
					class="form-control" 
					id="native_phrase{{ @@question['id'] }}" 
					name="native_phrase"
					value="{{ @@question['native_phrase'] }}" 
					required>
			</div>
			<div class="col-md-12 mb-3">
				<label 
					for="foreign_phrase{{ @@question['id'] }}" 
					class="form-label">
					Foreign Phrase
				</label>
				<input type="text" 
					class="form-control" 
					id="foreign_phrase{{ @@question['id'] }}" 
					name="foreign_phrase"
					value="{{@@question['foreign_phrase']}}" 
					required>
			</div>

			<div class="col-md-12 mb-3">
				<label 
					for="alternative_native_phrase{{ @@question['id'] }}" 
					class="form-label">
					Alternative native phrases
				</label>
				<textarea 
					class="form-control kuku-textarea-135" 
					name="alternative_native_phrase"
					id="alternative_native_phrase{{@@question['id']}}">{{@@question['alternative_native_phrase_textarea']}}</textarea>
			</div>
		
			<div class="col-md-12 mb-3">
				<label 
					for="alternative_foreign_phrase{{ @@question['id'] }}" 
					class="form-label">
					Alternative foreign phrases
				</label>
				<textarea 
					class="form-control kuku-textarea-135" 
					name="alternative_foreign_phrase"
					id="alternative_foreign_phrase{{@@question['id']}}">{{@@question['alternative_foreign_phrase_textarea']}}</textarea>
			</div>

			<button 
				type="button" 
				class="btn btn-primary mb-3"
				<check if="{{ empty(@questions) }}">
					<true>hx-post="{{ @BASE }}/saveQuestion"</true>
					<false>hx-post="{{ @BASE }}/updateQuestion"</false>
				</check>
				hx-target="main">
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
				hx-target="main">
				Delete
			</button>
		</check>

	</div>
</div>
