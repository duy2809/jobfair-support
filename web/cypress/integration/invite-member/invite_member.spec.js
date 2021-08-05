describe('Check invite member', () => {
  beforeEach(() => {
    cy.visit('/invite-member')
  })

  // it('Check screen name', () => {
  //   cy.get('.screen-name').should('be.visible').should('contain', 'メンバ招待')
  // })

  // it('Check input labels name', () => {
  //   cy.get('label[for="email"]').should('contain', 'メールアドレス')
  //   cy.get('label[for="categories"]').should('contain', '役割')
  // })

  // it('Check buttons status on load page', () => {
  //   cy.get('#btn-cancel').should('be.visible').find('span').should('contain', 'キャンセル')
    // cy.get('#btn-submit').should('be.disabled')
  //   cy.get('#btn-submit span').should('contain', '招 待')
  // })

  it('Check category selector', () => {
    cy.get('.ant-select-selection-placeholder').should('contain', 'カテゴリを選んでください')
    cy.get('#categories').click().then(selector => {
      cy.wrap(selector).should('have.attr', 'aria-expanded').and('eq', 'true')
      cy.get('.ant-select-item-option-content').as('categories').should('have.length', 2)
      cy.get('@categories').eq(0).should('contain', '管理者')
      cy.get('@categories').eq(1).should('contain', 'メンバ')
    })
  })

  // it('Check email invalid error message', () => {
  //   cy.get('#email').type('sdfuwer123')
  //   cy.get('div[role="alert"]')
  //     .should('be.visible')
  //     .should('contain', 'メールアドレス有効なメールではありません!')
  // })

  // it('Check email input empty error message', () => {
  //   cy.get('#email').type('abcdsf')
  //   cy.get('#email').clear()
  //   cy.get('div[role="alert"]')
  //     .should('be.visible')
  //     .should('contain', 'メールアドレスを入力してください。')
  // })
})