export const getByCy = (value: string) => cy.get(`[data-cy="${value}"]`);

declare global {
  namespace Cypress {
    interface Chainable {
      getByCy: typeof getByCy;
    }
  }
}

Cypress.Commands.add("getByCy", getByCy);
