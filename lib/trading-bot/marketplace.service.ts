import {
  getMarketplaceBots,
} from "./marketplace.repository";


import type {
  MarketplaceServiceResult,
} from "./marketplace.types";


export async function getMarketplace():

Promise<MarketplaceServiceResult> {

  try {

    const bots =
      await getMarketplaceBots();


    return {
      data: {
        bots,
        total: bots.length,
      },

      error: null,
    };


  } catch(error) {


    return {
      data: null,

      error:
        error instanceof Error
          ? error.message
          : "Unable to load marketplace",
    };

  }
}