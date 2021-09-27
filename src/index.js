import { MapControl } from "./mapControl";
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const token = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: token });

class Place {
  constructor() {
    const sidebarButton = document.getElementById("sidebar-button");
    const findForm = document.getElementById("find-form");
    const routeForm = document.getElementById('route-form')

    sidebarButton.addEventListener("click", this.sidebarToggle);
    findForm.addEventListener("click", this.findPlace.bind(this));
    routeForm.addEventListener('click', this.showRoute.bind(this))
    window.addEventListener("load", this.location.bind(this));

    this.mapControl = new MapControl();
  }

  sidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("sidebar--non-active");
    this.classList.toggle("sidebar__btn--active");
  }

  location() {
    this.mapControl.locateUser();
  }

  async findPlace(e) {
    const place = document.getElementById("find-place").value;
    const geoData = await geocoder
      .forwardGeocode({
        query: place,
        limit: 1,
      })
      .send();
    const coords = await geoData.body.features[0].geometry.coordinates;
    const [lat, lng] = [coords[0], coords[1]];
    this.mapControl.findPlace(lat, lng);
    e.preventDefault();
  }

  showRoute() {
    this.mapControl.showRoute()
  }
}

new Place();
