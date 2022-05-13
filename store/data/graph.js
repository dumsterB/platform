export const state = () => ({
    binance: {},
    addCounter: 0,
})

export const getters = {
    binance_all: state => {
        return state.binance;
    },
    single: state => symbol => {
        let key = `${symbol}-USD`;
        let fnd = state.binance[key];
        return fnd;
    }
}

export const actions = {
    async fetchBinance(context) {
        try {
            let resp = await this.$axios.post('/api/platform/metadata');
            // console.log('GRAPH RESP', resp);
            if (resp && resp.data && resp.data.data) {
                context.commit('updateBinance', resp.data.data);
            }
        } catch (e) { }
    },
    async fetchSingles(context, payload) {
        if (!context.state.addCounter) {
            context.commit('addCounter');
            let req_data = [];
            payload.forEach(element => {
                if (element.company != 'bybit' && element.company != 'binance') {
                    req_data.push(`${element.company}:${element.base}:USD`);
                }
            });
            try {
                let resp = await this.$axios.post(`/api/platform/metadata`, {
                    data: req_data
                });
                // console.log('GRAPH SINGLES RESP', resp);
                if (resp && resp.data && resp.data.data) {
                    context.commit('addData', resp.data.data);
                }
            } catch (e) { }
        }
    }
}

export const mutations = {
    updateBinance(state, payload) {
        for (let i in payload) {
            let ii = i.split(':');
            let d = ii[1];
            state.binance[d] = payload[i];
        }

    },
    addCounter(state) {
        state.addCounter += 1;
    },
    addData(state, payload) {
        for (let i in payload) {
            let ii = i.split(':');
            let d = ii[1];
            state.binance[d] = payload[i];
        }
        console.log('addData', state.binance)
    },
}