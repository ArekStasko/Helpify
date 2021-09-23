import { Map } from './map'

class Place {
  constructor(){
    const sidebarButton = document.getElementById('sidebar-button')

    sidebarButton.addEventListener('click', this.sidebarToggle)
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
      await new Map(coords.lng, coords.lat)
      },
      error => {
        alert(
          'Could not locate you unfortunately.'
        )
      }
    )
  }
}

new Place()