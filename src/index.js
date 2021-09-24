import { Map } from './map'
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const token = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: token })


//I WILL REFACTOR THIS CODE TO BE READABLE AND EFFECTIVE
//NOW I ONLY TRY TO MAKE FUNCTIONALITY

class Place {
  constructor(){
    const sidebarButton = document.getElementById('sidebar-button')
    const findForm = document.getElementById('find-form')

    sidebarButton.addEventListener('click', this.sidebarToggle)
    findForm.addEventListener('click', this.findPlace)
    window.addEventListener('load', this.locateUser.bind(this))
  }

  sidebarToggle() {
    const sidebar = document.getElementById('sidebar')
    sidebar.classList.toggle('sidebar--non-active')
    this.classList.toggle('sidebar__btn--active')
} 

  locateUser() {
    if(!navigator.geolocation) {
      alert(
        'Location feature is not available in your browser - please use a more modern browser or manually enter an address.'
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async res => {
        const coords = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        }
      const myLocation = document.getElementById('my-location')  
      myLocation.textContent = `${coords.lat} ${coords.lng}`
      new Map(coords.lng, coords.lat)
      },
      error => {
        alert(
          'Could not locate you unfortunately.'
        )
      }
    )
  }

  async findPlace(e){
    const place = document.getElementById('find-place').value
    const geoData = await geocoder.forwardGeocode({
      query: place,
      limit: 1
    }).send()
    const coords = await geoData.body.features[0].geometry.coordinates
    const [lat, lng] = [coords[0], coords[1]]
    console.log(lat, lng)
    e.preventDefault()
  }

}

new Place()