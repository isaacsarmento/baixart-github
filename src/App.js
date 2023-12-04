// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import BottomNavBar from "./pages/BottomBar";
import Map from "./pages/Map";
import YouPage from "./pages/Voce";
import ProfilePage from "./pages/VoceLogado";
import { LoadScript } from "@react-google-maps/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [currentPage, setCurrentPage] = useState("mapa");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contentKey, setContentKey] = useState(Date.now());
  const [user, setUser] = useState(null);

  const handlePageChange = (page) => {
    if (page === "voce") {
      setCurrentPage(isLoggedIn ? "voceLogado" : "voce");
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsLoggedIn(!!currentUser);
      setUser(currentUser); 
      setContentKey(Date.now()); 
    });

    // Limpeza na desmontagem
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("currentPage:", currentPage);
  }, [currentPage]);

  let content;

  switch (currentPage) {
    case "mapa":
      content = <Map key={contentKey} />;
      break;
    case "voce":
      content = <YouPage key={contentKey} />;
      break;
    case "voceLogado":
      content = <ProfilePage key={contentKey} />;
      break;
    default:
      content = <Map key={contentKey} />;
  }

  return (
    <LoadScript
      googleMapsApiKey=""
      libraries={["places"]}
    >
      <div className="App">
        {content}
        <BottomNavBar
          onPageChange={handlePageChange}
          currentPage={currentPage}
          profilePic={user ? user.photoURL : null}
        />
      </div>
    </LoadScript>
  );
}

export default App;
