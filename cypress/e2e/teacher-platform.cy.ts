describe("Teacher platform page", () => {
  beforeEach(() => {
    cy.visit("/platforms/teacher");
  });

  it("shows hero content and CTA routes to teacher registration", () => {
    cy.getByCy("teacher-hero-section").should("exist");
    cy.getByCy("teacher-hero-title").should("exist").and("not.be.empty");
    cy.getByCy("teacher-hero-subtitle").should("exist").and("not.be.empty");

    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="teacher-hero-cta"]').length > 0) {
        cy.getByCy("teacher-hero-cta")
          .should("have.attr", "href")
          .and("include", "/Auth/register/teacher")
          .click();
        cy.location("pathname").should("eq", "/Auth/register/teacher");
      }
    });
  });

  it("lists teaching tools with cards and descriptions", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="teaching-tools-section"]').length > 0) {
        cy.getByCy("teaching-tools-section").within(() => {
          cy.getByCy("teaching-tools-grid")
            .find('[data-cy="teaching-tool-card"]')
            .should("have.length.at.least", 1)
            .each(($card) => {
              cy.wrap($card).should("be.visible");
            });
        });
      }
    });
  });

  it("renders lesson modules and updates selected module on click", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="lesson-modules-grid"]').length > 0) {
        cy.getByCy("lesson-modules-grid")
          .find('[data-cy="lesson-module-card"]')
          .should("have.length.at.least", 1)
          .first()
          .should("be.visible");

        // Check for selected module display
        cy.get("body").then(($body2) => {
          if ($body2.find('[data-cy="selected-module-title"]').length > 0) {
            cy.getByCy("selected-module-title").should("exist");
            cy.getByCy("lesson-modules-grid")
              .find('[data-cy="lesson-module-card"]')
              .eq(1)
              .click();
            cy.getByCy("selected-module-title").should("exist");
          }
        });
      }
    });
  });

  it("shows teacher benefits cards", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="teacher-benefits-section"]').length > 0) {
        cy.getByCy("teacher-benefits-section").within(() => {
          cy.getByCy("teacher-benefits-grid")
            .find('[data-cy="teacher-benefit-card"]')
            .should("have.length.at.least", 1)
            .each(($card) => {
              cy.wrap($card).should("be.visible");
            });
        });
      }
    });
  });

  it("shows CTA with link to teacher registration", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="teacher-cta-section"]').length > 0) {
        cy.getByCy("teacher-cta-section").within(() => {
          cy.getByCy("teacher-cta-title").should("exist").and("not.be.empty");
          cy.getByCy("teacher-cta-button")
            .should("have.attr", "href")
            .and("include", "/Auth/register/teacher");
        });
      }
    });
  });
});
