<script lang="ts">
  import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

  export let onSave: () => void;
</script>

<button
  on:click={onSave}
  aria-label="Save"
  class="rounded hover:text-blue-500"
>
  <FontAwesomeIcon icon={faFloppyDisk} class="text-base" />
</button>
