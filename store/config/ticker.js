import shortid from "shortid";
export const state = () => ({
  ticker: [
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: -10.8,
      priceChangePercent: -2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: -10.8,
      priceChangePercent: -2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: -10.8,
      priceChangePercent: -2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: -10.8,
      priceChangePercent: -2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: 10.8,
      priceChangePercent: 2.5,
    },
    {
      id: shortid.generate(),
      fromAsset: "EUR",
      toAsset: "USD",
      poolNmae: "EUR/USD",
      price: 1.18543,
      priceChange: -10.8,
      priceChangePercent: -2.5,
    },
  ],
});

export const getters = {
  getTickerData(state) {
    return state.ticker;
  },
};

export const actions = {};

export const mutations = {};
