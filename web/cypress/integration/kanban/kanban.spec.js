// const { expect } = require("chai");
// const { functionsIn } = require("cypress/types/lodash");
// const { it } = require("mocha");
// import "@4tw/cypress-drag-drop";

describe('Check kanban', function () {
  const id = Math.floor(Math.random() * 3) + 1
  var total = 0
  var jobfair = []
  before(() => {
    // Get information
    cy.request('GET', `/api/kanban/${id}`).then((res) => {
      cy.wrap(res.body).as('data')
      cy.get('@data').then((data) => {
        total = data.length
        jobfair = data
      })
    })
  })
  beforeEach(() => {
    cy.loginAs('superadmin')
    cy.visit(`/kanban/${id}`)
  })
    
    it('Check title'),
      () => {
        cy.get('h1').contains(jobfair[0].jobfairName).should('be','visible')
        cy.get('h1').contains('カンバン').should('be.visible');
      };
  
    it('Check all columns', function () {
      cy.get('.container__column').should('have.length', 5);
    });
  
  
    it('Check column name', function () {
      const columnItems = ['未着手', '進行中', '完了', '中断', '未完了'];
      cy.get('.container__column').each((item, index, list) => {
        expect(Cypress.$(item).text()).contains(columnItems[index]);
      });
    });

    it('Check column length', function () {
      cy.get('.未着手')
        .then(($未着手)=>{
          const length = $未着手.children('.container__column--task').its('length');
          cy.get('.container__column>h3').eq(0).should('include',length);
        })
      cy.get('.進行中')
        .then(($進行中)=>{
          const length = $進行中.children('.container__column--task').its('length');
          cy.get('.container__column>h3').eq(1).should('include',length);
        })
      cy.get('.完了')
        .then(($完了)=>{
          const length = $完了.children('.container__column--task').its('length');
          cy.get('.container__column>h3').eq(2).should('include',length);
        })
      cy.get('.中断')
        .then(($中断)=>{
          const length = $中断.children('.container__column--task').its('length');
          cy.get('.container__column>h3').eq(3).should('include',length);
        })
      cy.get('.未完了')
        .then(($未完了)=>{
          const length = $未完了.children('.container__column--task').its('length');
          cy.get('.container__column>h3').eq(4).should('include',length);
        })
    });
  
    it('card info', function () {
      cy.get('.ant-card').should('be.visible');
      cy.get('.ant-card').each(() => {
        cy.get('.text-lg').should('be.visible');
        cy.get('.ant-avatar').should('be.visible');
        cy.get('.anticon-calendar').should('be.visible');
        cy.get('.anticon-link').should('be.visible');
      });
      cy.get('.memo--進行中').contains('メモ').should('be.visible');
      cy.get('.ant-card__bordered--中断 > .ant-card-body .ant-btn')
        .contains('問 題')
        .should('be.visible');
    });
    it('Check card color', function () {
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
 
    it('Check task detail', function () {
      cy.get('.ant-card-body a').click({ multiple: true });
      cy.url().should('include', '/task-detail');
      cy.go('back')
    });

    it('spending to in progress', function(){
        const dataTransfer = new DataTransfer();
        cy.get('.中断:nth-child(1)').trigger('dragstart', {dataTransfer});
        cy.get('.進行中').trigger('drop', {dataTransfer});
        cy.get('.中断:nth-child(1').trigger('dragend');  
        cy.get('.進行中:nth-child(1) button').contains('問 題').should('not.be.visible');
    }) 
    
    
});
  
  
