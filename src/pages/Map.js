// Map.js
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import ModalMarcador from "./ModalMarcador";
import { pegarMarcadores } from "./FirebaseDb";
import grafiteIcon from "./assets/grafite.png";
import estencilIcon from "./assets/estencil.png";
import dancaIcon from "./assets/danca.png";
import cantoIcon from "./assets/canto.png";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const bounds = {
  north: -22.7485,
  south: -22.7696,
  east: -43.4555,
  west: -43.4849,
};

const fixedSizeStyle = {
  width: "300px",
  height: "300px",
};

function Map() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [marcadores, setMarcadores] = useState([]);
  const [selectedMarcador, setSelectedMarcador] = useState(null);
  const [address, setAddress] = useState("");
  const [center, setCenter] = useState({ lat: -22.7485, lng: -43.4849 });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    pegarMarcadores(setMarcadores);
  }, []);

  const handleMapClick = (event) => {
    setClickedLatLng({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setCenter(latLng);
        setIsExpanded(false);
      })
      .catch((error) => console.error("Erro ao buscar localização:", error));
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        bounds={bounds}
        onClick={handleMapClick}
      >
        {marcadores.map((marcador, index) => (
          <Marker
            key={index}
            position={{ lat: marcador.latitude, lng: marcador.longitude }}
            onClick={() => setSelectedMarcador(marcador)}
            icon={getIcon(marcador.tipo_arte)}
          />
        ))}

        {selectedMarcador && (
          <InfoWindow
            position={{
              lat: selectedMarcador.latitude + 0.0001,
              lng: selectedMarcador.longitude,
            }}
            onCloseClick={() => setSelectedMarcador(null)}
          >
            <div style={fixedSizeStyle}>
              <h2>Informações do marcador!</h2>
              <p>
                Tipo de arte: <b>{selectedMarcador.tipo_arte}</b>
              </p>
              <p>
                Comentário: <b>{selectedMarcador.comentario}</b>
              </p>
              <img
                src={selectedMarcador.arquivo}
                alt={selectedMarcador.tipo_arte}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </InfoWindow>
        )}

        <ModalMarcador
          isOpen={modalIsOpen}
          onRequestClose={handleModalClose}
          latitude={clickedLatLng?.lat}
          longitude={clickedLatLng?.lng}
        />
      </GoogleMap>
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "70%",
          transform: "translateX(-50%)",
          zIndex: 1,
          textAlign: "center",
          width: "300px",
          margin: "0 auto",
        }}
      >
        {isExpanded ? (
          <PlacesAutocomplete
            value={address}
            onChange={setAddress}
            onSelect={handleSelect}
            searchOptions={{
              componentRestrictions: { country: "br" },
            }}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div
                style={{
                  padding: "10px",
                  background: "#fff",
                  borderRadius: "5px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <input
                  {...getInputProps({ placeholder: "Pesquisar locais..." })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    fontSize: "16px",
                    border: "none",
                    borderBottom: "1px solid #ccc",
                  }}
                  onBlur={() => setIsExpanded(false)}
                />
                <div>
                  {loading ? <div>Carregando...</div> : null}

                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                      padding: "8px",
                      cursor: "pointer",
                    };

                    return (
                      <div {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        ) : (
          <SearchIcon
            onClick={() => setIsExpanded(true)}
            style={{
              cursor: "pointer",
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            }}
          />
        )}
      </div>
    </div>
  );
}

function getIcon(tipoArte) {
  const iconSize = new window.google.maps.Size(75, 75);

  switch (tipoArte) {
    case "grafite":
      return { url: grafiteIcon, scaledSize: iconSize };
    case "estencil":
      return { url: estencilIcon, scaledSize: iconSize };
    case "danca":
      return { url: dancaIcon, scaledSize: iconSize };
    case "canto":
      return { url: cantoIcon, scaledSize: iconSize };
    default:
      return null;
  }
}

export default Map;
