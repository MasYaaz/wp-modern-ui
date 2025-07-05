<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-svg-core/styles.css'; // <- penting untuk menghindari FOUC

	let { children } = $props();
</script>

{@render children()}
