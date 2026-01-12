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

    cy.getByCy("navbar").within(() => {
      cy.getByCy("nav-platforms-trigger").click();
    });
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

    cy.getByCy("auth-buttons").within(() => {
      cy.getByCy("auth-login-link").should("have.attr", "href", "/Auth/login");
      cy.getByCy("auth-register-link").should(
        "have.attr",
        "href",
        "/Auth/register"
      );
    });
  });

  it("shows hero content and CTA routes to registration", () => {
    cy.getByCy("hero-section").should("exist");
    cy.getByCy("hero-title").should("contain", "Start your learning journey");
    cy.getByCy("hero-subtitle").should("contain", "register to get started");

    cy.getByCy("hero-register-student").click();
    cy.location("pathname").should("eq", "/Auth/register/student");

    cy.visit("/");

    cy.getByCy("hero-register-teacher").click();
    cy.location("pathname").should("eq", "/Auth/register/teacher");
  });

  it("renders tagline and learning tools grid", () => {
    cy.getByCy("tagline-section").within(() => {
      cy.getByCy("tagline-title").should("contain", "Explore the universe");
      cy.getByCy("tagline-subtitle").should("contain", "stellar ESL resources");
    });

    cy.getByCy("learning-tools-section").within(() => {
      cy.getByCy("learning-tools-title").should("contain", "Learning Tools");
      cy.getByCy("learning-tools-grid")
        .find('[data-cy="learning-tool-card"]')
        .should("have.length", 6);
    });
  });

  it("lists services and pricing options", () => {
    cy.getByCy("services-grid")
      .find('[data-cy="service-card"]')
      .should("have.length", 6);

    cy.getByCy("pricing-grid")
      .find('[data-cy="pricing-card"]')
      .should("have.length", 4);

    cy.getByCy("pricing-card")
      .first()
      .within(() => {
        cy.contains("Get started");
      });
  });

  it("shows register CTA link", () => {
    cy.getByCy("register-cta-section").within(() => {
      cy.getByCy("register-cta-title").should("contain", "Ready to Start");
      cy.getByCy("register-cta-button")
        .should("have.attr", "href", "/Auth/register")
        .and("contain", "Create Your Account");
    });
  });

  it("renders footer links and legal text", () => {
    cy.getByCy("site-footer").within(() => {
      cy.getByCy("footer-logo-section").should("exist");
      cy.getByCy("footer-socials-column").within(() => {
        cy.getByCy("footer-linkedin-link").should(
          "have.attr",
          "href",
          "https://linkedin.com"
        );
        cy.getByCy("footer-instagram-link").should(
          "have.attr",
          "href",
          "https://instagram.com"
        );
        cy.getByCy("footer-facebook-link").should(
          "have.attr",
          "href",
          "https://facebook.com"
        );
      });
      cy.getByCy("footer-company-column").within(() => {
        cy.getByCy("footer-about-link").should("have.attr", "href", "/about");
        cy.getByCy("footer-pricing-link").should(
          "have.attr",
          "href",
          "/pricing"
        );
        cy.getByCy("footer-register-link").should(
          "have.attr",
          "href",
          "/Auth/register"
        );
      });
      cy.getByCy("footer-support-column").within(() => {
        cy.getByCy("footer-contact-link").should(
          "have.attr",
          "href",
          "/contact"
        );
        cy.getByCy("footer-faq-link").should("have.attr", "href", "/faq");
        cy.getByCy("footer-terms-link").should("have.attr", "href", "/terms");
        cy.getByCy("footer-privacy-link").should(
          "have.attr",
          "href",
          "/privacy"
        );
      });

      cy.getByCy("footer-bottom-bar")
        .should("contain", "All rights reserved")
        .and("contain", "Powered by ESL Explorers");
    });
  });
});
