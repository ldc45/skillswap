describe("Login Test", () => {
  // Ensure user is logged out and reset frontend state after each test
  afterEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:4000/api/auth/logout",
      failOnStatusCode: false,
    });
    cy.reload();
  });
  // Ensure user is logged out and visit login page before each test
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:4000/api/auth/logout",
      failOnStatusCode: false,
    });
    cy.visit("/");
  });

  it("should login successfully with valid credentials", () => {
    // Intercept login API request and mock successful response
    cy.intercept("POST", "http://localhost:4000/api/auth/login", {
      statusCode: 200,
      body: { success: true },
    }).as("loginRequest");

    // Intercept user info request and mock user data
    cy.intercept("GET", "http://localhost:4000/api/users/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        skills: [],
        availabilities: [],
      },
    }).as("getUserRequest");

    // Open burger menu
    cy.get('button[datatype="burger"]').click();
    // Fill login form with valid credentials
    cy.get('input[id="email"]').type("test@example.com");
    cy.get('input[id="password"]').type("fakePassword");
    // Submit login form
    cy.get('button[type="submit"]').contains("Se connecter").click();
    // Wait for login and user info requests
    cy.wait("@loginRequest");
    cy.wait("@getUserRequest");
  });
  it("should show error message with invalid credentials", () => {
    // Intercept login API request and mock failed response
    cy.intercept("POST", "http://localhost:4000/api/auth/login", {
      statusCode: 401,
      body: { message: "Invalid credentials" },
    }).as("failedLoginRequest");
    // Open burger menu
    cy.get('button[datatype="burger"]').click();
    // Fill login form with invalid credentials
    cy.get('input[id="email"]').type("test@example.com");
    cy.get('input[id="password"]').type("wrongPassword");
    // Submit login form
    cy.get('button[type="submit"]').contains("Se connecter").click();
    // Wait for failed login request
    cy.wait("@failedLoginRequest");
    // Check that error message is visible
    cy.get(".bg-red-100").should("be.visible");
  });
});
