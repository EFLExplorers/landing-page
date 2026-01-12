describe("About page", () => {
  beforeEach(() => {
    cy.visit("/about");
  });

  it("shows the hero heading and subtitle", () => {
    cy.getByCy("about-page").should("exist");
    cy.getByCy("about-title").should("contain", "About ESL Explorers");
    cy.getByCy("about-subtitle").should("contain", "Pioneering the future");
  });

  it("renders stats, mission, vision, and values", () => {
    cy.getByCy("about-stats").find('[data-cy="about-stat"]').should("have.length.at.least", 3);
    cy.getByCy("about-mission").should("contain", "Our Mission");
    cy.getByCy("about-vision").should("contain", "Our Vision");
    cy.getByCy("about-values-grid").find('[data-cy="about-value"]').should("have.length.at.least", 4);
  });

  it("renders team grid with member info", () => {
    cy.getByCy("about-team-grid")
      .find('[data-cy="about-team-member"]')
      .should("have.length.at.least", 3)
      .each(($member) => {
        cy.wrap($member).find("h3").should("not.be.empty");
        cy.wrap($member).find("img").should("have.attr", "src");
      });
  });

  it("shows the tagline", () => {
    cy.getByCy("about-tagline").should("contain", "Adventure awaits");
  });
});
