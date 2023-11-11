const count = (c: number) => Math.floor(c).toString().padStart(2, "0");

export const countdown = () => {
  const items = Array.from(document.querySelectorAll("tr")).filter((node) => {
    const now = Date.now();
    const { fromdate = "" } = node.dataset;
    const fromTime = new Date(fromdate).getTime();
    return now < fromTime;
  });
  items.forEach(async (item) => {
    const { fromdate = "" } = item.dataset;
    const fromTime = new Date(fromdate).getTime();
    const now = Date.now();

    if (now < fromTime) {
      const totalSeconds = Math.round((fromTime - now) / 1000);

      const days = Math.floor(totalSeconds / 60 / 60 / 24);
      const hours = Math.floor((totalSeconds - days * 60 * 60 * 24) / 60 / 60);
      const minutes = Math.floor(
        (totalSeconds - days * 60 * 60 * 24 - hours * 60 * 60) / 60
      );
      const seconds = Math.floor(
        totalSeconds - days * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60
      );

      const daysStr = count(days);
      const hoursStr = count(hours);
      const minutesStr = count(minutes);
      const secondsStr = count(seconds);

      const countdownElement = item.querySelector(".countdown");

      item.classList.add("free-soon");

      if (countdownElement) {
        countdownElement.textContent = `${daysStr}:${hoursStr}:${minutesStr}:${secondsStr}`;
      }
    }
  });
};
