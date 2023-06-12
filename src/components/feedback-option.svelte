<script lang="ts">
  export let icon: any;
</script>

<li>
  <button
    on:click
    class="flex w-full items-center rounded-xl p-3 gap-3 transition hover:bg-zinc-700 bg-zinc-800 group font-medium"
  >
    <span class="group-hover:text-green-500 group-hover:scale-125 transition">
      <svelte:component this={icon} />
    </span>
    <slot />
  </button>
</li>
