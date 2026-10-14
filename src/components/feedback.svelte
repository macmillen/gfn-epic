<script lang="ts">
  import { fade } from "svelte/transition";
  import type { FeedbackType } from "../types";
  import FeedbackChooseOption from "./feedback-choose-option.svelte";
  import FeedbackForm from "./feedback-form.svelte";
  import IconClose from "./icons/icon-close.svelte";
  import IconFeedback from "./icons/icon-feedback.svelte";

  let state: FeedbackType = { stage: "initial" };
</script>

{#if state.stage !== "initial"}
  <div
    class="fixed z-40 w-screen h-screen left-0 top-0 bg-black/40"
    transition:fade
  />
{/if}

<div class="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 flex flex-col items-end gap-3 z-50">
  {#if state.stage === "initial"}
    <button
      on:click={() => (state = { stage: "choose-option" })}
      class="bg-green-600 text-white rounded-full sm:rounded-xl flex items-center px-4 py-3 sm:p-4 gap-2 shadow-xl hover:brightness-125 transition text-sm sm:text-base font-medium"
    >
      <IconFeedback class="w-5 h-5 sm:w-7 sm:h-7" />
      <span>Feedback</span>
    </button>
  {:else if state.stage === "choose-option"}
    <FeedbackChooseOption bind:state />
  {:else}
    <FeedbackForm {state} goBack={() => (state = { stage: "choose-option" })} />
  {/if}
  {#if state.stage !== "initial"}
    <button
      on:click={() => (state = { stage: "initial" })}
      class="rounded-full w-16 h-16 bg-zinc-900 grid place-items-center text-zinc-300 hover:brightness-125"
    >
      <IconClose />
    </button>
  {/if}
</div>
