export const state = () => ({
  categories_items: [
    {
      icon: "mdi-folder-outline",
      title: "all_time",
      key: "all",
    },
    {
      icon: "mdi-folder-outline",
      title: "getting_started",
      key: "getting_started",
    },
    {
      icon: "mdi-folder-outline",
      title: "what_is_arbitrage",
      key: "what_is_arbitrage",
    },
    {
      icon: "mdi-folder-outline",
      title: "what_is_crypto",
      key: "what_is_crypto",
    },
    {
      icon: "mdi-folder-outline",
      title: "what_is_leverage",
      key: "what_is_leverage",
    },
    {
      icon: "mdi-folder-outline",
      title: "managing_my_account",
      key: "managing_my_account",
    },
    {
      icon: "mdi-folder-outline",
      title: "trading_and_funding",
      key: "trading_and_funding",
    },
    {
      icon: "mdi-folder-outline",
      title: "privacy_and_security",
      key: "privacy_and_security",
    },
    {
      icon: "mdi-folder-outline",
      title: "create_an_account",
      key: "create_an_account",
    },
  ],
});

export const getters = {
  getAllCategories(state) {
    return state.categories_items;
  },
};

export const actions = {};

export const mutations = {};
