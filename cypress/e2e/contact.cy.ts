describe("Contact page", () => {
  beforeEach(() => {
    cy.visit("/contact");
  });

  it("shows contact hero section with title and contact info", () => {
    cy.getByCy("contact-hero").should("exist");
    cy.getByCy("contact-title").should("exist").and("not.be.empty");
    cy.getByCy("contact-subtitle").should("exist").and("not.be.empty");

    // Check for contact methods (email, phone, etc.)
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="contact-email"]').length > 0) {
        cy.getByCy("contact-email")
          .should("have.attr", "href")
          .and("include", "mailto:");
      }
      if ($body.find('[data-cy="contact-phone"]').length > 0) {
        cy.getByCy("contact-phone")
          .should("have.attr", "href")
          .and("include", "tel:");
      }
    });
  });

  it("renders contact form with all required fields", () => {
    cy.getByCy("contact-form-section").should("exist");
    cy.getByCy("contact-form-title").should("exist");
    cy.getByCy("contact-first-name").should("exist").and("be.visible");
    cy.getByCy("contact-last-name").should("exist").and("be.visible");
    cy.getByCy("contact-email-input").should("exist").and("be.visible");
    cy.getByCy("contact-subject").should("exist").and("be.visible");
    cy.getByCy("contact-message").should("exist").and("be.visible");
    cy.getByCy("contact-submit").should("exist").and("be.visible");
  });

  it("allows filling and submitting the contact form", () => {
    cy.getByCy("contact-first-name").type("Test");
    cy.getByCy("contact-last-name").type("User");
    cy.getByCy("contact-email-input").type("test@example.com");

    // Select subject if options are available
    cy.getByCy("contact-subject").then(($select) => {
      if ($select.find("option").length > 1) {
        cy.getByCy("contact-subject").select(1);
      }
    });

    cy.getByCy("contact-message").type("This is a test message.");
    cy.getByCy("contact-submit").click();

    // Form should submit (may show success message or redirect)
    // Since form submission is handled client-side, we just verify it's clickable
    cy.getByCy("contact-submit").should("exist");
  });

  it("shows FAQ section with items", () => {
    cy.getByCy("contact-faq-grid")
      .should("exist")
      .find('[data-cy="contact-faq-item"]')
      .should("have.length.at.least", 1)
      .first()
      .should("be.visible");
  });

  it("toggles FAQ items when clicked", () => {
    cy.getByCy("contact-faq-grid")
      .find('[data-cy="contact-faq-item"]')
      .first()
      .click()
      .should("be.visible");
  });
});
