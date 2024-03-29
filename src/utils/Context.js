import React, {useState, useContext} from 'react';

const ApplicationContext = React.createContext();

export const useApplicationContext = () => {
    return useContext(ApplicationContext);
}
export const myFunction = () => {
    alert();
}
export const ApplicationProvider = ({children}) => {
    const [term, setTerm] = useState('');
    const [tabValue, setTabValue] = useState('/');
    const [open, setOpen] = useState(false);
    const state = {
        term,
        setTerm,
        tabValue,
        setTabValue,
        open,
        setOpen,
        myFunction
    }
   return (
       <ApplicationContext.Provider value={state}>
            {children}
        </ApplicationContext.Provider>
   );
}
