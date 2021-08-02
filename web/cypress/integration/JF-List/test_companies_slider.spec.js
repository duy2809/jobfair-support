describe('Companies slider test',()=>{
      var jflist;
      before(() => {
          cy.request('GET', '/api/jf-list').then((response) => {
              console.log(response.body)
              jflist = response.body;
  
          })
          cy.visit('/jobfairs')
          cy.wait(3000)
      })
  
      it('Companies slider display', () => {
          cy.get('div.space-y-2:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)').should('have.attr','style','left:0%;right:auto;transform:translateX(-50%)')
          cy.get('div.space-y-2:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(5)').should('have.attr','style','left:100%;right:auto;transform:translateX(-50%)')
      })
  
      it('Companies slider', () => {
          for(var i=0;i<91;i++) {
              const slider_atribute = 'left: ' + i + '%; right: auto; transform: translateX(-50%);';
              cy.get('div.space-y-2:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)')
                  .invoke('attr', 'style', slider_atribute).invoke('attr', 'aria-valuenow', i).click()
              var countJF = jflist.reduce((count, jfobject) => {
                  if (jfobject.number_of_companies >= i) count++;
                  if (count > 10) count = 10;
                  return count;
              }, 0)
              
              cy.get('.ant-table-row').should('have.length', countJF)
              if(countJF==0) cy.get('.ant-empty-description').should('contain','該当結果が見つかりませんでした')
          }
          cy.get('div.space-y-2:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(4)')
              .invoke('attr', 'aria-valuenow', i).click()
      })
  })