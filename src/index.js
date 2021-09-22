class Place {
  constructor(){
    const sidebarButton = document.getElementById('sidebar-button')

    sidebarButton.addEventListener('click', this.sidebarToggle)
  }

  sidebarToggle() {
    const sidebar = document.getElementById('sidebar')
    sidebar.classList.toggle('sidebar--non-active')
    this.classList.toggle('sidebar__btn--active')
} 
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiamlyYWl5aWEiLCJhIjoiY2t0dWNqMXNwMGlheTMzcW4ydGlxNDZ5MCJ9.8cncuQ0VUaoqscH5gz5CFA";
const map = new mapboxgl.Map({
  style: "mapbox://styles/mapbox/dark-v10",
  center: [-74.0066, 40.7135],
  zoom: 15.5,
  pitch: 45,
  bearing: -17.6,
  container: "map",
  antialias: true,
});

map.on("load", () => {
  // Insert the layer beneath any symbol layer.
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
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
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
});

new Place()