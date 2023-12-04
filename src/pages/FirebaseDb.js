import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, get, remove, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const storage = getStorage(app);

export function salvarMarcador(lat, lng, tipo_arte, comentario, arquivo) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.log('Por favor, faça login para criar um marcador.');
    return;
  }

  const dbRef = ref(database, 'marcadores');
  const newMarkerRef = push(dbRef);
  const data = {
    latitude: lat, 
    longitude: lng,
    tipo_arte: tipo_arte,
    comentario: comentario,
    arquivo: arquivo,
    userID: user.uid
  };

  
  set(newMarkerRef, data).then(() => {
    console.log(`Marcador criado com sucesso. ID do marcador: ${newMarkerRef.key}`);
  }).catch((error) => {
    console.error('Erro ao salvar o marcador:', error);
  });

  return newMarkerRef.key;
}

export function enviarArquivo(file) {
  const fileRef = storageRef(storage, file.name);
  
  return uploadBytesResumable(fileRef, file).then(() => {
    return getDownloadURL(fileRef);
  });
}

export function pegarMarcadores(callback) {
    const dbRef = ref(database, 'marcadores');
    
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const marcadores = Object.values(data);
        callback(marcadores);
      } else {
        console.log('Nenhum dado encontrado');
      }
    });
}

export function pegarMarcadoresPorUsuario(userID, callback) {
  const dbRef = ref(database, 'marcadores');
  
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Filtra os marcadores pelo userID
      const marcadores = Object.values(data).filter(marcador => marcador.userID === userID);
      callback(marcadores);
    } else {
      console.log('Nenhum dado encontrado baseado na userID');
    }
  });
}

export function excluirMarcador(markerId) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const markerRef = ref(database, `marcadores/${markerId}`);

    get(markerRef).then((snapshot) => {
      const markerData = snapshot.val();

      // Verifica se o marcador existe e se o usuário tem permissão para excluí-lo
      if (markerData && markerData.userId === user.uid) {
        remove(markerRef)
          .then(() => {
            console.log("Marcador excluído com sucesso.");
          })
          .catch((error) => {
            console.error("Erro ao excluir o marcador: ", error);
          });
      } else {
        console.log("Você não tem permissão para excluir este marcador ou o marcador não existe.");
      }
    }).catch((error) => {
      console.error("Erro ao recuperar dados do marcador: ", error);
    });
  } else {
    console.log("Usuário não está autenticado.");
  }
}
