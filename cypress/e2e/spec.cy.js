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

  it("Row 2, Long Waits", () => {
    //AJAX Data
    cy.visit("http://uitestingplayground.com/");
    cy.contains("AJAX Data").click();
    cy.intercept("GET", "/ajaxdata").as("ajaxRequest");
    cy.contains(/Button Triggering AJAX Request/i).click();
    cy.wait("@ajaxRequest");
    cy.contains("Data loaded with AJAX get request.");

    //Client Side Delay
    cy.visit("http://uitestingplayground.com/");
    cy.contains("Client Side Delay").click();
    cy.contains(/Button Triggering Client Side Logic/i).click();

    /*
    Because of how Cypress deals with waiting and timeouts there isn't a way I currently see
    to dynamically wait for a client delay 
    */
    cy.wait(15000);

    cy.contains("Data calculated on the client side.");
  });

  it.only("Rest of Row 2", () => {
    //Click
    cy.visit("http://uitestingplayground.com/");
    cy.contains("Click").click();
    cy.contains(/Button That Ignores DOM Click Event/i).click();
    cy.contains(/Button That Ignores DOM Click Event/i).click();
  });
});
