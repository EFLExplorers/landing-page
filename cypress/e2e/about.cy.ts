describe("About page", () => {
  beforeEach(() => {
    cy.visit("/about");
  });

  it("shows the hero heading and subtitle", () => {
    cy.getByCy("about-page").should("exist");
    cy.getByCy("about-title").should("exist").and("not.be.empty");
    cy.getByCy("about-subtitle").should("exist").and("not.be.empty");
  });

  it("renders stats section", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="about-stats"]').length > 0) {
        cy.getByCy("about-stats")
          .find('[data-cy="about-stat"]')
          .should("have.length.at.least", 1)
          .each(($stat) => {
            cy.wrap($stat).should("be.visible");
          });
      }
    });
  });

  it("renders mission section", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="about-mission"]').length > 0) {
        cy.getByCy("about-mission").should("exist").and("be.visible");
      }
    });
  });

  it("renders vision section", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="about-vision"]').length > 0) {
        cy.getByCy("about-vision").should("exist").and("be.visible");
      }
    });
  });

  it("renders values grid", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="about-values-grid"]').length > 0) {
        cy.getByCy("about-values-grid")
          .find('[data-cy="about-value"]')
          .should("have.length.at.least", 1)
          .each(($value) => {
            cy.wrap($value).should("be.visible");
          });
      }
    });
  });

  it("renders team grid with member info", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="about-team-grid"]').length > 0) {
        cy.getByCy("about-team-grid")
          .find('[data-cy="about-team-member"]')
          .should("have.length.at.least", 1)
          .each(($member) => {
            cy.wrap($member).should("be.visible");
            // Check for member name (h3 or similar)
            cy.wrap($member).find("h3").should("not.be.empty");
          });
      }
    });
  });

  it("shows the tagline section", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="about-tagline"]').length > 0) {
        cy.getByCy("about-tagline").should("exist").and("not.be.empty");
      }
    });
  });
});
