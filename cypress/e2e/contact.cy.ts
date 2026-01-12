describe("Contact page", () => {
  beforeEach(() => {
    cy.visit("/contact");
  });

  it("shows contact hero info", () => {
    cy.getByCy("contact-hero").should("exist");
    cy.getByCy("contact-title").should("contain", "Get in Touch");
    cy.getByCy("contact-subtitle").should("contain", "learning journey");
    cy.getByCy("contact-email").should(
      "have.attr",
      "href",
      "mailto:contact@eslexplorers.com"
    );
    cy.getByCy("contact-phone").should("have.attr", "href", "tel:+1234567890");
  });

  it("submits the contact form fields present", () => {
    cy.getByCy("contact-first-name").type("Test");
    cy.getByCy("contact-last-name").type("User");
    cy.getByCy("contact-email-input").type("test@example.com");
    cy.getByCy("contact-subject").select("pricing");
    cy.getByCy("contact-message").type(
      "I would like to know more about pricing."
    );
    cy.getByCy("contact-submit").click();
  });

  it("shows FAQ items and toggles answers", () => {
    cy.getByCy("contact-faq-grid")
      .find('[data-cy="contact-faq-item"]')
      .should("have.length.at.least", 3)
      .first()
      .click()
      .should("contain", "We offer a wide range of English courses");
  });
});
