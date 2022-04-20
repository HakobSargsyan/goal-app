import {createSelector} from "reselect";

const stateArticles = state => state.article.articles;
const stateSortBy = state => state.article.sortByValue;
const stateCategoryId = state => state.article.categoryId;
const stateTerm = state => state.article.term;
const stateFilteredArticles = state =>  state.article.filteredArticles ? state.article.filteredArticles : [];

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
