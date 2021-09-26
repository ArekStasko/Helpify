import { mapLayer } from "./utilities/map-styles";
import { Map } from "./utilities/map";

//env token
const token = process.env.MAPBOX_TOKEN;
mapboxgl.accessToken = token;

export class MapControl {
  constructor() {
    this.map = Map();
    this.markers;
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
    if (this.markers!==undefined) this.markers.remove();

    this.markers = new mapboxgl.Marker({ color: "#cb8347", draggable: true })
      .setLngLat([lat, lng])
      .addTo(this.map);
  }
}
