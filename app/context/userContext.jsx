import React, { createContext, useContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {

    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [favoriteSport, setFavoriteSport] = useState("");
  
  return (
    <UserContext.Provider value={{username, setUsername, age, setAge, favoriteSport, setFavoriteSport}}>
      {children}
    </UserContext.Provider>
  );
}