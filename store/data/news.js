export const state = () => ({
    news: [],
    total: 0,
    next: 0,
})

export const getters = {
    news: state => {
        return state.news;
    }
}

export const actions = {
    async fetchNews(context) {
        let response = await fetch("https://newsdata.io/api/1/news?apikey=pub_51822fc8b623a4b941303e2c5ba0e6d6d3d8&country=gb,us&language=en&q=cryptocurrency&category=top");
        let data = await response.json();
        console.log('NEWS', data);
        if (data && data.results) {
            context.commit('updateNews', data.results)
            context.commit('updateTotal', data.totalResults)
            context.commit('updateNext', data.nextPage)
        }

    }
}

export const mutations = {
    updateNews(state, payload) {
        payload.forEach((element, i) => {
            element.articleId = i;
        });
        state.news = payload;
    },
    updateTotal(state, payload) {
        state.total = payload;
    },
    updateNext(state, payload) {
        state.next = payload;
    }
}