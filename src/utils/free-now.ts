export const freeNow = () => {
  const items = Array.from(document.querySelectorAll("tr")).filter((node) => {
    const now = Date.now();
    const { fromdate = "", untildate = "" } = node.dataset;
    const fromTime = new Date(fromdate).getTime();
    const untilTime = new Date(untildate).getTime();
    return now > fromTime && now < untilTime;
  });
  items.forEach(async (item) => {
    const countdownElement = item.querySelector(".countdown");

    if (countdownElement) {
      countdownElement.textContent = "Free now";
      countdownElement.classList.add("!text-green-500");
    }
  });
};
