import { mapLayer } from "./utilities/map-styles";
import { Map } from "./utilities/map";

//env token
const token = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = token;

export class MapControl {
  constructor(lat, lng) {
    this.map = Map(lat, lng);
    this.locateUser = this.locateUser;
    this.findPlace = this.findPlace;
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
    mapLayer(this.map, geolocate);
    this.map.addControl(geolocate);
  }

  findPlace(lat, lng) {
    this.map.flyTo({
      center: [lat, lng],
      essential: true,
    });
  }
}
