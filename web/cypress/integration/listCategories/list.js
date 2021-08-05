/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Color from 'color'

describe('タイトル', () => {
  it('Visits Category', () => {
    cy.visit('http://jobfair.local:8000/Category')
  })

  it('タイトル', () => {
    cy.get('h1')
      .contains('カテゴリー覧')
      .should('have.css', 'color')
  })
})

describe.skip('検索ボックス', () => {
  it('表示確認', () => {
    cy.get('input[placeholder*="カテゴリを検索"]')
    cy.get('.anticon-search').should('be.visible')
  })
  it('動作確認', () => {
    // search real-time
    cy.get('input[placeholder*="カテゴリを検索"]').type('D').should('have.value', 'D')
    cy.get('.ant-table-container').contains('td.ant-table-cell', 'D')
    cy.get('input[placeholder*="カテゴリを検索"]').type('r').should('have.value', 'Dr')
    cy.get('.ant-table-container').contains('td.ant-table-cell', 'Dr')
    cy.get('input[placeholder*="カテゴリを検索"]').clear()
    // search no data
    cy.get('input[placeholder*="カテゴリを検索"]').type('aaaaaaaaaaaaa').should('have.value', 'aaaaaaaaaaaaa')
    cy.get('.ant-empty-description').should('contain', 'No Data')
    cy.get('.ant-pagination').should('not.exist')
    cy.get('input[placeholder*="カテゴリを検索"]').clear()
    // return default
    cy.get('.ant-pagination').should('exist')
  })
})

describe.skip('リスト', () => {
  it('「表示件数」を表示する', () => {
    cy.get('p').contains('表示件数:')
  })
  it('コンボボックスをクリックする', () => {
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').should('be.visible')
    // コンボボックスのデフォルト値を確認
    cy.get('.ant-select-selection-item').should('contain', '10').first().click()
  })
  it('コンボボックスに表示されるカテゴリの数をクリックして選択する', () => {
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').eq(0).first().click()
    cy.get('.ant-select-selection-item').should('contain', '10')
    cy.get('.ant-table-tbody').find('tr').should('have.length', 11)
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').eq(1).first().click()
    cy.get('.ant-select-selection-item').should('contain', '25')
    cy.get('.ant-table-tbody').find('tr').should('have.length', 26)
    cy.get('.ant-select-selection-item').first().click()
    cy.get('.ant-select-item-option-content').eq(2).first().click({ force: true })
    cy.get('.ant-select-selection-item').should('contain', '50')
    cy.get('.ant-table-tbody').find('tr').should('have.length', 51)
  })
})

describe('編集ボタン', () => {
  it('表示確認', () => {
    cy.get('.anticon.anticon-edit').should('be.visible')
  })
  it('編集モーダルを確認する', () => {
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-content').should('be.visible')
    cy.get('.ant-modal-title').should('contain', '編集カテゴリ')
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]')
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().should('be.visible').contains('キャンセル')
      cy.get('.ant-btn').last().should('be.visible').contains('保 存')
      cy.get('.ant-btn').first().click({ force: true })
    })
  })
  it('check duplicate edit process', () => {
    let initialData = ''
    cy.contains('td', '2').parent().within((tr) => {
      cy.get('td:nth-child(2)').then(($span) => {
        initialData = $span.text()
        cy.log(initialData)
      })
    })
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').type(initialData)
    })
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true }).wait(500)
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', 'このカテゴリー名は存在しています')
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').first().click({ force: true })
    })
  })
  it('check normal edit process', () => {
    cy.contains('td', '1').parent().within((tr) => {
      cy.get('.anticon.anticon-edit').click()
    })
    cy.get('.ant-modal-body').within(() => {
      cy.get('input[placeholder*="カテゴリ名を書いてください"]').clear().type(categoryName())
    })
    function categoryName() {
      let text = ''
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,.!?:;+-*/123456789'
      for (let i = 0; i < 10; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length))
      return text
    }
    cy.get('.ant-modal-content').within(() => {
      cy.get('.ant-btn').last().click({ force: true })
    })
    cy.get('.ant-notification-notice-message').should('be.visible').should('contain', '変更は正常に保存されました。')
    cy.get('.ant-modal-content').should('not.visible')
    // cy.get('.ant-table-container').contains('td.ant-table-cell', text)
  })
})

describe.skip('check add button', () => {
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
      cy.get('.ant-btn').last().should('be.visible').contains('登 録')
      cy.get('.ant-btn').first().click({ force: true })
    })
  })
  it.skip('check add process', () => {
    cy.get('[type="button"]').first().click()
  })
})
