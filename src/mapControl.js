//env token
const token = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = token;

//imports
import * as turf from "@turf/turf";
import { mapLayer } from "./utilities/map-styles";
import { Map } from "./utilities/map";
import { ModalUi } from "./utilities/UI-modules";

const mbxDirections = require("@mapbox/mapbox-sdk/services/directions");
const directions = mbxDirections({ accessToken: token });

export class MapControl {
  constructor() {
    const copyLocation = document.getElementById("copy-location");

    this.map = Map();
    this.modal = new ModalUi();
    this.markers;
    this.locateUser = this.locateUser;
    this.findPlace = this.findPlace;

    copyLocation.addEventListener("click", this.copyLocation.bind(this));
  }

  copyLocation() {
    //http://www.google.com/maps/place/lat,lng

    console.log(this.modal);
  }

  locateUser() {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
    });
    //add special map design and geolocate to locate the user
    mapLayer(this.map, geolocate);
    this.map.addControl(geolocate);
  }

  findPlace(lat, lng) {
    // set user view to marker with find place
    this.map.flyTo({
      center: [lat, lng],
      essential: true,
    });

    // delete actual marker if there is
    if (this.markers !== undefined) this.markers.remove();

    this.markers = new mapboxgl.Marker({ color: "#cb8347", draggable: true })
      .setLngLat([lat, lng])
      .addTo(this.map);
  }

  showRoute() {
    const userCoords = document
      .getElementById("my-location")
      .textContent.split(" ");

    directions
      .getDirections({
        profile: "driving-traffic",
        // geometries: "geojson",
        waypoints: [
          {
            coordinates: [parseFloat(userCoords[1]), parseFloat(userCoords[0])],
          },
          {
            coordinates: [this.markers._lngLat.lng, this.markers._lngLat.lat],
          },
        ],
      })
      .send()
      .then((res) => {
        const directionRoute = res.body;
        const routeGeoJSON = turf.featureCollection([
          turf.feature(directionRoute.routes[0].geometry),
        ]);
        this.map.getSource("route").setData(routeGeoJSON);
      })
      .catch((e) => {
        console.log("AAA BŁĄD:", e);
        this.modal.localizationFailed(
          "We can't find the route",
          "We are sorry but our system did not find a route for the selected location, please make sure you have entered the correct data"
        );
      });
  }
}
