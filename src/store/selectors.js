import {createSelector} from "reselect";

const stateArticles = state => state.article.articles;
const stateSortBy = state => state.article.sortByValue;
const stateCategoryId = state => state.article.categoryId;
const stateTerm = state => state.article.term;
const stateFilteredArticles = state =>  state.article.filteredArticles ? state.article.filteredArticles : [];

// get home page articles with memoized way
// it is for check store before make an api call
export const selectHomePageArticles = createSelector(
    (state) => state.home.articles,
    (articles) => articles.filter((article) => article.markAsHome)
)

// selector is choosing state (full articles | filtered articles)
// cached|memoized
export const selectConditonalArticles = createSelector([
    stateArticles,
    stateFilteredArticles,
    stateSortBy,
    stateCategoryId,
    stateTerm
] , (articles ,filterArticles, sortBy, categoryId, term) => {
    if (!filterArticles.length && !categoryId && !term) {
        return articles;
    }
    return filterArticles;
})

// Todo use sortBy here if need
export const selectAllArticles = createSelector([stateArticles,stateSortBy], (articles, sortBy) => {
    return articles;
})
