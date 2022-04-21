import {
    LOAD_HOMEPAGE_ARTICLES, RESET_ARTICLE_DATA
} from "../types";
const initialState = {
    articles: [],
}

const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1
const home = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_HOMEPAGE_ARTICLES:
            return Object.assign({}, state, {
                articles: state.articles.concat(action.payload.articles).sort(sortByKey('Date')),
            });
        case RESET_ARTICLE_DATA:
            return {
                ...state,
                articles: initialState.articles
            }
        default:
        // console.log("out of action");
    }
    return state
}

export default home;
