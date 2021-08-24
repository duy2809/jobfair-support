const { expect } = require("chai");
const { functionsIn } = require("cypress/types/lodash");
const { it } = require("mocha");
// import "@4tw/cypress-drag-drop";

describe('Check website', function () {
    it('Visits Kanban', function () {
      cy.visit('http://jobfair.local:8000/kanban/1');
    });
  
    it('check title'),
      () => {
        cy.get('h1').contains('カンバン').should('be.visible');
      };
  
    it('Check all columns', function () {
      cy.get('.container__column').should('have.length', 5);
    });
  });
  
  describe('Check columns', function () {
    it('column name', function () {
      const columnItems = ['未着手', '進行中', '完了', '中断', '未完了'];
      cy.get('.container__column').each((item, index, list) => {
        expect(Cypress.$(item).text()).contains(columnItems[index]);
      });
    });
    //update
    it('Get data',function(){
      cy.request({
        method: 'GET',
        url : ''
      }).then(function(response){     //should((response)=>{})
        cy.log(JSON.stringify(response.body));
        // cy.location().its('href').
        // expect().to.eq.(response.body.jobfairName)
        // expect().to.eq.(response.body.jobfairName)
      })
    })
    //end update

    it('column length', function () {
      cy.get('.未着手')
        .children('.container__column--task')
        .its('length')
        .should('eq', 5);
      cy.get('.進行中')
        .children('.container__column--task')
        .its('length')
        .should('eq', 1);
      cy.get('.完了')
        .children('.container__column--task')
        .its('length')
        .should('eq', 1);
      cy.get('.中断')
        .children('.container__column--task')
        .its('length')
        .should('eq', 1);
      cy.get('.未完了')
        .children('.container__column--task')
        .its('length')
        .should('eq', 2);
    });
  });
  
  describe('Check cards', function () {
    it('card info', function () {
      cy.get('.ant-card').should('be.visible');
      cy.get('.ant-card').each(() => {
        cy.get('.text-lg').should('be.visible');
        cy.get('.ant-avatar').should('be.visible');
        cy.get('.anticon-calendar').should('be.visible');
        cy.get('.anticon-link').should('be.visible');
      });
      cy.get('.memo--中断').contains('メモ').should('be.visible');
      cy.get('.ant-card__bordered--中断 > .ant-card-body .ant-btn')
        .contains('問 題')
        .should('be.visible');
    });
    it('ard color', function () {
      cy.get('.ant-card__bordered--未着手').should(
        'have.css',
        'border-left',
        '4px solid rgb(94, 181, 166)'
      );
      cy.get('.ant-card__bordered--進行中').should(
        'have.css',
        'border-left',
        '4px solid rgb(161, 175, 47)'
      );
      cy.get('.ant-card__bordered--完了').should(
        'have.css',
        'border-left',
        '4px solid rgb(68, 136, 197)'
      );
      cy.get('.ant-card__bordered--中断').should(
        'have.css',
        'border-left',
        '4px solid rgb(185, 86, 86)'
      );
      cy.get('.ant-card__bordered--未完了').should(
        'have.css',
        'border-left',
        '4px solid rgb(121, 86, 23)'
      );
    });
  });
  
  describe('Check active', function () {
    it('task details', function () {
      cy.get('.ant-card-body a').click({ multiple: true });
      cy.url().should('include', '/tasks');
    });

      it('drag and drop', function(){
        const dataTransfer = new DataTransfer();
        cy.vist("https://www.seleniumeasy.com/test/drag-and-drop-demo.html");
        cy.get('#todrag>span:nth-child(2)').trigger('dragstart', {dataTransfer});
        cy.get('#mydropzone').trigger('drop', {dataTransfer});
        cy.get('#todrag>span:nth-child(2)').trigger('dragend');        
        cy.get('#droppedlist span').contains('Draggable 1').should('be.visible');
      })     
  });
  