export const hideDuplicates = (checked: boolean) => {
  const tbody = document.querySelector("tbody");
  const tableRowElements = Array.from(tbody?.querySelectorAll("tr") ?? []);

  const gameidMap: Record<string, 1> = {};

  tableRowElements.forEach((tr) => {
    const gameid = tr.dataset["gameid"];
    if (!gameid) return;

    if (checked) {
      if (gameidMap[gameid]) {
        tr.classList.add("hide-dupe");
        console.log("hide");
      } else {
        gameidMap[gameid] = 1;
      }
    } else {
      tr.classList.remove("hide-dupe");
    }
  });
};
