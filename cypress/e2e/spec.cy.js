describe("template spec", () => {
  it("Row 1", () => {
    //Dynamic ID
    cy.visit("http://uitestingplayground.com/");
    cy.contains("Dynamic ID").click();
    cy.contains(/Button with dynamic ID/i).click();

    //Class Attribute
    const stub = cy.stub();
    cy.on("window:alert", stub);

    cy.visit("http://uitestingplayground.com/");
    cy.contains("Class Attribute").click();
    cy.get(".btn-primary")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Primary button pressed");
      });

    //Hidden Element
    cy.visit("http://uitestingplayground.com/");
    cy.contains("Hidden Layers").click();

    cy.get("#greenButton").should("be.visible");
    cy.get("#greenButton").click();
    cy.contains("Playground")
      .next()
      .within(() => {
        /*
          Because Cypress treats elements blocked by other elements as an error when trying to interact with them 
          and with how Cypress determines if an element is hidden z-index to check for blocking elements

          z-index of higher number will cover z-index of lower numbers, this is used as a proxy to check if 
          the greenbutton cannot be clicked anymore after it's clicked once
        */
        cy.get('[style="z-index: 2;"]').get("#blueButton");
        cy.get('[style="z-index: 1;"]').get("#greenButton");
      });

    //Load Delay
    cy.visit("http://uitestingplayground.com/");
    cy.contains("Load Delay").click();
    cy.contains(/Button Appearing After Delay/i).click();
  });
});
