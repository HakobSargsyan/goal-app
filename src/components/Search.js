import React, { useCallback} from 'react';
import TextField from "@mui/material/TextField";
import useThrottle from "../hooks/useThrottle";
import { THROTTLE_DELAY } from "../utils/Common";
import {useApplicationContext} from '../utils/Context';
const Search = ({searchCallback, placeholder}) => {
    const { setTerm,term } = useApplicationContext();
    // custom throttle hook , it will be called with delay
    const throttle = useThrottle((term) => searchCallback(term), THROTTLE_DELAY);
    // will be return same function instance
    const changeHandler = useCallback((event) => {
        setTerm(event.target.value);
        throttle(event.target.value);
    }, [throttle,setTerm])

    return (
        <>
            <TextField placeholder="Type for search user"
                   size="small"
                   id="outlined-search"
                   label={placeholder}
                   type="search"
                   value={term}
                   onChange={changeHandler}
            />
        </>
    );
}

export default Search;
