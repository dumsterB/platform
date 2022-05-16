export const state = () => ({
    preload_models: ["currency", "arbitrage_company", "wallet", "countries"],
    themes: ["Dark", "Light"],
    drawerMenu: false,
    base_p: "alfex",
    exchanges: [{
            name: "Forex",
            key: "FOREX",
            tv: "IDC",
            currency: "USD",
            list: [],
        },
        {
            name: "London Stock Exchange",
            key: "LSE",
            tv: "LSE",
            currency: "GBX",
            list: [],
        },
        {
            name: "US Stock Market",
            key: "US",
            tv: "NASDAQ",
            currency: "USD",
            list: [],
        },
        {
            name: "Francfurt Exchange",
            key: "F",
            tv: "XETR",
            currency: "EUR",
            list: [],
        },
        {
            name: "Xetra Exchange",
            key: "XETRA",
            tv: "NYSE",
            currency: "EUR",
            list: [],
        },
        {
            name: "Commodities",
            key: "COMM",
            tv: "NYSE",
            currency: "USD",
            list: [],
        },
        {
            name: "MICEX Moscow Russia",
            key: "MCX",
            tv: "CAPITALCOM",
            currency: "RUB",
            list: [],
        },
    ]
})

export const getters = {
    languages: state => {
        return state.languages;
    },
    themes: state => {
        return state.themes;
    },
    base_p: state => {
        return state.base_p;
    },
    drawerMenu: state => {
        return state.drawerMenu
    }
}

export const actions = {

}

export const mutations = {
    setDrawer(state) {
        state.drawerMenu = !state.drawerMenu
    }
}