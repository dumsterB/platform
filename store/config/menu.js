export const state = () => ({
  menu_items: [
    {
      icon: "mdi-home-outline",
      title: "user_dashboard",
      key: "Main",
      to: "/account",
      badge_color: "primary",
    },
    {
      icon: "mdi-clipboard-text-multiple-outline",
      title: "user_news",
      key: "News",
      to: "/news",
      badge_color: "primary",
    },
    {
      icon: "mdi-chart-box-outline",
      title: "user_markets",
      key: "user_markets",
      to: "/markets",
      badge_color: "primary",
    },
    // {
    //   icon: "mdi-flag-outline",
    //   title: "user_help",
    //   key: "user_help",
    //   to: "/help",
    //   badge_color: "primary",
    // },
    // {
    //   icon: "mdi-comment-question-outline",
    //   title: "user_questions",
    //   key: "user_questions",
    //   to: "/questions",
    //   badge_color: "primary",
    // },
    {
      icon: "mdi-cog-outline",
      title: "user_settings",
      key: "Settings",
      to: "/settings",
      badge_color: "primary",
    },
    
  ],
});

export const getters = {
  getAllMenu(state) {
    return state.menu_items;
  },
};

export const actions = {};

export const mutations = {};
