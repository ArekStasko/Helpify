export class ModalUi {
    constructor(){
        const popupBtn = document.getElementById('popup-btn')
        popupBtn.addEventListener('click', this.popupClose)

        this.localizationFailed = this.localizationFailed
        this.loading = this.loading
    }

    loading(id, state){
        const element = document.getElementById(id)
        if(state){
            element.classList.remove('btn')
            element.classList.add('loading')
        } 
        else {
            element.classList.remove('loading')
            element.classList.add('btn')
        }
    }

    localizationFailed(title, msg) {
        const popupElement = document.getElementById('popup')
        const popupTitle = document.getElementById('popup-title')
        const popupMessage = document.getElementById('popup-message')

        popupTitle.textContent = title
        popupMessage.textContent = msg
        
        popupElement.style.cssText = `
            visibility: visible;
            opacity: 1;
        `
    }

    popupClose(){
        const popupElement = document.getElementById('popup')

        popupElement.style.cssText = `
            visibility: hidden;
            opacity: 0;
        `
    }
}