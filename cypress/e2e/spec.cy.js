const { assert } = require("chai");

describe("template spec", () => {
  it("Row 1", () => {
    /* Dynamic ID */
    cy.toTest("Dynamic ID");
    cy.contains(/Button with dynamic ID/i)
      .click()
      .should("exist");

    /* Class Attribute */
    const stub = cy.stub();
    cy.on("window:alert", stub);

    cy.toTest("Class Attribute");
    cy.get(".btn-primary")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Primary button pressed");
      })
      .should("exist");

    /* Hidden Element */
    cy.toTest("Hidden Layers");

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
        cy.get('[style="z-index: 2;"]').get("#blueButton").should("exist");
        cy.get('[style="z-index: 1;"]').get("#greenButton");
      });

    /* Load Delay */
    cy.toTest("Load Delay");
    cy.contains(/Button Appearing After Delay/i).click();
  });

  it("Row 2", () => {
    /* AJAX Data */
    cy.toTest("AJAX Data");
    cy.intercept("GET", "/ajaxdata").as("ajaxRequest");
    cy.contains(/Button Triggering AJAX Request/i).click();
    cy.wait("@ajaxRequest");
    cy.contains("Data loaded with AJAX get request.").should("exist");

    //Client Side Delay
    cy.toTest("Client Side Delay");
    cy.contains(/Button Triggering Client Side Logic/i).click();

    /*
    Because of how Cypress deals with waiting and timeouts there isn't a way I currently see
    to dynamically wait for a client delay 
    */
    cy.wait(15000);

    cy.contains("Data calculated on the client side.").should("exist");

    /* Click */
    cy.toTest("Click");

    cy.contains(/Button That Ignores DOM Click Event/i)
      .click()
      .should("exist");
    cy.contains(/Button That Ignores DOM Click Event/i)
      .click()
      .should("exist");

    /* Text Input */
    cy.toTest("Text Input");
    cy.get("input").type("Text Input Button");
    cy.contains(
      "Button That Should Change it's Name Based on Input Value"
    ).click();
    cy.contains("Text Input Button").click().should("exist");
  });

  it("Row 3", () => {
    /* Scrollbars */
    cy.toTest("Scrollbars");

    //Cypress will already scroll into view before clicking
    cy.contains("Hiding Button").click();

    //Cypress says it works but when you view the test the placed clicked is not on the button
    cy.contains("Hiding Button").scrollIntoView().click().should("exist");

    /* Dynamic Tables */
    cy.toTest("Dynamic Table");

    let cpuIndex;
    cy.get("div [role='table']").within(() => {
      cy.get("[role='rowgroup']")
        .first()
        .get("[role='columnheader']")
        .each(($el, index) => {
          if ("CPU" === $el[0].textContent) {
            cpuIndex = index;
          }
        });
    });

    let cpuText = "placeholder";
    cy.get("div[role='table']").within(() => {
      cy.get("[role='rowgroup']")
        .last()
        .contains("Chrome")
        .parent()
        .within(() => {
          cy.get("span").each(($el, index) => {
            if (index == cpuIndex) {
              cpuText = "Chrome CPU: " + $el[0].textContent;
              /*
              String references within cypress have an interesting behavior
              if you assign a variable to the contents of an element then will reverse back 
              once the cy call is fully done, this is not the case for ints

              Thus my solution is to continue the cy chain, go up to the parent elements and go
              back down in the dom to compare the two texts
              */
            }
          });
        })
        .parentsUntil("section")
        .then(($el) => {
          let chromeTest =
            $el[2].getElementsByClassName("bg-warning")[0].textContent;
          expect(cpuText === chromeTest).to.be.true;
        });
    });

    /* Verify Text */
    cy.toTest("Verify Text");
    cy.contains("Playground")
      .next()
      .within(() => {
        cy.contains("Welcome UserName!").parent().should("exist");
      });

    /* Progress Bar */
    cy.toTest("Progress Bar");
    cy.get("button[onclick='Start()']").click();
    //Test will wait 10 MINUTES for the progress bar to reach 75%
    cy.get(".progress-bar").contains("75%", { timeout: 600000 });
    cy.get("button[onclick='Stop()']").click();

    cy.contains("Result: 0,").should("exist");
  });

  it("Row 4", () => {
    /* Visibility */
    cy.toTest("Visibility");

    cy.get("button#removedButton").should("be.visible");
    cy.get("button#zeroWidthButton").should("be.visible");
    cy.get("button#overlappedButton").should("be.visible");
    cy.get("button#transparentButton").should("be.visible");
    cy.get("button#invisibleButton").should("be.visible");
    cy.get("button#notdisplayedButton").should("be.visible");
    cy.get("button#offscreenButton").should("be.visible");

    cy.get("button#hideButton").click();

    cy.get("button#removedButton").should("not.exist");
    cy.get("button#zeroWidthButton").should("not.be.visible");

    //This snippet was taken from
    //https://glebbahmutov.com/cypress-examples/recipes/overlapping-elements.html
    const areOverlapping = (rect1, rect2) => {
      // if one rectangle is on the left side of the other
      if (rect1.right < rect2.left || rect2.right < rect1.left) {
        return false;
      }

      // if one rectangle is above the other
      if (rect1.bottom < rect2.top || rect2.bottom < rect1.top) {
        return false;
      }

      // the rectangles must overlap
      return true;
    };
    cy.get("#overlappedButton").then(($button) => {
      cy.get("#hidingLayer").then(($hidingLayer) => {
        expect(areOverlapping($hidingLayer, $button)).to.be.true;
      });
    });

    cy.get("button#transparentButton").should("not.be.visible");
    cy.get("button#invisibleButton").should("not.be.visible");
    cy.get("button#notdisplayedButton").should("not.be.visible");
    cy.isNotInViewport("button#offscreenButton");

    /* Sample App */
    cy.toTest("Sample App");

    cy.contains("User logged out.").should("be.visible");

    cy.get("input[type='text']").as("userName");
    cy.get("input[type='password']").as("password");
    cy.get("button#login").as("submit");

    //Empty fields
    cy.get("@submit").click();
    cy.contains("Invalid username/password").should("be.visible");

    //Valid login
    cy.get("@userName").type("userOne");
    cy.get("@password").type("pwd");
    cy.get("@submit").click();
    cy.contains("Welcome, userOne!").should("be.visible");

    //Logout
    cy.get("@submit").click();
    cy.contains("User logged out.").should("be.visible");

    //Wrong password
    cy.get("@userName").type("userOne");
    cy.get("@password").type("pwd2");
    cy.get("@submit").click();
    cy.contains("Invalid username/password").should("be.visible");

    /* Mouse Over*/
    cy.toTest("Mouse Over");

    cy.get("a.text-primary[title='Click me']").click();
    cy.get("a.text-warning[title='Active Link']").click();

    cy.contains("The link above clicked 2 times.");

    cy.get("a.text-primary[title='Link Button']").click();
    cy.get("a.text-warning[title='Link Button']").click();
    cy.get("a.text-warning[title='Link Button']").click();
    cy.get("a.text-warning[title='Link Button']").click();

    cy.contains("The link above clicked 4 times.");

    /* Non-Breaking Space */
    cy.toTest("Non-Breaking Space");

    //Cypress treats nbsp as a standard space
    cy.contains(/^My Button$/).click();
  });

  it("row 5", () => {
    /* Overlapped Element */
    cy.toTest("Overlapped Element");

    cy.get("input#name").type("Placeholder Name");
    cy.get("input#name").should("have.value", "Placeholder Name");

    /* Shadow DOM */
    cy.toTest("Shadow DOM");

    cy.get("guid-generator").shadow().find("button#buttonGenerate").click();

    //Unable to copy since the site is in HTTP -> its unsecure
    //cy.get("guid-generator").shadow().find("#buttonCopy").click();

    //Instead we will check that something was generated
    cy.get("guid-generator")
      .shadow()
      .find("input#editField")
      .then(($el) => {
        expect($el[0].value != "").to.be.true;
      });
  });
});
