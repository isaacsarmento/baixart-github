import React from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";

export default function SearchBox(props) {
  const [ref, setRef] = React.useState(null);
  const [searchBox, setSearchBox] = React.useState(null);

  React.useEffect(() => {
    if (window.google && ref) {
      const sb = new window.google.maps.places.SearchBox(ref);
      setSearchBox(sb);
    }
  }, [ref]);

  React.useEffect(() => {
    if (window.google && searchBox) {
      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();
        if (places.length > 0) {
          const location = places[0].geometry.location;
          props.onPlacesChanged(location.lat(), location.lng());
        }
      });
    }
  }, [searchBox, props]);

  return <input ref={setRef} type="text" placeholder="Search..." />;
}
