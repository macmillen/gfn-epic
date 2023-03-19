<script lang="ts">
  export { classes as class };

  let classes = "";
</script>

<td
  class="first:rounded-l-xl overflow-hidden px-2 last:rounded-r-xl sm:text-base text-sm {classes}"
>
  <slot />
</td>
