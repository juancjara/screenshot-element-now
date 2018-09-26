const puppeteer = require("puppeteer");
const http = require("http");
const { parse } = require("url");

const getImageBuffer = async (url, selector) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector(selector);
  const element = await page.$(selector);
  const buffer = await element.screenshot();

  await browser.close();
  return buffer;
};

module.exports = async (req, res) => {
  try {
    const { url, selector } = parse(req.url, true).query;
    console.log("url", url, "selector", selector);
    const buffer = await getImageBuffer(url, selector);
    res.end(buffer, "binary");
  } catch (error) {
    console.log("ERROR", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return { error };
  }
};
