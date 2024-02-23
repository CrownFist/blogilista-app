describe('Blogilista ', function () {
  beforeEach(function () {
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials and content is visible', function () {
      const user = Cypress.env('CYPRESS_USER')
      const pwd = Cypress.env('CYPRESS_PASSWORD')

      cy.contains('log in').click()
      cy.get('#username').type(user)
      cy.get('#password').type(pwd)
      cy.get('#login-button').click()
      cy.contains('Pekka logged in')
      cy.contains('DevOps in 15 minutes').contains('show').click()
    })
    it('fails with wrong credentials, error message is shown', function () {
      cy.contains('log in').click()
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })
})
