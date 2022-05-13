export const state = () => ({
    binance: {},
    addCounter: 0,
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
    },
    async fetchSingles(context, payload) {
        if (!context.state.addCounter) {
            let req_data = '';
            payload.forEach(element => {
                if (element.company != 'bybit' && element.company != 'binance') {
                    if (req_data) {
                        req_data += ',';
                    }
                    req_data += `${element.company}:${element.base}:USD`;
                }
            });
            try {
                let resp = await this.$axios.get(`/api/platform/metadata?data=${req_data}`);
                console.log('GRAPH SINGLES RESP', resp);
                if (resp && resp.data && resp.data.data) {
                    context.commit('addData', resp.data.data);
                }
            } catch (e) { }
        }
    }
}

export const mutations = {
    updateBinance(state, payload) {
        state.binance = payload;
    },
    addData(state, payload) {
        state.addCounter += 1;
        state.binance = state.binance.concat(payload);
    },
}