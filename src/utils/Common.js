export const THROTTLE_DELAY = 500;
export const DEFAULT_PER_PAGE = 50;
export const TITLE = 'title';
export const INTRO = 'intro';
export const DATE = 'date';
export const SECONDS = 'seconds';
export const KEY = 'key';
export const MARKASHOME = 'markAsHome';
export const NEW_MODE = 'NEW';
export const EDIT_MODE = 'EDIT';
export const NONE = 'None';
export const ID = 'id';
export const CATEGORY = 'categoryId';
export const DESCRIPTION = 'description';
export const VALID = 'valid';

export const sortByValues = {
    1: TITLE,
    2: INTRO,
    3: DATE,
}

export const articleCategories = {
    1: 'News Article',
    2: 'Feature Article',
    3: 'Comment/Analysis',
    4: 'Auto News',
}

export const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}
// this is for validate article make modal box form inputs on change event
export const validateArticleMakerFieldsChange = (setFieldValidations, name, value) => {
    if (!value || value === '') {
        setFieldValidations((prevState) => {
                return {
                    ...prevState,
                    [name] : `${name.toUpperCase()} is required`,
                }
            }
        );
    } else {
        setFieldValidations({})
    }
}
// this is for validate article make modal box form on submit event
export const validateArticleMakerFieldsSubmit = (fields, setFieldValidations) => {
    let isValid = true;
    if (!fields[TITLE] || fields[TITLE] === '') {
        isValid = false;
        setFieldValidations((prevState) => {
                return {
                    ...prevState,
                    [TITLE] : `${TITLE.charAt(0).toUpperCase() + TITLE.slice(1)} is required`,
                }
            }
        );
    }
    if (!fields[INTRO] || fields[INTRO] === '') {
        isValid = false;
        setFieldValidations((prevState) => {
                return {
                    ...prevState,
                    [INTRO] : `${INTRO.charAt(0).toUpperCase() + INTRO.slice(1)} is required`,
                }
            }
        );
        isValid = false;
    }
    if (!fields[CATEGORY] || fields[CATEGORY] === '') {
        isValid = false;
        setFieldValidations((prevState) => {
                return {
                    ...prevState,
                    [CATEGORY] : `${CATEGORY.charAt(0).toUpperCase() + CATEGORY.slice(1)} is required`,
                }
            }
        );
        isValid = false;
    }

    return isValid
}

