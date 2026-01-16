describe("Pricing page", () => {
  beforeEach(() => {
    cy.visit("/pricing");
  });

  it("shows pricing page header with title and subtitle", () => {
    cy.getByCy("pricing-page").should("exist");
    cy.getByCy("pricing-title").should("exist").and("not.be.empty");
    cy.getByCy("pricing-subtitle").should("exist").and("not.be.empty");
  });

  it("renders pricing plans with features and buttons", () => {
    cy.getByCy("pricing-plans").should("exist");
    cy.getByCy("pricing-plans")
      .find('[data-cy^="pricing-plan-"]')
      .should("have.length.at.least", 1)
      .each(($plan) => {
        cy.wrap($plan).should("be.visible");
        // Check for price information (either $ or Free)
        cy.wrap($plan).then(($el) => {
          const text = $el.text();
          expect(text).to.satisfy(
            (txt: string) => txt.includes("$") || txt.includes("Free")
          );
        });
      });
  });

  it("has CTA buttons on pricing plans", () => {
    cy.getByCy("pricing-plans")
      .find('[data-cy^="pricing-button-"]')
      .should("have.length.at.least", 1)
      .each(($button) => {
        cy.wrap($button)
          .should("be.visible")
          .and("have.attr", "href")
          .and("not.be.empty");
      });
  });

  it("shows pricing plan features", () => {
    cy.getByCy("pricing-plans")
      .find('[data-cy^="pricing-features-"]')
      .should("have.length.at.least", 1)
      .each(($features) => {
        cy.wrap($features).find("li").should("have.length.at.least", 1);
      });
  });

  it("shows footer with help link", () => {
    cy.getByCy("pricing-footer").should("exist");
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="pricing-contact-link"]').length > 0) {
        cy.getByCy("pricing-contact-link")
          .should("have.attr", "href")
          .and("include", "/contact");
      }
    });
  });
});
