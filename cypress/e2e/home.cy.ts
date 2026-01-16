describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders header with logo, nav, and auth buttons", () => {
    cy.getByCy("site-header").should("exist");
    cy.getByCy("logo-link")
      .should("have.attr", "href", "/")
      .find('[data-cy="logo-image"]')
      .should("be.visible");

    cy.getByCy("navbar").should("exist");
    cy.getByCy("nav-platforms-trigger").click();
    cy.getByCy("nav-platforms-menu").should("be.visible");
    cy.getByCy("nav-platforms-teacher-link").should(
      "have.attr",
      "href",
      "/platforms/teacher"
    );
    cy.getByCy("nav-platforms-student-link").should(
      "have.attr",
      "href",
      "/platforms/student"
    );
    cy.getByCy("nav-pricing-link").should("have.attr", "href", "/pricing");
    cy.getByCy("nav-about-link").should("have.attr", "href", "/about");
    cy.getByCy("nav-contact-link").should("have.attr", "href", "/contact");

    cy.getByCy("auth-buttons").should("exist");
    cy.getByCy("auth-login-link").should("have.attr", "href", "/Auth/login");
    cy.getByCy("auth-register-link").should(
      "have.attr",
      "href",
      "/Auth/register"
    );
  });

  it("shows hero section with title, subtitle, and CTA buttons", () => {
    cy.getByCy("hero-section").should("exist");
    cy.getByCy("hero-title").should("exist").and("not.be.empty");
    cy.getByCy("hero-subtitle").should("exist").and("not.be.empty");

    // Check for registration buttons (may be student, teacher, or both)
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="hero-register-student"]').length > 0) {
        cy.getByCy("hero-register-student")
          .should("be.visible")
          .and("have.attr", "href")
          .and("include", "/Auth/register");
      }
      if ($body.find('[data-cy="hero-register-teacher"]').length > 0) {
        cy.getByCy("hero-register-teacher")
          .should("be.visible")
          .and("have.attr", "href")
          .and("include", "/Auth/register");
      }
    });
  });

  it("renders tagline section", () => {
    cy.getByCy("tagline-section").should("exist");
    cy.getByCy("tagline-title").should("exist").and("not.be.empty");
    cy.getByCy("tagline-subtitle").should("exist").and("not.be.empty");
  });

  it("renders learning tools section with cards", () => {
    cy.getByCy("learning-tools-section").should("exist");
    cy.getByCy("learning-tools-grid").should("exist");
    cy.getByCy("learning-tools-grid")
      .find('[data-cy="learning-tool-card"]')
      .should("have.length.at.least", 1)
      .each(($card) => {
        cy.wrap($card).should("be.visible");
      });
  });

  it("renders services section with cards", () => {
    cy.getByCy("services-section").should("exist");
    cy.getByCy("services-grid").should("exist");
    cy.getByCy("services-grid")
      .find('[data-cy="service-card"]')
      .should("have.length.at.least", 1)
      .each(($card) => {
        cy.wrap($card).should("be.visible");
      });
  });

  it("renders pricing section with pricing cards", () => {
    cy.getByCy("pricing-section").should("exist");
    cy.getByCy("pricing-grid").should("exist");
    cy.getByCy("pricing-grid")
      .find('[data-cy="pricing-card"]')
      .should("have.length.at.least", 1)
      .each(($card) => {
        cy.wrap($card).should("be.visible");
      });
  });

  it("renders register CTA section with link", () => {
    cy.getByCy("register-cta-section").should("exist");
    cy.getByCy("register-cta-title").should("exist").and("not.be.empty");
    cy.getByCy("register-cta-button")
      .should("exist")
      .and("have.attr", "href")
      .and("include", "/Auth/register");
  });

  it("renders footer with links and legal text", () => {
    cy.getByCy("site-footer").should("exist");
    cy.getByCy("footer-logo-section").should("exist");
    cy.getByCy("footer-links-section").should("exist");
    cy.getByCy("footer-bottom-bar").should("exist").and("not.be.empty");
  });
});
