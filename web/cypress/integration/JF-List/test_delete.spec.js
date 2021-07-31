describe('Test delete jobfair', () => {
    var jflist;
    beforeEach(() => {
        cy.request('GET', '/api/jf-list').then((response) => {
            console.log(response.body)
            jflist = response.body;

        })
        cy.visit('/jobfairs')
    })
    it('click icon delete ', () => {
        var index = Math.floor((Math.random() * 15) % 10)
        if (jflist.length < 10) {
            Math.floor((Math.random() * 15) % jflist.length)
        }
        var rowDetele = jflist[index]
        cy.get('.anticon-delete').eq(index).as('iconDelete');
        cy.get('@iconDelete').click()
        cy.get('.ant-modal-body').contains('削除してもよろしいですか？')
        cy.get('.ant-btn').contains('いいえ').as('NO')
        cy.get('.ant-btn').contains('はい').as('YES')
    })

    it('select いいえ', () => {
        var index = Math.floor((Math.random() * 15) % 10)
        var rowDetele = jflist[index]
        cy.get('.anticon-delete').eq(index).as('iconDelete');
        cy.get('@iconDelete').click()
        cy.get('.ant-btn').contains('いいえ').as('NO')
        cy.get('@NO').click();
        cy.get('.ant-table-cell-ellipsis').contains(rowDetele.name).should('exist')
    })

    it('select はい', () => {
        var index = Math.floor((Math.random() * 15) % 10)
        var rowDetele = jflist[index]
        cy.get('.anticon-delete').eq(index).as('iconDelete');
        cy.get('@iconDelete').click()
        cy.get('.ant-btn').contains('はい').as('YES')
        cy.get('@YES').click();
        cy.get('.ant-notification-topRight').contains('正常に削除')
        cy.get('.ant-table-cell-ellipsis').contains(rowDetele.name).should('not.exist')
    })

})