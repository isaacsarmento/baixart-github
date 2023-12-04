import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import { toast, Toaster } from "react-hot-toast";

const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function YouPage() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        toast("Você se cadastrou!");
      })
      .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginContainer}>
        <h2 style={styles.title}>Cadastre-se</h2>
        <button onClick={signInWithGoogle} style={styles.googleButton}>
          <GoogleIcon style={styles.googleLogo} />
          Entrar com o Google
        </button>
        {/*<img src={logo} alt="Logo" style={styles.logo} />*/}
      </div>
      <Toaster />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  logo: {
    marginBottom: "0px",
    flex: "1 0 200px",
    maxWidth: "300px",
  },
  title: {
    marginBottom: "10px",
  },
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "35px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
    padding: "20px",
    flex: "1 0 200px",
    maxWidth: "350px",
    height: "150px",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#4285F4",
    color: "white",
    width: "100%",
    border: "none",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  googleLogo: {
    marginRight: "10px",
  },
};

export default YouPage;
