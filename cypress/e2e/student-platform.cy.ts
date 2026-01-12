describe("Student platform page", () => {
  beforeEach(() => {
    cy.visit("/platforms/student");
  });

  it("shows hero content and CTA routes to student registration", () => {
    cy.getByCy("student-hero-section").should("exist");
    cy.getByCy("student-hero-title").should("contain", "Student Portal");
    cy.getByCy("student-hero-subtitle").should(
      "contain",
      "interactive lessons"
    );
    cy.getByCy("student-hero-cta")
      .should("have.attr", "href", "/Auth/register/student")
      .click();
    cy.location("pathname").should("eq", "/Auth/register/student");
  });

  it("renders character grid with images", () => {
    cy.getByCy("student-characters-grid")
      .find('[data-cy="student-character-card"]')
      .should("have.length", 4);
    cy.getByCy("student-characters-copy").should("contain", "guided tasks");
    cy.getByCy("student-characters-outro").should("contain", "3D lessons");
  });

  it("navigates planets via carousel controls", () => {
    cy.getByCy("student-planets-title").should("contain", "planets");

    cy.getByCy("student-planet-name").then(($name) => {
      const initial = $name.text();
      cy.getByCy("student-planets-next").click();
      cy.getByCy("student-planet-name").should(($next) => {
        expect($next.text()).not.to.eq(initial);
      });
      cy.getByCy("student-planets-prev").click();
      cy.getByCy("student-planet-name").should("have.text", initial);
    });

    cy.getByCy("student-planets-toggle").click();
    cy.getByCy("student-planets-toggle").should("contain", "Start Rotation");
  });

  it("has CTA linking to student registration", () => {
    cy.getByCy("student-cta-section").within(() => {
      cy.getByCy("student-cta-title").should("contain", "Register today");
      cy.getByCy("student-cta-button")
        .should("have.attr", "href", "/Auth/register/student")
        .and("contain", "Register");
    });
  });
});
