describe("Pricing page", () => {
  beforeEach(() => {
    cy.visit("/pricing");
  });

  it("shows header and subtitle", () => {
    cy.getByCy("pricing-page").should("exist");
    cy.getByCy("pricing-title").should("contain", "Choose Your Perfect Plan");
    cy.getByCy("pricing-subtitle").should(
      "contain",
      "flexible pricing options"
    );
  });

  it("renders three plans with buttons and features", () => {
    cy.getByCy("pricing-plans")
      .find('[data-cy^="pricing-plan-"]')
      .should("have.length", 3);

    cy.getByCy("pricing-plan-basic").within(() => {
      cy.contains("Basic");
      cy.getByCy("pricing-button-basic").should(
        "have.attr",
        "href",
        "/Auth/register/student"
      );
      cy.getByCy("pricing-features-basic")
        .find("li")
        .should("have.length.at.least", 4);
    });

    cy.getByCy("pricing-plan-premium").within(() => {
      cy.contains("Premium");
      cy.getByCy("pricing-button-premium").should(
        "have.attr",
        "href",
        "/Auth/register/student"
      );
      cy.getByCy("pricing-features-premium")
        .find("li")
        .should("have.length.at.least", 5);
    });

    cy.getByCy("pricing-plan-enterprise").within(() => {
      cy.contains("Enterprise");
      cy.getByCy("pricing-button-enterprise").should(
        "have.attr",
        "href",
        "/contact"
      );
      cy.getByCy("pricing-features-enterprise")
        .find("li")
        .should("have.length.at.least", 5);
    });
  });

  it("shows footer helper link", () => {
    cy.getByCy("pricing-footer").within(() => {
      cy.contains("14-day free trial");
      cy.getByCy("pricing-contact-link").should(
        "have.attr",
        "href",
        "/contact"
      );
    });
  });
});
