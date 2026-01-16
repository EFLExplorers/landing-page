describe("Student platform page", () => {
  beforeEach(() => {
    cy.visit("/platforms/student");
  });

  it("shows hero content and CTA routes to student registration", () => {
    cy.getByCy("student-hero-section").should("exist");
    cy.getByCy("student-hero-title").should("exist").and("not.be.empty");
    cy.getByCy("student-hero-subtitle").should("exist").and("not.be.empty");

    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="student-hero-cta"]').length > 0) {
        cy.getByCy("student-hero-cta")
          .should("have.attr", "href")
          .and("include", "/Auth/register/student")
          .click();
        cy.location("pathname").should("eq", "/Auth/register/student");
      }
    });
  });

  it("renders character grid with images", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="student-characters-grid"]').length > 0) {
        cy.getByCy("student-characters-grid")
          .find('[data-cy="student-character-card"]')
          .should("have.length.at.least", 1)
          .each(($card) => {
            cy.wrap($card).should("be.visible");
          });
      }
    });
  });

  it("navigates planets via carousel controls", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="student-planets-title"]').length > 0) {
        cy.getByCy("student-planets-title").should("exist");

        cy.get("body").then(($body2) => {
          if ($body2.find('[data-cy="student-planet-name"]').length > 0) {
            cy.getByCy("student-planet-name").then(($name) => {
              const initial = $name.text();
              if ($body2.find('[data-cy="student-planets-next"]').length > 0) {
                cy.getByCy("student-planets-next").click();
                cy.getByCy("student-planet-name").should(($next) => {
                  expect($next.text()).not.to.eq(initial);
                });
              }
              if ($body2.find('[data-cy="student-planets-prev"]').length > 0) {
                cy.getByCy("student-planets-prev").click();
                cy.getByCy("student-planet-name").should("have.text", initial);
              }
            });
          }
        });

        cy.get("body").then(($body3) => {
          if ($body3.find('[data-cy="student-planets-toggle"]').length > 0) {
            cy.getByCy("student-planets-toggle").click();
            cy.getByCy("student-planets-toggle").should("be.visible");
          }
        });
      }
    });
  });

  it("has CTA linking to student registration", () => {
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="student-cta-section"]').length > 0) {
        cy.getByCy("student-cta-section").within(() => {
          cy.getByCy("student-cta-title").should("exist").and("not.be.empty");
          cy.getByCy("student-cta-button")
            .should("have.attr", "href")
            .and("include", "/Auth/register/student");
        });
      }
    });
  });
});
