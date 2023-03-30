export const sortByRating = (reverse = false) => {
  const tbody = document.querySelector("tbody");

  if (reverse) {
    tbody?.replaceChildren(...globalThis.gameListElements);
    return;
  }

  const tableRowElements = Array.from(tbody?.querySelectorAll("tr") ?? []);
  globalThis.gameListElements = tableRowElements.reduce<HTMLTableRowElement[]>(
    (acc, tr) => {
      if (tr instanceof HTMLTableRowElement) return [...acc, tr];
      return acc;
    },
    []
  );

  tableRowElements.sort((a, b) => {
    const bRating = Number(b.querySelector(".rating")?.textContent);
    const aRating = Number(a.querySelector(".rating")?.textContent);

    if (Number.isNaN(bRating) && Number.isNaN(aRating)) return 0;
    if (Number.isNaN(bRating)) return -1;
    if (Number.isNaN(aRating)) return 1;

    return bRating - aRating;
  });

  tbody?.replaceChildren(...tableRowElements);
};
