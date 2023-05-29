<script lang="ts">
  import type { FeedbackType } from "../types";
  import FeedbackContainer from "./feedback-container.svelte";
  import FeedbackOption from "./feedback-option.svelte";
  import FeedbackTitle from "./feedback-title.svelte";
  import IconBug from "./icons/icon-bug.svelte";
  import IconFace from "./icons/icon-face.svelte";
  import IconFeedback from "./icons/icon-feedback.svelte";
  import IconIdea from "./icons/icon-idea.svelte";

  export let state: FeedbackType;
</script>

<FeedbackContainer>
  <FeedbackTitle>
    <IconFeedback class="w-5 h-5" /> Feedback
  </FeedbackTitle>

  <ul class="p-4 space-y-4">
    <FeedbackOption
      icon={IconFace}
      on:click={() => (state = { stage: "write-text", option: "General" })}
    >
      General
    </FeedbackOption>
    <FeedbackOption
      icon={IconIdea}
      on:click={() => (state = { stage: "write-text", option: "Idea" })}
    >
      Idea
    </FeedbackOption>
    <FeedbackOption
      icon={IconBug}
      on:click={() => (state = { stage: "write-text", option: "Issue" })}
    >
      Issue
    </FeedbackOption>
  </ul>
</FeedbackContainer>
