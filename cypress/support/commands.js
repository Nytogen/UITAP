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
// Cypress.Commands.add('login', (email, password) => { ... })
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
Cypress.Commands.add("toTest", (testTitle) => {
  cy.visit("http://uitestingplayground.com/");
  cy.contains(testTitle).click();
});

// This command is a modified version of from a github issue
// https://github.com/cypress-io/cypress/issues/877#issuecomment-490504922
Cypress.Commands.add("isNotInViewport", (element) => {
  cy.get(element).then(($el) => {
    const bottom = Cypress.$(cy.state("window")).height();
    const rect = $el[0].getBoundingClientRect();

    /* 
     UI Playground makes the button offscreen by moving the button's x and y-axis by -9999
     Thus we modify to instead of check if the element is above, it's below
     */
    expect(rect.top).to.be.lessThan(bottom);
    expect(rect.bottom).to.be.lessThan(bottom);
    //expect(rect.top).to.be.greaterThan(bottom);
    //expect(rect.bottom).to.be.greaterThan(bottom);
  });
});
