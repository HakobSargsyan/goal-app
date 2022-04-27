import {
    SORT_ARTICLES,
    ADD_ARTICLE,
    SEARCH_ARTICLE,
    SEARCH_BY_CATEGORY,
    LOAD_ARTICLES,
    RESET_ARTICLE_DATA,
    LOAD_HOMEPAGE_ARTICLES,
    UPDATE_ARTICLE
} from "./types";

const actions = {
    ADD_ARTICLE: (payload) => {
        return { type: ADD_ARTICLE, payload }
    },
    SEARCH_ARTICLE: (payload) => {
        return { type: SEARCH_ARTICLE, payload }
    },
    LOAD_ARTICLES: (payload) => {
        return { type: LOAD_ARTICLES, payload }
    },
    SORT_ARTICLES: (payload) => {
        return { type: SORT_ARTICLES, payload }
    },
    SEARCH_BY_CATEGORY: (payload) => {
        return { type: SEARCH_BY_CATEGORY, payload }
    },
    RESET_ARTICLE_DATA:  (payload) => {
        return { type: RESET_ARTICLE_DATA, payload }
    },
    LOAD_HOMEPAGE_ARTICLES:  (payload) => {
        return { type: LOAD_HOMEPAGE_ARTICLES, payload }
    },
    UPDATE_ARTICLE:  (payload) => {
        return { type: UPDATE_ARTICLE, payload }
    },
}

export default actions;
