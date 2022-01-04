import React, { useCallback, useEffect} from 'react';
import TextField from "@mui/material/TextField";
import useThrottle from "../hooks/useThrottle";
import { THROTTLE_DELAY } from "../utils/Common";
import {useApplicationContext} from '../utils/Context';
const Search = ({searchCallback, placeholder}) => {
    const ref = React.useRef(null);
    const { setTerm,term } = useApplicationContext();
    // custom throttle hook , it will be called with delay
    const throttle = useThrottle((term) => searchCallback(term), THROTTLE_DELAY);
    // will be return same function instance
    const changeHandler = useCallback((event) => {
        setTerm(event.target.value);
        throttle(event.target.value);
    }, [throttle,setTerm])

    useEffect(() => {
        ref.current.focus();
    }, [])
    return (
        <>
            <TextField placeholder="Type for search user"
                   size="small"
                   id="outlined-search"
                   label={placeholder}
                   type="search"
                   value={term}
                   inputRef={ref}
                   onChange={changeHandler}
            />
        </>
    );
}

export default Search;
