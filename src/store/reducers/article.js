import {
    ADD_ARTICLE,
    LOAD_ARTICLES,
    SEARCH_ARTICLE,
    SORT_ARTICLES,
    SEARCH_BY_CATEGORY,
    RESET_ARTICLE_DATA
} from "../types";
const initialState = {
    articles: [],
    filteredArticles: [],
    term: '',
    sortBy: 'title',
}
const sortByKey = key => (a, b) => a[key] < b[key] ? 1 : -1
const article = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ARTICLE:
                return Object.assign({}, state, {
                    articles: state.articles.concat(action.payload).sort(sortByKey('title')),
                    filteredArticles: []
                });
        case LOAD_ARTICLES:
            return Object.assign({}, state, {
                articles: state.articles.concat(action.payload.articles).sort(sortByKey('title')),
                filteredArticles: []
            });
        case RESET_ARTICLE_DATA:
            return {
                ...state,
                articles: initialState.articles
            }
        case SORT_ARTICLES:
                return {
                    ...state,
                    filteredArticles: state.articles.slice().sort((a,b) => (a[action.payload.sortByValue] > b[action.payload.sortByValue]) ? 1 :
                        ((b[action.payload.sortByValue] > a[action.payload.sortByValue]) ? -1 : 0)
                    ),
                    sortByValue: action.payload.sortByValue,
                }
        case SEARCH_ARTICLE:
            return {
                ...state,
                filteredArticles: state.articles.slice().filter(article =>
                    article.title
                        .toLowerCase()
                        .includes(action.payload.term.toLowerCase())
                ),
                categoryId: action.payload.categoryId,
                term: action.payload.term
            }
        case SEARCH_BY_CATEGORY:
            return {
                ...state,
                filteredArticles: action.payload.categoryId !== " " ?
                    state.articles.slice().filter(article => Number(article.categoryId) === Number(action.payload.categoryId)) :
                    state.articles,
                categoryId: action.payload.categoryId,
            }
        default:
            // console.log("out of action");
    }
    return state
}

export default article;
