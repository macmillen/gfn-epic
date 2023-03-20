<script lang="ts">
  import { DateTime } from "luxon";
  import type { Card } from "../types";
  import IconEpicGames from "./icons/icon-epic-games.svelte";
  import IconNvidia from "./icons/icon-nvidia.svelte";
  import IconSteam from "./icons/icon-steam.svelte";
  import TCell from "./t-cell.svelte";

  export let data: Card[];
</script>

<div class="flex flex-col max-w-5xl mx-auto px-2 items-start">
  <table
    class="divide-y divide-gray-200 space-y-4 border-separate border-spacing-y-4 w-full"
  >
    <thead>
      <tr>
        <th />
        <th class="px-2 text-left">Release Date</th>
        <th class="px-2 text-left">Title</th>
        <th class="px-2">GFN</th>
        <th class="px-2 sm:table-cell hidden">Rating</th>
        <th class="px-2 sm:table-cell hidden">Links</th>
      </tr>
    </thead>
    <tbody>
      {#each data as { title, fromDate: _fromDate, untilDate: _untilDate, isGeforceNow, data: _data }}
        {@const { cover, rating, websites = [], genres } = _data ?? {}}

        {@const fromDate = DateTime.fromISO(_fromDate).toLocaleString(
          DateTime.DATE_MED
        )}
        {@const untilDate = DateTime.fromISO(_untilDate).toLocaleString(
          DateTime.DATE_MED
        )}
        <tr
          class="font-bold rounded-lg hover:bg-zinc-700 hover:ring-0 bg-gradient-to-r bg-zinc-700/50"
        >
          <TCell class="!p-0 w-0">
            <div
              class="sm:w-16 sm:h-24 w-10 h-14 bg-cover"
              style="background-image: url('{cover ??
                'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png'}');"
            />
          </TCell>
          <TCell
            class="text-zinc-300 whitespace-nowrap w-0 sm:text-base text-xs"
          >
            <div>
              {fromDate}
            </div>
            {#if fromDate !== untilDate}
              - {untilDate}
            {/if}
          </TCell>
          <TCell class="w-1/2 sm:text-base text-xs">
            <span>{title}</span>
            {#if genres?.length}
              <div
                class="sm:inline-flex hidden gap-2 ml-4 items-center whitespace-nowrap w-0"
              >
                {#each genres.slice(0, 2) as genre}
                  <div class="bg-zinc-800 rounded-full py-1 px-2 text-xs">
                    {genre}
                  </div>
                {/each}
              </div>
            {/if}
          </TCell>

          <TCell class="w-0 sm:rounded-none rounded-r-lg">
            {#if isGeforceNow}
              <div class="flex justify-center">
                <IconNvidia class="text-green-500 w-5 sm:w-7 mx-auto" />
              </div>
            {/if}
          </TCell>

          <TCell class="sm:table-cell hidden w-0">
            {#if rating}
              <div class="flex justify-center">
                <span class="bg-green-600 rounded-lg p-1.5 text-sm">
                  {Math.round(rating)}
                </span>
              </div>
            {/if}
          </TCell>

          <TCell class="sm:table-cell hidden w-0">
            <div class="flex gap-2 justify-center">
              {#each websites as { category, url }}
                {#if category === 13}
                  <a href={url} target="_blank">
                    <IconSteam class="hover:text-zinc-400 w-6" />
                  </a>
                {/if}
                {#if category === 16}
                  <a href={url} target="_blank">
                    <IconEpicGames class="hover:text-zinc-400 w-6" />
                  </a>
                {/if}
              {/each}
            </div>
          </TCell>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
