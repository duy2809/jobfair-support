/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Color from 'color'

describe('Title and combobox', () => {
  it('Visits Category', () => {
    cy.visit('http://jobfair.local:8000/Category')
  })

  it.skip('Check title', () => {
    cy.get('p')
      .contains('カテゴリー覧')
      .should('have.css', 'color')
  })
  // Check select
  it.skip('Click Dropdown', () => {
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').should('be.visible')
  })
  it.skip('Click Dropdown Item', () => {
    cy.get('.ant-select-item-option-content').eq(0).first().click()
    cy.get('.ant-select-selection-item').should('contain', '10').first().click()
    cy.get('.ant-select-item-option-content').eq(1).first().click()
    cy.get('.ant-select-selection-item').should('contain', '25')
    cy.get('.ant-select-item-option-content').eq(2).first().click({ force: true })
    cy.get('.ant-select-selection-item').should('contain', '50')
  })
  it.skip('Check dropdown label', () => {
    cy.get('p').contains('表示件数:')
  })
})

describe('Check search bar', () => {
  it.skip('check search input', () => {
    cy.get('input[placeholder*="カテゴリを検索"]')
    cy.get('.anticon-search').should('be.visible')
  })
})
describe('check add button', () => {
  it('check if button exited', () => {
    cy.get('[type="button"]').should('be.visible')
  })
  it('check modal add', () => {
    cy.get('[type="button"]').first().click()
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-title').should('contain', '追加カテゴリ')
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]')
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().should('be.visible').contains('キャンセル')
      // error here
      cy.get('.ant-btn').last().should('be.visible')
      cy.get('.ant-btn').first().click({ force: true })
    })
  })
  it.skip('check add process', () => {
    cy.get('[type="button"]').first().click()
  })
})
