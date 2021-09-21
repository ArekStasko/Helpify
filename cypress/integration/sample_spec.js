

describe('My First Test', function () {
    it('Visit page', function () {
        cy.visit('/')
    })
    it('Check sidebar location', function () {
        cy.get('.map__location')
          .find('h3').contains('My Location')
        cy.get('.map__location')
          .find('button').contains('Get Location')
    })
    it('Check sidebar add form', function () {
        cy.get('.map__add-form')
            .children()
            .should('contains', 'h3')
            .find('form')
        cy.get('.map__add-form form')
          .find('input[name="title"]').type('lorem ipsum')  
          .find('input[name="description"]').type('lorem ipsum')
          .find('input[type="number"name="phone-number"]').type("123456789") 
          .find('button').contains('Add').click()
    })
})