<script lang="ts">
  import type { FeedbackType } from "../types";
  import FeedbackButton from "./feedback-button.svelte";
  import FeedbackChooseOption from "./feedback-choose-option.svelte";
  import FeedbackForm from "./feedback-form.svelte";
  import IconClose from "./icons/icon-close.svelte";
  import IconFeedback from "./icons/icon-feedback.svelte";

  let state: FeedbackType = { stage: "initial" };
</script>

<div class="fixed bottom-10 right-10 flex flex-col items-end gap-3">
  {#if state.stage === "initial"}
    <FeedbackButton on:click={() => (state = { stage: "choose-option" })}>
      <IconFeedback class="w-7 h-7" />
      Feedback
    </FeedbackButton>
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
