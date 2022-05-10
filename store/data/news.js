export const state = () => ({
    news: [],
    total: 0,
})

export const getters = {
    news: state => {
        return state.news;
    },
    article: state => id => {
        let fnd = state.news.find(el => el.articleId == id);
        return fnd;
    }
}

export const actions = {
    async fetchNews(context) {
        let response = await fetch("https://gnews.io/api/v4/search?q=crypto&lang=en&token=b744bb96e141e787268e64f4252b3bbc");
        let data = await response.json();
        console.log('NEWS', data);
        if (data && data.articles) {
            context.commit('updateNews', data.articles)
            context.commit('updateTotal', data.totalArticles)
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