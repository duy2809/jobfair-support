describe('cancel test', () => {
  before(() => {
    cy.visit('http://jobfair.local:8000/add-jobfair')
  })

  it.only('availble button', () => {
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    const namefield = cy.get('#name')
    namefield.click()
    namefield.focused().type('Henry Jonnathan')
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    cy.get('#start_date').type('2021/07/15{enter}', { force: true })
    cy.get('label[for="name"]').click()
    cy.get('#number_of_companies').type('10')
    cy.get('#number_of_students').type('10')
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
    cy.get('#jobfair_admin_id').click()
    cy.get('div.ant-select-item:nth-child(1) > div:nth-child(1)').click()
    cy.get('#schedule_id').click()
    cy.get('body > div:nth-child(16) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').click()
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('not.be.disabled')
  })
  it('empty field', () => {
    cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').click()
    cy.url().should('contain', 'JF-List')
  })
})
