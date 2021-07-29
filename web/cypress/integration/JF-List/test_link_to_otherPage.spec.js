describe('Test link to other Page',()=>{
      var jflist;
      beforeEach(()=>{
          cy.request('GET','/api/jf-list').then((response)=>{
              console.log(response.body)
              jflist=response.body;
  
          })
          cy.visit('/jobfairs')
      })

      it('check link of icon edit', () => {
            var index = Math.floor((Math.random()*15) % jflist.length)
            cy.get('.anticon-edit').eq(index).click()
            cy.url().should('include', '/edit-jf/' + jflist[index].id)
      })
      it('check link of button add JF', () => {
          cy.get('.ant-btn').contains('JF追加').click()
          cy.url().should('include', '/add-jobfair')
      })
      it('check link of JF Name', () => {
            var index = Math.floor((Math.random()*15) % jflist.length)
            cy.get('[title="'+ jflist[index].name +'"]').contains(jflist[index].name).click()
            cy.url().should('include', '/jf-toppage/' + jflist[index].id)
      })
})