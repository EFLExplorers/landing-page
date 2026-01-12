describe("Teacher platform page", () => {
  beforeEach(() => {
    cy.visit("/platforms/teacher");
  });

  it("shows hero content and CTA routes to teacher registration", () => {
    cy.getByCy("teacher-hero-section").should("exist");
    cy.getByCy("teacher-hero-title").should("contain", "Teacher Portal");
    cy.getByCy("teacher-hero-subtitle").should(
      "contain",
      "comprehensive ESL platform"
    );
    cy.getByCy("teacher-hero-image")
      .should("have.attr", "src")
      .and("include", "Emma.png");
    cy.getByCy("teacher-hero-cta")
      .should("have.attr", "href", "/Auth/register/teacher")
      .click();
    cy.location("pathname").should("eq", "/Auth/register/teacher");
  });

  it("lists teaching tools with cards and descriptions", () => {
    cy.getByCy("teaching-tools-section").within(() => {
      cy.getByCy("teaching-tools-intro").should(
        "contain",
        "Plan faster, teach with confidence"
      );
      cy.getByCy("teaching-tools-grid")
        .find('[data-cy="teaching-tool-card"]')
        .should("have.length", 6)
        .each(($card) => {
          cy.wrap($card).find("h4").should("not.be.empty");
          cy.wrap($card).find("p").should("not.be.empty");
        });
      cy.getByCy("teaching-tools-outro").should(
        "contain",
        "Pre-designed lesson plans"
      );
    });
  });

  it("renders lesson modules and updates selected module on click", () => {
    cy.getByCy("lesson-modules-title").should("contain", "lesson modules");
    cy.getByCy("lesson-modules-subtitle").should("contain", "proficiency");
    cy.getByCy("lesson-modules-grid")
      .find('[data-cy="lesson-module-card"]')
      .should("have.length", 10);

    cy.getByCy("selected-module-title").should("contain", "Beginner");
    cy.getByCy("selected-module-description").should(
      "contain",
      "Perfect for students"
    );
    cy.getByCy("selected-module-size").should("contain", "students");
    cy.getByCy("selected-module-lessons").should("contain", "lessons");
    cy.getByCy("selected-module-duration").should("contain", "months");

    cy.getByCy("lesson-modules-grid")
      .find('[data-cy="lesson-module-card"]')
      .eq(3)
      .click();
    cy.getByCy("selected-module-title").should("contain", "Intermediate");
    cy.getByCy("selected-module-description").should(
      "contain",
      "Enhancing fluency"
    );
  });

  it("shows teacher benefits cards", () => {
    cy.getByCy("teacher-benefits-section").within(() => {
      cy.getByCy("teacher-benefits-title").should("contain", "Why Teachers");
      cy.getByCy("teacher-benefits-grid")
        .find('[data-cy="teacher-benefit-card"]')
        .should("have.length", 4);
    });
  });

  it("shows CTA with link to teacher registration", () => {
    cy.getByCy("teacher-cta-section").within(() => {
      cy.getByCy("teacher-cta-title").should("contain", "Join our community");
      cy.getByCy("teacher-cta-subtitle").should("contain", "engaging lessons");
      cy.getByCy("teacher-cta-button")
        .should("have.attr", "href", "/Auth/register/teacher")
        .and("contain", "Register as Teacher");
    });
  });
});
