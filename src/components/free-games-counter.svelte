<script lang="ts">
  export let games: number;
</script>

<div
  class="inline-flex items-center gap-2.5 sm:text-lg text-sm font-bold bg-zinc-900/90 border border-zinc-700/60 grow-0 py-3.5 px-6 rounded-full shadow-md backdrop-blur-sm"
>
  <span class="relative flex h-2.5 w-2.5">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
  </span>
  <span>{games} free games</span>
</div>
