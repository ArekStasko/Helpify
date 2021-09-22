export class Sidebar {
    constructor(button){
        this.btn = button
    }

    sidebarToggle() {
        const sidebar = document.getElementById('sidebar')
        sidebar.classList.toggle('sidebar--non-active')
        this.classList.toggle('sidebar__btn--active')
    } 
}