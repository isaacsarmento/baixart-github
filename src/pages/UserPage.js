// UserPage.js
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import YouPage from "./Voce";
import ProfilePage from "./VoceLogado";

function UserPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    // Limpeza na desmontagem
    return () => unsubscribe();
  }, []);

  return isLoggedIn ? <ProfilePage /> : <YouPage />;
}

export default UserPage;
