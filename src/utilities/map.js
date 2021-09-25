const token = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = token;

export const Map = () =>
  new mapboxgl.Map({
    style: "mapbox://styles/mapbox/dark-v10",
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: "map",
    antialias: true,
  });


