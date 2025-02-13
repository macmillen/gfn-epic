<script lang="ts">
  import type { Card } from "../types";
  import { getSafeGameId } from "../utils/data";
  import HeroImage from "./hero-image.svelte";
  import IconNvidia from "./icons/icon-nvidia.svelte";

  export let data: Card[];
</script>

<div
  class="bg-transparent backdrop-blur-sm backdrop-brightness-100 mb-10"
  style="background-image: radial-gradient( rgba(0,0,0,0) 1px,black 1px ); background-size: 4px 4px;"
>
  <h2
    class="lg:text-5xl text-3xl font-black text-center pt-20 lg:leading-[4.3rem] px-5"
  >
    Free <span class="text-free-games">Epic Games</span>
    on <span class="text-gfn">GeforceNow</span>
  </h2>

  <div
    class="flex justify-center overflow-x-hidden relative h-[280px] lg:h-[610px]"
  >
    <div
      class="hero-image-container p-20 lg:px-20 px-5 lg:gap-16 gap-5 absolute inline-flex w-max"
    >
      {#each data
        ?.filter(({ data }) => data?.coverBig || data?.cover)
        .slice(0, 7) ?? [] as item}
        {@const { fromDate, title } = item}
        {@const { name, cover, coverBig } = item.data ?? {}}
        <HeroImage
          title={name ?? title}
          src={coverBig || cover}
          href={`#${getSafeGameId(title, fromDate)}`}
        />
      {/each}
    </div>
  </div>

  <p class="text-center sm:text-xl text-zinc-300 font-bold pb-20 px-3">
    Every Thursday, the Epic Games Store offers free games.
    <br />
    A <IconNvidia class="inline text-green-500 mx-1 w-7" /> symbol indicates GeForce
    Now availability.
  </p>

  <div class="flex gap-10 justify-center pb-20">
    <img src="/geforce-now-logo.svg" alt="" class="h-9" />
    <img src="/epic-games-logo.svg" alt="" class="h-9" />
  </div>
</div>

<style>
  .text-gfn,
  .text-free-games {
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: textShine 5s ease-in-out infinite alternate;
  }
  .text-gfn {
    background-image: linear-gradient(
      to right,
      #18be4a 20%,
      #5cfa00 30%,
      #19cd01 70%,
      #08752c 80%
    );
  }
  .text-free-games {
    background-image: linear-gradient(
      to right,
      #7953cd 20%,
      #00affa 30%,
      #0190cd 70%,
      #764ada 80%
    );
  }

  @keyframes textShine {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  @keyframes move {
    0% {
      left: 0;
    }
    100% {
      left: 100%;
      transform: translateX(-100%);
    }
  }

  .hero-image-container {
    animation: move 50s linear infinite alternate;
  }
</style>
