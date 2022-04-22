let arr_to_str = (arr) => {
    let str_subscribes = "";
    arr.forEach((element, i) => {
        str_subscribes += `"${element}"`;
        if (i != arr.length - 1) {
            str_subscribes += ', ';
        }
    });
    return str_subscribes;
}

export const state = () => ({
    page_data: [],
    top_data: [],
    socket: null,
    interv: null,
    top_subscribes: [],
    str_top_subscribes: "",
    page_subscribes: [],
    str_page_subscribes: ""
});

export const getters = {
    page_data(state) {
        return state.page_data;
    },
    top_data(state) {
        return state.top_data;
    },
};

export const actions = {
    init({ commit, dispatch, state }) {
        dispatch('init_socket');
        if (state.interv) {
            clearInterval(state.interv);
        }
        commit('set_interv', setInterval(() => {
            if (state.socket.readyState !== state.socket.OPEN) {
                dispatch('init_socket');
            }
        }, 500));
    },
    init_socket({ commit, state }) {
        commit('set_socket');
        let intr = setInterval(() => {
            if (state.socket.readyState == state.socket.OPEN) {
                if (state.str_top_subscribes) {
                    state.socket.send(`{
                        "method": "subscribe",
                        "data": [${state.str_top_subscribes}]
                      }`);
                }
                if (state.str_page_subscribes) {
                    state.socket.send(`{
                        "method": "subscribe",
                        "data": [${state.str_page_subscribes}]
                      }`);
                }
                clearInterval(intr);
            }
        }, 100)
        state.socket.onmessage = (event) => {
            if (event.data) {
                let json_d = JSON.parse(event.data);
                let fnd = state.page_subscribes.find(el => el == json_d.method);
                if (fnd) {
                    commit('set_page_data', json_d);
                }
                fnd = state.top_subscribes.find(el => el.method == json_d.method);
                if (fnd) {
                    commit('set_top_data', json_d);
                }
            }
        };
    }
};

export const mutations = {
    set_socket(state) {
        state.socket = new WebSocket(this.$env("WS_SERVER_BASE"));
    },
    set_page_data(state, data) {
        state.page_data = data;
    },
    set_top_data(state, data) {
        state.top_data = data;
    },
    set_interv(state, data) {
        state.interv = data;
    },
    set_top_subscribe(state, subscribe) {
        state.top_subscribes = subscribe || [];
        state.str_top_subscribes = arr_to_str(state.top_subscribes);
        state.socket.send(`{
            "method": "subscribe",
            "data": [${state.str_top_subscribes}]
          }`);
    },
    add_page_subscribe(state, subscribe) {
        state.page_subscribes.push(subscribe);
        state.str_page_subscribes = arr_to_str(state.page_subscribes);
        state.socket.send(`{
            "method": "subscribe",
            "data": ["${subscribe}"]
          }`);
    },
    del_page_subscribe(state, subscribe) {
        let new_arr = state.page_subscribes.filter(el => el != subscribe);
        state.page_subscribes = new_arr;
        state.str_page_subscribes = arr_to_str(state.page_subscribes);
        state.socket.send(`{
            "method": "unsubscribe",
            "data": ["${subscribe}"]
          }`);
    },
    set_page_subscribe(state, subscribe) {
        state.page_subscribes = subscribe || [];
        state.str_page_subscribes = arr_to_str(state.page_subscribes);
        state.socket.send(`{
            "method": "subscribe",
            "data": [${state.str_page_subscribes}]
          }`);
    },
    unsubscribe_page(state) {
        state.socket.send(`{
            "method": "unsubscribe",
            "data": [${state.str_page_subscribes}]
          }`);
    }
};
