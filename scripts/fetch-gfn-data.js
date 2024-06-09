import { printSuccess, writeJson } from "./utils.js";

export const fetchGfnData = async () => {
  const items = [];

  let hasNextPage = true;
  let after = "";

  while (hasNextPage) {
    const query = `{
  apps(vpcId: "NP-FRK-06", language: "en_US", after: "${after}" ) {
    numberReturned
    pageInfo{
      hasNextPage
      endCursor
    }
    items {
      appStore
      contentRatings {
        categoryKey
        type
      }
      genres
      id
      images {
        GAME_BOX_ART
        HERO_IMAGE
        KEY_ART
        TV_BANNER
      }
      computedValues {
        allKeywords
      }
      maxLocalPlayers
      supportedControls
      publisherName
      sortName
      title
      variants {
        appStore
        id
        publisherName
        supportedControls
        shortName
        storeUrl
        gfn {
          isInLibrary
          releaseDate
          status
          features {
            ...feature
          }
        }
      }
    }
  }
}

fragment feature on GfnSubscriptionFeature {
  __typename
  ... on GfnSubscriptionFeatureValue {
    key
    value
  }
  ... on GfnSubscriptionFeatureValueList {
    key
    values
  }
}`;
    const response = await fetch(
      encodeURI(
        `https://games.geforce.com/graphql?requestType=apps&huId=45004b62e3c051bcad7d748305c9f16416a89907&query=${query}`
      ),
      {
        headers: {
          "nv-browser-type": "BRAVE",
          "nv-client-id": "ec7e38d4-03af-4b58-b131-cfb0495903ab",
          "nv-client-streamer": "WEBRTC",
          "nv-client-type": "BROWSER",
          "nv-client-version": "2.0.49.115",
          "nv-device-os": "LINUX",
          "nv-device-type": "DESKTOP",
        },
        referrerPolicy: "same-origin",
        body: null,
        method: "GET",
      }
    );

    const data = (await response.json()).data;

    hasNextPage = data.apps.pageInfo.hasNextPage;
    after = data.apps.pageInfo.endCursor ?? "";
    items.push(...data.apps.items);
  }

  writeJson("../src/data/generated/gfn-data.json", items);
  printSuccess("fetch gfn data");
};
