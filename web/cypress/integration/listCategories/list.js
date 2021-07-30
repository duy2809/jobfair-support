/* eslint-disable no-undef */
describe('Check connection', () => {
  it('Connect to listCategories page', () => {
    cy.visit('http://jobfair.local:8000/Category')
  })
  it('check title', () => {
    cy.get('p').contains('カテゴリー覧').click('topRight')
  })
  it('check item number', () => {
    cy.get('p').contains('表示件数')
    cy.get('select').select('10').should('have.value', '10')
    cy.get('select').select('25').should('have.value', '25')
    cy.get('select').select('50').should('have.value', '50')
  })
  it('check searchbar', () => {
    cy.get('input').invoke('attr', 'placeholder').should('contain', 'search for category name')
    cy.get('input').type('TC')
  })
})
