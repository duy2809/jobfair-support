import Color from 'color'
const validPassword = '12345678'; // TODO: change your password in db
<<<<<<< HEAD
const existValidEmail = 'letitia.kessler@example.net'; // TODO: change your email in db
=======
const existValidEmail = 'schamberger.beryl@example.com'; // TODO: change your email in db
>>>>>>> update api J1
describe('User Profile Test', () => {
  const expectTextColor = Color('#2d334a').string() 
    it('Visits Jobfair Support Profile', () => {
      cy.visit('http://jobfair.local:8000/login');
      cy.get('#login_email').type(existValidEmail);
      cy.get('#login_password').type(validPassword);
      cy.get('.ant-btn')
      .should('contain', 'ログイン')
      .should('not.be.disabled')
      .click();
      cy.wait(1000);
      cy.visit('http://jobfair.local:8000/profile')
    })

<<<<<<< HEAD
    it('Check header and footer notification', () =>{
      cy.get('div.ant-dropdown-trigger').find('span.anticon-bell').click();
    cy.get('.notification').should('be.visible');
      cy.get('div.noti-title').contains('通知')
      cy.get('div.noti-checked').find('span.ant-checkbox')
      cy.get('div.noti-checked').find('span').contains('未読のみ表示')

      cy.get('div.noti-footer').find('span.ant-checkbox')
      cy.get('div.noti-footer').find('span').contains('すべて既読にする')


    })
    
  

  it('Check contain notification', () =>{
    cy.get('div.ant-spin-nested-loading').find('div.ant-spin-container').then(($body) => {
      if($body.find('div.ant-list-items')){
        $body.find('div.ant-list-items').find('li.ant-list-item').find('div.delete-btn')
        $body.find('div.ant-list-items').find('li.ant-list-item').find('span.ant-avatar')
        $body.find('div.ant-list-items').find('li.ant-list-item').find('div.noti-time')

      }else{
        $body.find('div.ant-list-items').contains('No Notification')
      }
    })

  })
})
=======
    
  })
>>>>>>> update api J1
