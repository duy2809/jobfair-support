const expectTextColor = 'rgb(45, 51, 74)' // #2d334a
const columns = ['No.', 'フルネーム', 'メールアドレス', '参加日']
const role = 'admin'
describe('List Member Test', () => {
    context('Index Page', () => {
        it('visit', () => {
            cy.visit('/member')
        })

        // Check component show
        it('check logo', () => {
            cy.get('img').should('have.attr', 'alt')
        })
        it('check title', () => {
            cy.get('.title').contains('メンバ一覧').should('have.css', 'color', expectTextColor)
        })
        it('check label', () => {
            cy.get('span.text-xl').contains('表示件数')
        })
    
        // Check input search
        it('check input search', () => {
            cy.get('input[placeholder*="探索"]')
            cy.get('[data-icon="search"]')
        })

        // Check select
        it('click select', () => {
            cy.get('.ant-select').click()
            cy.get('.ant-select-selector').should('be.visible')
        })

        // Check button
        it('check button', () => {
            if (role == 'admin') {
                cy.get('.ant-btn').should('contain', 'メンバー招待')
            }
        })

        // Check pagination
        it('check pagination', () => {
            cy.get('.ant-pagination')
        })

        // Check table
        it('check table has column', () => {
            cy.get('.ant-table-wrapper')
            cy.get('.ant-table-wrapper').get('th').each((ele, index) => {
                expect(ele.text()).to.equal(columns[index])
            })
        })

        // ----- Check action ------
        // Check button invite click
        it('check button invite click', () => {
            cy.get('.ant-btn').should('contain', 'メンバー招待').click()
            cy.url().should('include', 'member/invite')
        })

        // Check search action
        it('check search action', () => {
            
        })
    })
})