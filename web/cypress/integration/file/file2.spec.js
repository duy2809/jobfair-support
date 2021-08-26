const validPassword = '12345678'; // TODO: change your password in db
const existValidEmail = 'AnAdmin@sun-asterisk.com'; // TODO: change your email in db

describe('Check file', () => {
    
    const id = 1
    before(()=>{

        cy.visit('http://jobfair.local:8000/login');
        cy.get('#login_email').type(existValidEmail);
        cy.get('#login_password').type(validPassword);
        cy.get('.ant-btn')
          .should('contain', 'ログイン')
          .should('not.be.disabled')
          .click();
    
        cy.wait(3000);
        cy.visit(`http://jobfair.local:8000/file/${id}`);
        cy.wait(3000);
    })

    it('Check Display', () => {
        cy.get('h1').contains('ファイル')
        cy.get('.navbar').should('be.visible')
    
    })

    it('Check file', () => {
        cy.get('table').find('div').contains('名前')
        cy.get('table').find('th').contains('更新者')
        cy.get('table').find('th').contains('更新時間')
        

        if(!cy.get('tbody.ant-table-tbody > tr.ant-table-placeholder').should('not.exist')){
            cy.get('div').contains('このフォルダは空です。')
        }else{

                cy.get('tbody.ant-table-tbody > tr').its('length').then((len)=>{
                cy.get('tbody > tr > td ').find('.ant-checkbox-input').should('have.length', len-1)
                cy.get('tbody > tr > td > div').find('span').invoke('attr', 'style', 'max-width: 20ch').should('have.attr', 'style', 'max-width: 20ch')
                cy.get('tbody > tr > td > div').find('.text-sm').each(($s)=>{
                        if($s.text().length > 20){
                            $s.trigger('mouseover')
                        }
                    })
                  
                cy.get('button').should('be.disabled').find('span').contains('編 集')
                cy.get('button').should('be.disabled').find('span').contains('削 除')
                cy.get('.table-top').find('.ant-checkbox-wrapper > .ant-checkbox:nth-child(1)').click()
                cy.get('td').find('.ant-checkbox-checked').should('have.length', len-1)
                cy.get('.table-top').find('.ant-checkbox-wrapper > .ant-checkbox:nth-child(1)').click()

                cy.get('tbody').find('tr:nth-child(2)').find('.ant-checkbox').click()
                cy.get('button').find('span').contains('削 除').click()
                //Check modal delete
                cy.get('.ant-modal-content').find('.ant-modal-body > p').contains('削除してもよろしいですか？')
                cy.get('.ant-modal-content').find('.ant-modal-footer > button > span').contains('いいえ')
                cy.get('.ant-modal-content').find('.ant-modal-footer > button > span').contains('いいえ').click()
                //Check modal edit
                
                cy.get('button').find('span').contains('編 集').then(($btn) => {
                    if ($btn.is(":disabled")) {
                    } else {
                        cy.get('button').find('span').contains('編 集').click()
                        cy.get('.ant-modal-content').find('.ant-modal-header > div').contains('新しいファイル')
                        cy.get('.ant-modal-content').find('.ant-modal-body > form').find('p').contains('名前')
                        cy.get('input[id=basic_name_file]').clear().then(() => {
                            cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('この項目は必須です。')
                          })
                        cy.get('.ant-modal-content').find('.ant-modal-body > form').find('p').contains('リンク')
                        cy.get('input[id=basic_link]').clear().then(() => {
                            cy.get('.ant-form-item-explain-error').find('div').should('have.attr','role','alert').contains('この項目は必須です。')
                          })
                        cy.get('.ant-modal-content').find('.ant-modal-footer > button > span').contains('キャンセル')
                        cy.get('.ant-modal-content').find('.ant-modal-footer > button').should('be.disabled').find('span').contains('保 存')
                        cy.get('.ant-modal-content').find('.ant-modal-footer > button > span').contains('キャンセル').click()

                    }
                  })
                   
            })
           
        }

    })
})  