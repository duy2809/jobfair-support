// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
/**
 * Login as role with configured account in cypress.json file
 *
 * @param  string role - accept: 'superadmin', 'admin', 'member'
 */
// import "@4tw/cypress-drag-drop"
Cypress.Commands.add('loginAs', (role) => {
  let auth = {}
  switch (role) {
    case 'superadmin':
      auth = Cypress.env('roles').superadmin
      break
    case 'admin':
      auth = Cypress.env('roles').admin
      break
    case 'member':
      auth = Cypress.env('roles').member
      break
    default:
      break
  }
  cy.request('GET', '/login').then((response) => {
    let str = response.headers['set-cookie'][0]
    let token = str.replace('XSRF-TOKEN=', '').replace(/%3[Dd].*/g, '') + '=='
    cy.request({
      method: 'POST',
      url: '/api/login',
      headers: {
        'X-XSRF-TOKEN': token
      },
      body: {
        email: auth.email,
        password: auth.password
      }
    })
  })
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-file-upload'
//For Cypress drag and drop custom command
//For Cypress drag and drop plugin
require('@4tw/cypress-drag-drop')
Cypress.Commands.add('draganddrop', (dragSelector, dropSelector) => {
  cy.get(dragSelector).should('exist')
      .get(dropSelector).should('exist');

  const draggable = Cypress.$(dragSelector)[0]; // Pick up this
  const droppable = Cypress.$(dropSelector)[0]; // Drop over this

  const coords = droppable.getBoundingClientRect()
  draggable.dispatchEvent(new MouseEvent('mousedown'));
  draggable.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 0 }));
  draggable.dispatchEvent(new MouseEvent('mousemove', {
      clientX: coords.left + 10,
      clientY: coords.top + 10  // A few extra pixels to get the ordering right
  }));
  draggable.dispatchEvent(new MouseEvent('mouseup'));
  return cy.get(dropSelector);
})