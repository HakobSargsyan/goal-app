import axios from 'axios';

const obj = {
    // fetch all repositores list
    getRepositories: (page,perpage, term) => {
        return axios.get(`https://api.github.com/search/repositories?q=${term}&page=${page}&per_page=${perpage}`);
    }
}

export default obj;
