describe('Display test',()=>{
    before(()=>{
        cy.visit('http://jobfair.local:8000/add-jobfair')
    })
    it('Check Header',()=>{
        cy.get('h1').should('contain','JF追加')
    })
    it('Check JF名 display',()=>{
        cy.get('#name').should('be.visible')
        cy.get('label[for="name"]').should('be.visible')
          
    })

    it('Check 開始日 Display',()=>{
        cy.get('#start_date').should('be.visible')
        cy.get('label[for="start_date"]').should('be.visible')
        cy.get('#start_date').click()
        cy.get('.ant-picker-dropdown.ant-picker-dropdown-placement-bottomLeft').should('be.exist')
        cy.get('label[for="name"]').click()
    })

    it('Check 参加企業社数 Display',()=>{
        cy.get('#number_of_companies').should('be.visible')
        cy.get('label[for="number_of_companies"]').should('be.visible')    
        cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').invoke('show').click().should('be.exist')
        for(var i=0;i<5;i++){
        cy.get('div.ant-row:nth-child(3) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)').click()
        }
        cy.get('label[for="name"]').click()
    })

    it('Check 推定参加学生数 Display',()=>{
        cy.get('#number_of_students').should('be.visible')
        cy.get('label[for="number_of_students"]').should('be.visible')
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').invoke('show').click().should('be.exist')
        for(var i=0;i<5;i++){
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)').click()
        }
        cy.get('label[for="name"]').click()
    })

    it('Check 管理者 Display',()=>{
        cy.get('#jobfair_admin_id').should('be.exist')
        cy.get('label[for="jobfair_admin_id"]').should('be.visible')
        cy.get('.rc-virtual-list').should('not.be.exist')
        cy.get('#jobfair_admin_id').click()
        cy.wait(500)
        cy.get('.rc-virtual-list').should('be.visible')
        cy.get('label[for="name"]').click()
    })

    it('Check JF-スケジュール Display',()=>{
        cy.get('#schedule_id').should('be.exist')
        cy.get('label[for="schedule_id"]').should('be.visible')
        cy.get('#schedule_id').click()
        cy.wait(500)
        cy.get('div.ant-row:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').should('be.visible')
        cy.get('label[for="name"]').click()
    })
    
    it('Check マイルストーン一覧 Display',()=>{
        cy.get('div.ant-row:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').should('contain','マイルストーン一覧')
        cy.get('div.ant-row:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').should('be.visible')
        cy.get('label[for="name"]').click()
    })

    it('Check タスク一賜 Display',()=>{
        cy.get('div.ant-row:nth-child(8) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)').should('contain','タスク一賜')
        cy.get('div.ant-row:nth-child(8) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)').should('be.visible')
        cy.get('label[for="name"]').click()
    })

    it('Check Button キャンセル Display',()=>{
        cy.get('div.ant-space-item:nth-child(1) > button:nth-child(1)').should('contain','キャンセル')
    })

    it('Check Button 登 録 Display',()=>{
        cy.get('.ant-btn-primary').should('contain','登 録')
    })
    
})