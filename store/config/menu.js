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
      icon: "mdi-wallet-outline",
      title: "my_wallet",
      key: "wallet",
      to: "/wallet",
      badge_color: "primary",
    },
    {
      icon: "mdi-wallet-travel",
      title: "trading",
      key: "trading",
      to: "/trading",
      badge_color: "primary",
    },
    {
      icon: "mdi-vector-polyline",
      title: "user_arbitrage",
      key: "arbitrage",
      to: "/arbitrage",
      badge_color: "primary",
    },
    // {
    //   icon: "mdi-web",
    //   title: "user_trading",
    //   key: "trading",
    //   to: "/trading",
    //   badge_color: "primary",
    // },
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
    {
      icon: "mdi-frequently-asked-questions",
      title: "popular_faq",
      key: "popular_faq",
      to: "/help",
      badge_color: "primary",
    },
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
