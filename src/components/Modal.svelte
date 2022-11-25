<div class="modal">
	<div class="content">
		<slot />
	</div>
</div>

<style>
	.modal {
		position: absolute;
		background-color: grey;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
	}
	.content {
		position: relative;
		width: 70%;
		height: 70%;
		background-color: aliceblue;
		padding: 2rem;
		border-radius: 0.5rem;
	}
	@media only screen and (max-width: 920px) {
		.content {
			width: 95%;
		}
	}
</style>
