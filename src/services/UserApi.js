import axios from 'axios';

const obj = {
    // fetch all users from the github api
    getUsers: (page, perpage) => {
        return axios.get(`https://api.github.com/users?since=${page}&per_page=${perpage}`);
    },
    // fetch user by term condition
    getUsersByTerm: (term, page, perpage) => {
        if (term.length) {
            return axios.get(`https://api.github.com/search/users?q=${term}&page=${page}&per_page=${perpage}`);
        }
    },
    // fetch user repos
    getUserRepos: (url, page, perpage) => {
        return axios.get(`${url}?page=${page}&per_page=${perpage}`);
    },
    // fetch user by username
    getUserByUsername: (username) => {
        return axios.get(`https://api.github.com/users/${username}`);
    }
}

export default obj;
