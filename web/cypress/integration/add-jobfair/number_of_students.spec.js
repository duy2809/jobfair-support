describe('推定参加学生数 test',()=>{
    before(()=>{
        cy.visit('http://jobfair.local:8000/add-jobfair')
    })
    it('Base number',()=>{
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)').click()
        cy.get('#number_of_students').should('have.attr','aria-valuenow','1')
    })

    it('Increase by 1 button',()=>{
        for(var i=0;i<5;i++){
            cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)').click()
        }
            
        cy.get('#number_of_students').should('have.attr','aria-valuenow','6')
    })

    it('Decrease by 1 button',()=>{
        cy.get('#number_of_students').type('10')
        for(var i=0;i<5;i++){
            cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2)').click()
        }
            
        cy.get('#number_of_students').should('have.attr','aria-valuenow','605')
    })

    it('Emty field',()=>{
        for(var i=0;i<5;i++){
            cy.get('#number_of_students').type('{backspace}')        
        }
        cy.get('div.ant-row:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)').should('contain','この項目は必須です')
    })

})