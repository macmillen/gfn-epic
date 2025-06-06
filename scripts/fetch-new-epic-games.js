import { readJson, writeJson } from "./utils.js";

export const fetchNewEpicGames = async () => {
  const response = await fetch(
    encodeURI(
      "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US"
    ),
    {
      method: "GET",
    }
  );

  const data = await response.json();

  const elements = data.data.Catalog.searchStore.elements;

  const freeGames = elements
    .reduce((acc, { title, promotions }) => {
      if (!promotions) return acc;
      const currentOffer = promotions.promotionalOffers[0];
      const upcomingOffer = promotions.upcomingPromotionalOffers[0];

      if (currentOffer) {
        const offer = currentOffer.promotionalOffers[0];
        return [
          ...acc,
          { title, fromDate: offer.startDate, untilDate: offer.endDate },
        ];
      }
      if (upcomingOffer) {
        const offer = upcomingOffer.promotionalOffers[0];
        return [
          ...acc,
          { title, fromDate: offer.startDate, untilDate: offer.endDate },
        ];
      }
      return acc;
    }, [])
    .reverse();

  const dataObjects = readJson("../src/data/generated/data-objects.json");

  const lastDataObjects = dataObjects.slice(0, freeGames.length);

  let newFreeGamesToBeAdded = [];

  for (const freeGame of freeGames) {
    const dataObject = lastDataObjects.find((v) => v.title === freeGame.title);
    if (dataObject) {
      continue;
    } else {
      console.log(freeGame);
      newFreeGamesToBeAdded.push(freeGame);
    }
  }

  writeJson("../src/data/generated/data-objects.json", [
    ...newFreeGamesToBeAdded,
    ...dataObjects,
  ]);
};
