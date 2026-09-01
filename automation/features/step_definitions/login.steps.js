const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { LoginPage } = require('../support/pageObjects/LoginPage');

Given('the user is on the login page', async function () {
  this.loginPage = new LoginPage(this.driver);
  await this.loginPage.open();
});

When('the user enters username {string} and password {string}', async function (username, password) {
  await this.loginPage.enterUsername(username);
  await this.loginPage.enterPassword(password);
});

When('submits the login form', async function () {
  await this.loginPage.submit();
});

Then('the user is redirected to the dashboard', async function () {
  const heading = await this.loginPage.getDashboardHeading();
  assert.strictEqual(heading, 'Dashboard');
});

Then('an {string} error message is shown', async function (expectedMessage) {
  const actual = await this.loginPage.getErrorMessage();
  assert.strictEqual(actual, expectedMessage);
});
