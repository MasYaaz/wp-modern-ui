<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faImages } from '@fortawesome/free-solid-svg-icons';
</script>

<!-- Tidak perlu editor, karena ini hanya dispatch event -->
<button
  type="button"
  class="rounded text-sm text-black hover:cursor-pointer hover:text-blue-600"
  aria-label="Featured Image"
  on:click={() => {
    const event = new CustomEvent('trigger-featured-image', {
      bubbles: true
    });
    dispatchEvent(event);
  }}
>
  <FontAwesomeIcon icon={faImages} class="text-base" />
</button>
