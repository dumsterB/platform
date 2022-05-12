export const state = () => ({
    binance: {}
})

export const getters = {
    binance_all: state => {
        return state.binance;
    },
    single: state => symbol => {
        let key = `binance:${symbol}-USD`;
        let fnd = state.binance[key];
        return fnd;
    }
}

export const actions = {
    async fetchBinance(context) {
        try {
            let resp = await this.$axios.get('/api/platform/metadata?data=binance');
            console.log('GRAPH RESP', resp);
            if (resp && resp.data && resp.data.data) {
                context.commit('updateBinance', resp.data.data);
            }
        } catch (e) { }

    }
}

export const mutations = {
    updateBinance(state, payload) {
        state.binance = payload;
    },
}