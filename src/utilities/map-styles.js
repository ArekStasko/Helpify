//this is styles from mapbox

export const mapLayer = (map, geolocate) => {
  return map.on("load", () => {
    if (!navigator.geolocation) {
      alert(
        "Location feature is not available in your browser - please use a more modern browser or manually enter an address."
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (res) => {
        const coords = {
          lat: res.coords.latitude,
          lng: res.coords.longitude,
        };
        const myLocation = document.getElementById("my-location");
        myLocation.textContent = `${coords.lat} ${coords.lng}`;
        map.jumpTo({
          center: [coords.lng, coords.lat],
        });
      },
      (error) => {
        alert("Could not locate you unfortunately.");
      }
    );

    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === "symbol" && layer.layout["text-field"]
    ).id;

    map.addLayer(
      {
        id: "add-3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 24,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            0,
            15.05,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 0.6,
        },
      },
      labelLayerId
    );
    //locate the user after load the styles
    geolocate.trigger();
  });
};
