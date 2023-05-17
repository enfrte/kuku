<main class="container">
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-6">
				<div class="card">
					<div class="card-header">Backup</div>
					
					<div class="card-body">
						<form method="POST" action="{{ @BASE }}/backup">
							<input type="hidden" name="backup" value="1">
							<div class="mb-3">
							<label class="form-label">Backup SQLite with today's date</label>
								<button 
									type="submit" 
									class="btn btn-primary">
									Make backup
								</button>
							</div>
							
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

</main>