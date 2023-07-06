<script lang="ts">
  import type { Action } from "svelte/action";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import type { Card } from "../types";
  import { getSafeGameId } from "../utils/data";
  import HeroImage from "./hero-image.svelte";
  import IconNvidia from "./icons/icon-nvidia.svelte";

  export let data: Card[];

  const pixel = tweened(0, { duration: 400, easing: cubicOut });

  const heroImageMover: Action = (element) => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.body.clientWidth > element.scrollWidth) {
        element.style.justifyContent = "center";
        return;
      }
      const { clientX } = e;
      const { scrollWidth } = element;
      const { clientWidth } = document.body;
      const maxMovablePx = scrollWidth - clientWidth;
      pixel.set(maxMovablePx * (clientX / clientWidth));
    };
    element.addEventListener("mousemove", onMouseMove);
  };
</script>

<div
  class="bg-transparent backdrop-blur-sm backdrop-brightness-100 mb-10"
  style="background-image: radial-gradient( rgba(0,0,0,0) 1px,black 1px ); background-size: 4px 4px;"
>
  <h2
    class="lg:text-5xl text-3xl font-black text-center pt-20 lg:leading-[4.3rem] px-5"
  >
    Hundres of <span class="text-free-games">free games</span> waiting to be
    played on <span class="text-gfn">GeforceNow</span>
  </h2>

  <div class="flex justify-center">
    <div
      class="py-20 gap-10 inline-flex relative"
      use:heroImageMover
      style="left: -{$pixel}px;"
    >
      {#each data?.slice(0, 7) ?? [] as item}
        {@const { fromDate, title } = item}
        {@const { name, cover, coverBig } = item.data ?? {}}
        <HeroImage
          title={name}
          src={coverBig || cover}
          href={`#${getSafeGameId(title, fromDate)}`}
        />
      {/each}
    </div>
  </div>

  <p class="text-center sm:text-xl text-zinc-300 font-bold pb-20 px-3">
    This is a list of all free games which come out every Thursday in the Epic
    Games Store. <br />
    The <IconNvidia class="inline text-green-500 mx-1 w-7" /> symbol shows if the
    game is available for GeforceNow.
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
</style>
