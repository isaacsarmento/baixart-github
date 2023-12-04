import React, { useState } from "react";
import Modal from "react-modal";
import "./ModalMarcador.css";
import { toast, Toaster } from "react-hot-toast";
import { salvarMarcador, enviarArquivo } from "./FirebaseDb"; // Importando as funções

Modal.setAppElement("#root");

function ModalMarcador({ isOpen, onRequestClose, latitude, longitude }) {
  const [tipoArte, setTipoArte] = useState("grafite");
  const [comentario, setComentario] = useState("");
  const [arquivo, setArquivo] = useState(null);

  const handleFormSubmit = () => {
    if (arquivo) {
      enviarArquivo(arquivo).then((url) => {
        salvarMarcador(latitude, longitude, tipoArte, comentario, url);
      });
    } else {
      toast.error("Nenhum arquivo selecionado");
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="My Modal"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: "2",
        },
        content: {
          width: "50%",
          height: "50%",
          margin: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <h2>Divulgue a arte!</h2>
      <p>Tipo de arte:</p>
      <select onChange={(e) => setTipoArte(e.target.value)}>
        <option value="grafite">Grafite</option>
        <option value="estencil">Estêncil</option>
        <option value="danca">Dança</option>
        <option value="canto">Canto</option>
      </select>
      <p>Digite um comentário:</p>
      <input
        type="text"
        placeholder="Digite algo aqui..."
        onChange={(e) => setComentario(e.target.value)}
      />
      <p>Envie uma foto ou vídeo da obra:</p>
      <input type="file" onChange={(e) => setArquivo(e.target.files[0])} />
      <button onClick={onRequestClose}>Fechar</button>
      <button onClick={handleFormSubmit}>Criar marcador!</button>
      <Toaster />
    </Modal>
  );
}

export default ModalMarcador;
