<script lang="ts">
  import { DateTime } from "luxon";
  import type { Card } from "../types";
  import IconEpicGames from "./icons/icon-epic-games.svelte";
  import IconGamepad from "./icons/icon-gamepad.svelte";
  import IconNvidia from "./icons/icon-nvidia.svelte";
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
        <th class="px-2 text-left">
          <span class="pr-3">Release</span>
        </th>
        <th class="px-2 text-left">
          <span class="sm:pr-5">Title</span>
        </th>
        <th class="px-2">
          <span class="sm:pr-5">Info</span>
        </th>
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
        {@const epicWebsite = websites.find((v) => v.category === 16)}
        <tr
          class="font-bold hover:bg-green-500/10 hover:ring-0 bg-gradient-to-r bg-zinc-700/50 group"
          data-fromdate={_fromDate}
        >
          <TCell class="!p-0 w-0">
            <div class="sm:w-16 sm:h-24 w-10 h-14">
              {#if cover}
                <img
                  alt=""
                  src={cover ??
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png"}
                  class="h-full object-cover block"
                />
              {:else}
                <div
                  class="w-full h-full bg-zinc-600/40 flex items-center justify-center"
                >
                  <IconGamepad
                    class="w-12 h-12 text-zinc-500 -rotate-6 scale-[1.7]"
                  />
                </div>
              {/if}
            </div>
          </TCell>
          <TCell
            class="text-zinc-300 whitespace-nowrap w-0 sm:text-base text-xs pl-5"
          >
            <div>
              {fromDate}
            </div>
            {#if fromDate !== untilDate}
              - {untilDate}
            {/if}
            <div class="countdown text-red-500" />
          </TCell>
          <TCell class="sm:text-base text-xs w-full">
            <span
              class="group-hover:text-green-400 transition duration-300 sm:ml-5"
              >{title}</span
            >
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
            <div class="flex justify-end gap-2 items-center sm:mr-5">
              <div class="flex justify-center">
                <span
                  class="{rating
                    ? 'bg-green-500 text-zinc-800'
                    : 'bg-zinc-500'} rounded-full sm:w-6 sm:h-6 w-5 h-5 flex justify-center items-center text-xs"
                >
                  {#if rating}
                    {Math.round(rating)}
                  {:else}
                    -
                  {/if}
                </span>
              </div>

              <a
                href={epicWebsite?.url}
                target="_blank"
                class:pointer-events-none={!epicWebsite}
                class:text-zinc-500={!epicWebsite}
              >
                <IconEpicGames class="hover:text-zinc-400 sm:w-6 w-5" />
              </a>
              <IconNvidia
                class="{isGeforceNow
                  ? 'text-green-500'
                  : 'text-zinc-500'} w-5 sm:w-6"
              />
            </div>
          </TCell>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
