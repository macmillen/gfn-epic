<script lang="ts">
  import type { FeedbackResponse, FeedbackSchema } from "../pages/feedback";
  import type { FeedbackType } from "../types";
  import FeedbackContainer from "./feedback-container.svelte";
  import FeedbackTitle from "./feedback-title.svelte";
  import IconAnimTick from "./icons/icon-anim-tick.svelte";
  import IconBack from "./icons/icon-back.svelte";

  export let state: Extract<FeedbackType, { stage: "write-text" }>;
  export let goBack: () => void;

  let feedbackText = "";
  let responseValue: FeedbackResponse | undefined;

  $: errorMessages = responseValue?.success
    ? null
    : responseValue?.error.issues.map(({ message }) => message);

  const onSubmit = async () => {
    if (state.stage !== "write-text") return;
    const response = await fetch("/feedback", {
      method: "POST",
      body: JSON.stringify({
        feedbackText,
        option: state.option,
      } satisfies FeedbackSchema),
      headers: { "Content-Type": "application/json" },
    });

    responseValue = (await response.json()) as FeedbackResponse;

    if (responseValue.success) {
      feedbackText = "";
    }
  };
</script>

<FeedbackContainer>
  <FeedbackTitle>
    <button on:click={goBack}>
      <IconBack class="w-7 h-7" />
    </button>
    {state.option}
  </FeedbackTitle>
  <div class="p-4 flex flex-col gap-4">
    <textarea
      class="w-full rounded-xl bg-zinc-800 block resize-none focus:outline-none p-3 focus:ring focus:ring-gray-600"
      rows="10"
      bind:value={feedbackText}
    />
    <button
      class="rounded-xl w-full font-bold justify-center flex items-center p-4 gap-2 enabled:hover:brightness-125 transition
            {responseValue?.success
        ? 'bg-zinc-800 text-green-600'
        : 'bg-green-600 text-white'}"
      disabled={responseValue?.success}
      on:click={onSubmit}
    >
      {#if responseValue?.success}
        <IconAnimTick />
        Feedback submitted
      {:else}
        Submit
      {/if}
    </button>

    {#each errorMessages ?? [] as errorMessage}
      <span class="text-red-500">
        {errorMessage}
      </span>
    {/each}
  </div>
</FeedbackContainer>
