import { MapControl } from "./mapControl";
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const token = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: token });
import { ModalUi } from "./utilities/UI-modules";

class Place {
  constructor() {
    const sidebarButton = document.getElementById("sidebar-button");
    const findForm = document.getElementById("find-form");
    const routeForm = document.getElementById("route-form");

    sidebarButton.addEventListener("click", this.sidebarToggle);
    findForm.addEventListener("click", this.findPlace.bind(this));
    routeForm.addEventListener("click", this.showRoute.bind(this));
    window.addEventListener("load", this.location.bind(this));

    this.mapControl = new MapControl();
    this.modal = new ModalUi();
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
    const targetID = e.target.id;
    const place = document.getElementById("find-place").value;
    if (!place) {
      this.modal.localizationFailed(
        "No entered place to find",
        "Please first entered name of place that we have to find"
      );
      return;
    }
    this.modal.loading(targetID, true);
    try {
      const geoData = await geocoder
        .forwardGeocode({
          query: place,
          limit: 1,
        })
        .send();
      const coords = await geoData.body.features[0].geometry.coordinates;
      const [lat, lng] = [coords[0], coords[1]];
      this.mapControl.findPlace(targetID, lat, lng);
      e.preventDefault();
    } catch (e) {
      this.modal.loading(targetID, false);
      this.modal.localizationFailed(
        "We can't find place",
        "We are sorry but our system did not find a place you provided, please make sure you have entered the correct data"
      );
    }
  }

  showRoute(e) {
    this.mapControl.showRoute(e.target.id);
  }
}

new Place();
