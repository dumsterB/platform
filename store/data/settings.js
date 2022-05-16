export const state = () => ({
  selections: [
    {
      title: "account_settings",
      text: "personal_information",
      active: true,
      redirection: "PrivateInformation",
      id: 1,
    },
    {
      title: "security",
      text: "password_and_2mfa",
      active: false,
      redirection: "Security",
      id: 2,
    },
    {
      title: "identity_verification",
      text: "unverified",
      active: false,
      redirection: "Verification",
      id: 3,
    },
  ],
  componentHandler: "PrivateInformation",
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
