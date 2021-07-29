describe('Search test',()=>{
      var jflist;
      beforeEach(()=>{
          cy.request('GET','/api/jf-list').then((response)=>{
              console.log(response.body)
              jflist=response.body;
  
          })
          cy.visit('/jobfairs')
          cy.wait(3000)
      })
  
      it('JFname Select Search',()=>{
          for(var i=0;i<jflist.length;i++)
          {
              const search_name=jflist[Object.keys(jflist)[i]].name;
              cy.get('#rc_select_0').type(search_name)
              cy.get('div.ant-select-item[aria-selected="true"]').contains(search_name,{matchCase:true}).click()
              var countJF=jflist.reduce((count,jfobject)=>{
                  if(jfobject.name.includes(search_name)) 
                  {
                      console.log(search_name+jfobject.name+ count)
                      count++;
                  }
                  return count;
              },0)
              cy.get('.ant-table-row').should('have.length',countJF)
  
              cy.get('#rc_select_0').clear()
          }
          
      })
  
      it('JFname type Search',()=>{
          for(var i=0;i<jflist.length;i++)
          {
              const search_name=jflist[Object.keys(jflist)[i]].name;
              cy.get('#rc_select_0').type(search_name+ '{enter}')
              var countJF=jflist.reduce((count,jfobject)=>{
                  if(jfobject.name.includes(search_name)) 
                  {
                      console.log(search_name+jfobject.name+ count)
                      count++;
                  }
                  return count;
              },0)
              cy.get('.ant-table-row').should('have.length',countJF)
  
              cy.get('#rc_select_0').clear()
          }
          
      })
  
      it('Admin Select Search',()=>{
          for(var i=0;i<jflist.length;i++)
          {
              const search_name=jflist[Object.keys(jflist)[i]].admin;
              cy.get('#rc_select_0').type(search_name)
              cy.get('div.ant-select-item[aria-selected="true"]').contains(search_name,{matchCase:true}).click()
              var countJF=jflist.reduce((count,jfobject)=>{
                  if(jfobject.admin.includes(search_name)) 
                  {
                      console.log(search_name+jfobject.admin+ count)
                      count++;
                  }
                  return count;
              },0)
              cy.get('.ant-table-row').should('have.length',countJF)
  
              cy.get('#rc_select_0').clear()
          }
          
      })
  
      it('Admin type Search',()=>{
          for(var i=0;i<jflist.length;i++)
          {
              const search_name=jflist[Object.keys(jflist)[i]].admin;
              cy.get('#rc_select_0').type(search_name+'{enter}')
              var countJF=jflist.reduce((count,jfobject)=>{
                  if(jfobject.admin.includes(search_name)) 
                  {
                      console.log(search_name+jfobject.admin+ count)
                      count++;
                  }
                  return count;
              },0)
              cy.get('.ant-table-row').should('have.length',countJF)
  
              cy.get('#rc_select_0').clear()
          }
          
      })  
  })