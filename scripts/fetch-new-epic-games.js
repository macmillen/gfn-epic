import { printSuccess, readJson, writeJson } from "./utils.js";

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

  const isFreeOffer = (offer) =>
    offer?.discountSetting?.discountType === "PERCENTAGE" &&
    offer?.discountSetting?.discountPercentage === 0;

  const detectedFreeGames = [];

  for (const el of elements) {
    if (!el.promotions || el.isCodeRedemptionOnly) continue;

    const currentOffers =
      el.promotions.promotionalOffers?.[0]?.promotionalOffers || [];
    const upcomingOffers =
      el.promotions.upcomingPromotionalOffers?.[0]?.promotionalOffers || [];

    const freeCurrent = currentOffers.find(isFreeOffer);
    const freeUpcoming = upcomingOffers.find(isFreeOffer);

    const offer = freeCurrent || freeUpcoming;
    if (offer) {
      detectedFreeGames.push({
        title: el.title,
        fromDate: offer.startDate,
        untilDate: offer.endDate,
        ...(el.description ? { description: el.description } : {}),
        ...(el.seller?.name ? { seller: el.seller.name } : {}),
        ...(el.productSlug || el.urlSlug ? { slug: el.productSlug || el.urlSlug } : {}),
      });
    }
  }

  const dataObjects = readJson("../src/data/generated/data-objects.json");

  let newFreeGamesToBeAdded = [];

  for (const freeGame of detectedFreeGames) {
    const alreadyExists = dataObjects.some(
      (v) =>
        v.title.toLowerCase() === freeGame.title.toLowerCase() &&
        v.fromDate === freeGame.fromDate
    );
    if (!alreadyExists) {
      console.log("New free game:", freeGame);
      newFreeGamesToBeAdded.push(freeGame);
    }
  }

  if (newFreeGamesToBeAdded.length === 0) {
    console.log("No new free games found.");
    return;
  }

  const updatedDataObjects = [...newFreeGamesToBeAdded, ...dataObjects].sort(
    (a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime()
  );

  writeJson("../src/data/generated/data-objects.json", updatedDataObjects);
  printSuccess(`added ${newFreeGamesToBeAdded.length} new free games`);
};
