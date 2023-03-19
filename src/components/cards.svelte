<script lang="ts">
  import { DateTime } from "luxon";
  import type { Card } from "../types";
  import IconEpicGames from "./icons/icon-epic-games.svelte";
  import IconGithub from "./icons/icon-github.svelte";
  import IconNvidia from "./icons/icon-nvidia.svelte";
  import IconSteam from "./icons/icon-steam.svelte";
  import Logo from "./logo.svelte";
  import TCell from "./t-cell.svelte";

  export let data: Card[];
</script>

<header class="h-20 bg-zinc-900 flex items-center px-10 fixed w-screen">
  <Logo />

  <div class="grow" />

  <a href="#" target="_blank">
    <IconGithub />
  </a>
</header>

<div class="h-20" />

<p
  class="text-center sm:m-10 mb-10 text-xl py-10 text-gray-400 sm:text-green-900 font-bold sm:rounded-2xl from-green-500/10 sm:from-slate-600 sm:to-green-400 sm:bg-gradient-to-r bg-gradient-to-b"
>
  This is a list of all free Epic games which are also available for GeforceNow.
</p>

<div class="flex flex-col max-w-5xl mx-auto px-2">
  <p class="mb-7 text-xl font-bold ml-10 sm:ml-0">{data.length} free games:</p>
  <table
    class="divide-y divide-gray-200 space-y-4 border-separate border-spacing-y-4"
  >
    <thead>
      <tr>
        <th />
        <th class="text-left">Release Date</th>
        <th class="text-left">Title</th>
        <th class="">GFN</th>
        <th class="sm:table-cell hidden">Rating</th>
        <th class="sm:table-cell hidden">Links</th>
      </tr>
    </thead>
    <tbody>
      {#each data as { title, date: { from, until }, isGeforceNow, data: { cover, rating, websites = [] } }}
        {@const fromDate = DateTime.fromISO(from)}
        {@const untilDate = DateTime.fromISO(until)}
        {@const isCurrentYearFrom = fromDate.year === DateTime.now().year}
        {@const isCurrentYearUntil = untilDate.year === DateTime.now().year}
        {@const fromLocalString = fromDate.toLocaleString({
          ...DateTime.DATE_MED,
          year: isCurrentYearFrom ? undefined : DateTime.DATE_MED.year,
        })}
        {@const untilLocalString = untilDate.toLocaleString({
          ...DateTime.DATE_MED,
          year: isCurrentYearUntil ? undefined : DateTime.DATE_MED.year,
        })}
        <tr
          on:click={() => {
            navigator.clipboard.writeText(title);
          }}
          class="font-bold rounded-lg hover:bg-zinc-600 bg-gradient-to-r from-zinc-700 to-green-500/10 cursor-pointer"
        >
          <TCell class="!p-0 sm:w-20 w-12">
            <img src={cover} alt="" />
          </TCell>
          <TCell
            class="text-zinc-300 whitespace-nowrap w-0 sm:text-base text-xs"
            >{fromLocalString} - {untilLocalString}</TCell
          >
          <TCell class="w-1/2 sm:text-base text-xs">
            <span>{title}</span>
          </TCell>

          <TCell class="w-0">
            {#if isGeforceNow}
              <IconNvidia class="sm:mr-5 text-green-500 w-5 sm:w-10 mx-auto" />
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
                    <IconSteam class="hover:text-zinc-400" />
                  </a>
                {/if}
                {#if category === 16}
                  <a href={url} target="_blank">
                    <IconEpicGames class="hover:text-zinc-400" />
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

<footer class="bg-zinc-900 mt-40 px-24 py-12 font-bold sm:flex items-center">
  <Logo />
  <p class="sm:ml-20 text-zinc-400">Made by macmillen</p>
</footer>
