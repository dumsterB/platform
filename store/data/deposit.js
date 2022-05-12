export const state = () => ({
  selections: [
    {
      title: "crypto",
      active: true,
      redirection: "Crypto",
      id: 1,
    },
    {
      title: "credit_debit",
      active: false,
      redirection: "CreditDebit",
      id: 2,
    },
    {
      title: "others",
      active: false,
      redirection: "Others",
      id: 3,
    },
  ],
  componentHandler: "Crypto",
});
export const getters = {
  selections(state) {
    return state.selections;
  },
  componentHandler(state) {
    return state.componentHandler;
  },
};
export const mutations = {
  changeActive(state, payload) {
    state.selections.forEach((ell) => (ell.active = false));
    let determinder = state.selections.find((ell) => ell.id === payload);
    determinder.active = true;
    state.componentHandler = determinder.redirection;
  },
};
