const { setWorldConstructor, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');

setDefaultTimeout(15000);

class CustomWorld {
  async openBrowser() {
    this.driver = await new Builder().forBrowser('chrome').build();
  }

  async closeBrowser() {
    if (this.driver) {
      await this.driver.quit();
    }
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  await this.openBrowser();
});

After(async function () {
  await this.closeBrowser();
});
