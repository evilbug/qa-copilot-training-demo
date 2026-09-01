const { By, until } = require('selenium-webdriver');

const BASE_URL = process.env.DEMO_APP_URL || 'http://localhost:4000';

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(`${BASE_URL}/index.html`);
  }

  async enterUsername(username) {
    const field = await this.driver.findElement(By.id('username'));
    await field.clear();
    await field.sendKeys(username);
  }

  async enterPassword(password) {
    const field = await this.driver.findElement(By.id('password'));
    await field.clear();
    await field.sendKeys(password);
  }

  async submit() {
    await this.driver.findElement(By.id('login-submit')).click();
  }

  async getErrorMessage() {
    const errorEl = await this.driver.wait(until.elementLocated(By.id('login-error')), 5000);
    return errorEl.getText();
  }

  async getDashboardHeading() {
    const heading = await this.driver.wait(until.elementLocated(By.id('dashboard-heading')), 5000);
    return heading.getText();
  }
}

module.exports = { LoginPage };
