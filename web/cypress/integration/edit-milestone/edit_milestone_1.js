import Color from 'color'
describe('Edit Milestone Test', () => {
  const expectTextColor = Color('#2d334a').string() 
    it('Visits Jobfair Support Edit Milestone', () => {
      cy.visit('http://jobfair.local:8000/milestones/3/edit')
    })

    it('Check title', () => {
      cy.get('.title').contains('マイルストーン編集').should('have.css', 'color')
      .and('eq', expectTextColor)
    })

    it('Check label', () => {
      
      cy.get('form label p').contains('マイルストーン名').should('have.css', 'color')
      .and('eq', expectTextColor)
      cy.get('form label').should('have.attr', 'class', 'ant-form-item-required')
      cy.get('form label p').contains('期日').should('have.css', 'color')
      .and('eq', expectTextColor)
    })

    it('Check input ', () => {
      cy.get('input[id=basic_name]').type('text').invoke('val').then((val) => {
        if(val === ''){
          cy.get('div').should('have.attr','role','alert').contains('この項目は必須です。')
        }
        if(val.includes('　')){
          cy.get('div').should('have.attr','role','alert').contains('マイルストーン名はスペースが含まれていません。')

        }
      })
      cy.get('input[id=basic_time]').invoke('val').then((val) => {
        var regExp = /[a-zA-Z !,?._'@]/g;
        var halfWidth = '3';
        if(val === ''){
          cy.get('div').should('have.attr','role','alert').contains('この項目は必須です。')
        }
        if(val.includes(' ')){
          cy.get('div').should('have.attr','role','alert').contains('半角の整数で入力してください。')

        }
        if(regExp.test(val)){
          cy.get('div').should('have.class','ant-form-item-explain-error').contains('半角の整数で入力してください。')
        } 
        cy.get('input[id=basic_time]').should('have.value', halfWidth)
      })
      
    })
  })