<select 
	name="{{ @type }}" 
	class="form-select form-control" 
	aria-label="Default select example">
	<option value>Select a language</option>
	<check if="{{ !empty(@languages) }}">
		<true>
			<repeat group="{{ @languages }}" key="{{ @iso }}" value="{{ @language }}">
				<option value="{{ @iso }}">{{ @language }}</option>
			</repeat>
		</true>
		<false>
			<option value="">No results</option>
		</false>
	</check>
</select>
