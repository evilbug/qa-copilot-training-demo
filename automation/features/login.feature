Feature: Login

  As a registered user of the demo portal
  I want to log in with my credentials
  So that I can access my dashboard

  Background:
    Given the user is on the login page

  Scenario: Successful login with valid credentials
    When the user enters username "demo_user" and password "demo_pass123"
    And submits the login form
    Then the user is redirected to the dashboard

  Scenario: Login fails with an invalid password
    When the user enters username "demo_user" and password "wrong_pass"
    And submits the login form
    Then an "Invalid credentials" error message is shown

  Scenario: Login fails with a locked account
    When the user enters username "locked_user" and password "demo_pass123"
    And submits the login form
    Then an "Account locked" error message is shown
