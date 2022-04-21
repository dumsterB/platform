export const state = () => ({
    page_data: [],
    top_data: [],
    socket: null,
    interv: null,
    top_subscribes: [],
    page_subscribes: []
});

export const getters = {
    getAllMenu(state) {
        return state.menu_items;
    },
};

export const actions = {
    init({ commit, state }, url) {
        commit('set_socket', url);
        if (state.interv) {
            clearInterval(state.interv);
        }
        state.interv = setInterval(() => {
            if (state.socket.readyState !== state.socket.OPEN) {
                commit('set_socket', url);
            }
        }, 1000);
    }
};

export const mutations = {
    set_socket(state, url) {
        state.socket = new WebSocket(url);
        state.socket.onmessage = (event) => {
            if (event.data) {
                let json_d = JSON.parse(event.data);
                let fnd = state.page_subscribes.find(el => el.method == json_d.method);
                if (fnd) {
                    state.page_data = json_d;
                }
                fnd = state.top_subscribes.find(el => el.method == json_d.method);
                if (fnd) {
                    state.top_data = json_d;
                }
            }
        };
    },
    set_subscribe(state, payload) {
        
    }
};
