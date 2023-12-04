import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  pegarMarcadores,
  excluirMarcador,
  pegarMarcadoresPorUsuario,
} from "./FirebaseDb";
import YouPage from "./Voce";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [marcadores, setMarcadores] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Chama a função passando o userID do usuário logado
        pegarMarcadoresPorUsuario(currentUser.uid, setMarcadores);
      }
    });

    if (user) {
      pegarMarcadores(setMarcadores);
    }
  }, [user]);

  if (!user) {
    return <YouPage />;
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Usuário deslogado");
      })
      .catch((error) => {
        console.error("Erro ao deslogar: ", error);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <img
          src={user.photoURL}
          alt={user.displayName}
          style={styles.profileImage}
        />
        <h2>{user.displayName}</h2>
        <Button variant="contained" color="secondary" onClick={handleSignOut}>
          Sair
        </Button>
      </div>
      <div style={styles.marcadoresContainer}>
        <h2>Meus Marcadores</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo de Arte</TableCell>
                <TableCell>Comentário</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marcadores.map((marcador, index) => (
                <TableRow key={index} style={{ backgroundColor: "#FBF1DF" }}>
                  <TableCell>{marcador.tipo_arte}</TableCell>
                  <TableCell>{marcador.comentario}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      style={{ transition: "all 0.3s" }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "red";
                        e.currentTarget.style.transform = "scale(1.2)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "";
                        e.currentTarget.style.transform = "";
                      }}
                      onClick={() => excluirMarcador(marcador.key)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
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
    flexDirection: "row-reverse",
    flexWrap: "wrap",
  },
  profileContainer: {
    flex: "1 0 200px",
    maxWidth: "350px",
    height: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "35px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
    padding: "20px",
    margin: "20px",
  },
  profileImage: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  marcadoresContainer: {
    flex: "2 0 200px",
    maxWidth: "700px",
    height: "50vh",
    overflowY: "scroll",
    backgroundColor: "white",
    borderRadius: "35px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
    padding: "20px",
    margin: "20px",
  },
};

export default ProfilePage;
