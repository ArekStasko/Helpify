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
    const copyLocationBtn = document.getElementById("copy-location");
    this.copyLocationBtn = copyLocationBtn
    this.map = Map();
    this.modal = new ModalUi();
    this.markers;
    this.locateUser = this.locateUser;
    this.findPlace = this.findPlace;

    copyLocationBtn.addEventListener("click", this.copyLocation.bind(this));
  }

  copyLocation() {
    const [lat, lng] = document
      .getElementById("my-location")
      .textContent.split(" ");
    this.copyLocationBtn.classList.add('btn__info')
    setTimeout(()=>this.copyLocationBtn.classList.remove('btn__info'), 3000)
    const locationLink = `http://www.google.com/maps/place/${lat},${lng}`;
    navigator.clipboard.writeText(locationLink);
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

  findPlace(targetId, lat, lng) {
    //clear routes
    this.map.getSource("route").setData(turf.featureCollection([]));
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
    this.modal.loading(targetId, false);
  }

  showRoute(targetId) {
    if (!this.markers) {
      this.modal.localizationFailed(
        "No point to find",
        "Please first find some point to which we can find a route"
      );
      return;
    }
    this.modal.loading(targetId, true);
    const userCoords = document
      .getElementById("my-location")
      .textContent.split(" ");

    const timeInfo = document.getElementById("travel-time");
    const distanceInfo = document.getElementById("travel-distance");

    directions
      .getDirections({
        profile: "driving-traffic",
        geometries: "geojson",
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
        const travelTime = (directionRoute.routes[0].duration / 60 / 60)
          .toFixed(2)
          .replace(".", "h ");
        timeInfo.textContent = `Travel time: ${travelTime}min`;
        const travelDistance = Math.round(
          directionRoute.routes[0].distance / 1000
        );
        distanceInfo.textContent = `Distance: ${travelDistance}km`;
        const routeGeoJSON = turf.featureCollection([
          turf.feature(directionRoute.routes[0].geometry),
        ]);
        this.map.getSource("route").setData(routeGeoJSON);
        this.modal.loading(targetId, false);
      })
      .catch((e) => {
        this.modal.loading(targetId, false);
        this.modal.localizationFailed(
          "We can't find the route",
          "We are sorry but our system did not find a route for the selected location, please make sure you have entered the correct data"
        );
      });
  }
}
