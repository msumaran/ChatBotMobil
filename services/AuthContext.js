// AuthContext.js
import React from 'react';

// Crea un contexto con una función vacía por defecto (se sobrescribirá con la función real)
const AuthContext = React.createContext({
  onUserSignOut: () => {},
});

export default AuthContext;
