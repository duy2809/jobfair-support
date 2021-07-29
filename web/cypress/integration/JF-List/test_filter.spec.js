describe('Filter test',()=>{
    var jflist;
    beforeEach(()=>{
        cy.request('GET','/api/jf-list').then((response)=>{
            console.log(response.body)
            jflist=response.body;

        })
        cy.visit('/jobfairs')
        cy.wait(3000)
    })
    it('Calendar and Mixed filter test',()=>{
        for(var i=0;i<10;i++)
        {
            
            const firstday=jflist[Object.keys(jflist)[i]].start_date;
            const formatted_day=firstday.split("-");
            
            cy.get('.ant-picker-input > input:nth-child(1)').type(formatted_day[0]+'/'+formatted_day[1]+'/'+formatted_day[2]+'{enter}',{force: true})
            var countJF=jflist.reduce((count,jfobject)=>{
                if(jfobject.start_date===firstday) 
                {
                    count++;
                    //cy.get('.ant-table-row').should('contain',jfobject.name)
                }
                if(count>10) count=10;
                return count;
            },0)
            cy.get('.ant-table-row').should('have.length',countJF)
            cy.get('button.ant-btn:nth-child(1)').click()
            cy.wait(1000)
            cy.get('.ant-table-row').should('have.length',countJF)
            cy.get('button.ant-btn:nth-child(2)').click()
            cy.wait(1000)



            const minStudents=jflist.reduce((min,jfobject)=>{
                if(min>jfobject.number_of_students&&jfobject.start_date===firstday) min=jfobject.number_of_students;
                return min
            },100)
            var slider_atribute='left: '+minStudents+ '%; right: auto; transform: translateX(-50%);';
            var bar_attribute='left: '+minStudents+'%; right: auto; width: '+100-minStudents+'%;';
            cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style',slider_atribute).invoke('attr','aria-valuenow',minStudents).click()

            cy.get('.ant-table-row').should('have.length',countJF)
            cy.get('button.ant-btn:nth-child(1)').click()
            cy.wait(1000)
            cy.get('.ant-table-row').should('have.length',countJF)
            cy.get('button.ant-btn:nth-child(2)').click()
            cy.wait(1000)


            const maxStudents=jflist.reduce((max,jfobject)=>{
                if(max<jfobject.number_of_students&&jfobject.start_date===firstday) max=jfobject.number_of_students;
                if(max>90) return 90;
                return max
            },0)

            
            slider_atribute='left: '+maxStudents+ '%; right: auto; transform: translateX(-50%);';
            bar_attribute='left: '+maxStudents+'%; right: auto; width: '+100-maxStudents+'%;';
            
            if(maxStudents>50) cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style','left: 50%; right: auto; transform: translateX(-50%);').invoke('attr','aria-valuenow','50').click() 
            if(maxStudents>75) cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style','left: 75%; right: auto; transform: translateX(-50%);').invoke('attr','aria-valuenow','75').click() 
            if(maxStudents>87) cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style','left: 87%; right: auto; transform: translateX(-50%);').invoke('attr','aria-valuenow','87').click() 
            cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style',slider_atribute).invoke('attr','aria-valuenow',maxStudents).click()
    
            countJF=jflist.reduce((count,jfobject)=>{
                if(jfobject.start_date===firstday&&jfobject.number_of_students>=maxStudents) 
                {
                    count++;
                    //cy.get('.ant-table-row').should('contain',jfobject.name)
                }
                if(count>10) count=10;
                return count;
            },0)

            cy.get('.ant-table-row').should('have.length',countJF)
            cy.get('button.ant-btn:nth-child(1)').click()
            cy.wait(1000)
            cy.get('.ant-table-row').should('have.length',countJF)
            cy.get('button.ant-btn:nth-child(2)').click()
            cy.wait(1000)
            cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style','left: 0%; right: auto; transform: translateX(-50%);').click()
            cy.get('.ant-picker-input > input:nth-child(1)').clear({force: true})
        }   
    
    
    
    })
    it('students slider test',()=>{
        for(var i=1;i<10;i++)
        {
            const slider_atribute='left: '+i*10+ '%; right: auto; transform: translateX(-50%);';
            var countJF=jflist.reduce((count,jfobject)=>{
                if(jfobject.number_of_students>=i*10) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style',slider_atribute).invoke('attr','aria-valuenow',i*10).click()
            cy.get('.ant-table-row').should('have.length',countJF)
        }
        cy.get('div.filter:nth-child(4) > div:nth-child(2) > div:nth-child(4)').invoke('attr','aria-valuenow',i*10).click()
    })
    it('companies slider test',()=>{
        for(var i=1;i<10;i++)
        {
            const slider_atribute='left: '+i*10+ '%; right: auto; transform: translateX(-50%);';
            var countJF=jflist.reduce((count,jfobject)=>{
                if(jfobject.number_of_companies>=i*10) count++;
                if(count>10) count=10;
                return count;
            },0)
            cy.get('div.filter:nth-child(5) > div:nth-child(2) > div:nth-child(4)').invoke('attr','style',slider_atribute).invoke('attr','aria-valuenow',i*10).click()
            cy.get('.ant-table-row').should('have.length',countJF)
        }
        cy.get('div.filter:nth-child(5) > div:nth-child(2) > div:nth-child(4)').invoke('attr','aria-valuenow',i*10).click()
    })
    

})