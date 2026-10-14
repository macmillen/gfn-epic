let cachedActive: HTMLElement[] | null = null;

export const resetFreeNowCache = () => {
  cachedActive = null;
};

export const freeNow = () => {
  const now = Date.now();

  if (!cachedActive) {
    cachedActive = Array.from(
      document.querySelectorAll<HTMLElement>("tr[data-fromdate]")
    ).filter((node) => {
      const fromTime = new Date(node.dataset.fromdate || "").getTime();
      const untilTime = new Date(node.dataset.untildate || "").getTime();
      return now >= fromTime && now < untilTime;
    });
  }

  cachedActive = cachedActive.filter((item) => {
    const untilTime = new Date(item.dataset.untildate || "").getTime();
    if (now >= untilTime) {
      item.classList.remove("free-now");
      return false;
    }

    item.classList.add("free-now");
    const countdownElement = item.querySelector(".countdown");
    if (countdownElement && countdownElement.textContent !== "Free now") {
      countdownElement.textContent = "Free now";
      countdownElement.classList.add("!text-green-500");
    }
    return true;
  });
};
