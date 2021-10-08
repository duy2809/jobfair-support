const { find } = require("lodash")
import Color from 'color'

const color_1 = Color('#5eb5a6').string()
const color_2 = Color('#a1af2f').string()
const color_3 = Color('#4488c5').string()
const color_4 = Color('#b95656').string()
const color_5 = Color('#795617').string()
describe('Check gantt chart part 2', () => {
    const id = 3
    let tasks
    context('Check gantt chart', () => {
        it('Visit gantt chart', () => {
            cy.request('GET', '/api/web-init').then((response) => {
                const str = response.headers['set-cookie'][0]
                const token = `${str.replace('XSRF-TOKEN=', '').replace(/%3[Dd].*/g, '')}==`
                cy.request({
                    method: 'POST',
                    url: '/api/login',
                    headers: {
                        'X-XSRF-TOKEN': token,
                    },
                    body: {
                        email: 'jobfair@sun-asterisk.com',
                        password: '12345678',
                    },
                })
            })
            cy.visit(`/gantt-chart/${id}`)
            
        })

        it('Check button 今日', () => {
            cy.get('button > span').contains('今 日')
            cy.wait(3000)
            cy.get('.col-span-12').find('button').click()
        })
        
        it('Check button JF一覧', () => {
            cy.get('button > span').contains('JF一覧')
            cy.get('.ant-row > div').find('button').click()
            cy.url().should('include', '/jobfairs')
        })

        it('Check gantt chart', () => {
            cy.visit(`/gantt-chart/${id}`)
            cy.wait(3000)

            cy.request('GET', `http://jobfair.local:8000/api/jobfair/${id}/tasks`).then((response) => {
                tasks = response.body.schedule.tasks
                // tasks.sort(function(a,b){
                //     return new Date(a.end_time) - new Date(b.end_time);
                //   });
                const length = response.body.schedule.tasks.length
                cy.get('.gantt_grid_data').find('.gantt_row').its('length').should('eq', length)
                cy.wrap(tasks).each((task) => {
                    if(task.status == '未着手'){
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'style', `background-color: ${color_1}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `date: ${task.start_time}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `End date: ${task.end_time}`)
                        
                    }
                    if(task.status == '進行中'){
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'style', `background-color: ${color_2}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `date: ${task.start_time}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `End date: ${task.end_time}`)
                    }
                    if(task.status == '完了'){
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'style', `background-color: ${color_3}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `date: ${task.start_time}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `End date: ${task.end_time}`)
                    }
                    if(task.status == '中断'){
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'style', `background-color: ${color_4}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `date: ${task.start_time}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `End date: ${task.end_time}`)
                    }
                    if(task.status == '未完了'){
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'style', `background-color: ${color_5}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `date: ${task.start_time}`)
                        cy.get('.gantt_bars_area').find('.gantt_task_content').should('be.exist', task.name).invoke('attr', 'aria-label', `End date: ${task.end_time}`)
                    }
                    
                })
            })
            // cy.request('GET', `http://jobfair.local:8000/api/jobfair/${id}`).then((res) => {
            //     const start_date = res.body.start_date

            // })
            cy.get('div').invoke('attr', 'data-marker-id')
            cy.get('.scrollHor_cell')
        })
        
    })
})