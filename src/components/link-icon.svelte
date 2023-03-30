<script lang="ts">
  export let icon: any;
  export let url: string | undefined;
  export { classes as class };

  let classes = "";
</script>

{#if url}
  <a href={url} target="_blank">
    <svelte:component
      this={icon}
      class="hover:brightness-110 sm:w-6 w-5 {classes}"
    />
  </a>
{:else}
  <svelte:component this={icon} class="text-zinc-500 sm:w-6 w-5" />
{/if}
