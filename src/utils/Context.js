import React, {useState, useContext} from 'react';

const ApplicationContext = React.createContext();

export const useApplicationContext = () => {
    return useContext(ApplicationContext);
}

export const ApplicationProvider = ({children}) => {
    const [term, setTerm] = useState('');
    const [tabValue, setTabValue] = useState('/');
    const state = {
        term,
        setTerm,
        tabValue,
        setTabValue
    }
   return (
       <ApplicationContext.Provider value={state}>
            {children}
        </ApplicationContext.Provider>
   );
}
