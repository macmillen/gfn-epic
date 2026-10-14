const count = (c: number) => Math.floor(c).toString().padStart(2, "0");

let cachedUpcoming: HTMLElement[] | null = null;

export const resetCountdownCache = () => {
  cachedUpcoming = null;
};

export const countdown = () => {
  const now = Date.now();

  if (!cachedUpcoming) {
    cachedUpcoming = Array.from(
      document.querySelectorAll<HTMLElement>("tr[data-fromdate]")
    ).filter((node) => {
      const fromTime = new Date(node.dataset.fromdate || "").getTime();
      return now < fromTime;
    });
  }

  cachedUpcoming = cachedUpcoming.filter((item) => {
    const fromTime = new Date(item.dataset.fromdate || "").getTime();
    if (now >= fromTime) {
      item.classList.remove("free-soon");
      return false;
    }

    const totalSeconds = Math.round((fromTime - now) / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    item.classList.add("free-soon");
    const countdownElement = item.querySelector(".countdown");
    if (countdownElement) {
      countdownElement.textContent = `${count(days)}:${count(hours)}:${count(minutes)}:${count(seconds)}`;
    }
    return true;
  });
};
