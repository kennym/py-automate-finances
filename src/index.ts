import puppeteer from "puppeteer";
require("dotenv").config();

const MES = process.env.MES; // Marzo

function getCurrentYear(): number {
  return new Date().getFullYear();
}

function getMonthName(month: string): string {
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  return monthNames[Number(month) - 1];
}

const descargarExtracto = async () => {
  /**
   * Descarga el extracto
   */
  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://secure.regional.com.py/RegionalWeb/");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Fill out login info
  const formSelector = "#nro-documento";
  await page.waitForSelector(formSelector);
  await new Promise((r) => setTimeout(r, 500));

  await page.type(formSelector, process.env.REGIONAL_DOC, { delay: 100 });
  await page.type("#auth-password", process.env.REGIONAL_PASS);

  // Wait and click on first result
  await page.click("#btnLogin");
  await page.waitForNetworkIdle();

  // TODO: Handle case where it would case for human code
  // Should wait for input by user, maybe solve captcha via GPT-4

  // Wait for extractos
  const extractosSelector = "#acciones > a.accion.a-extracto";
  await page.waitForSelector(extractosSelector, { visible: true });
  await page.click(extractosSelector, { delay: 500 });

  await page.waitForNetworkIdle();
  const opcionesLabel =
    "#extracto_tarjeta_form > div.panel.panel-default.panel-transferencias > div.panel-body.step-container > div > div.panel.panel-default.last > div.panel-body.panel-generico.pd-15 > div.contenedor-radio > div:nth-child(2) > div > div > div.col-xs-10.col-sm-10.col-md-10.col-lg-10.mt-10.pd-0 > label";
  await page.waitForSelector(opcionesLabel, { visible: true });
  await page.click(opcionesLabel, { delay: 500 });

  const inputSelector = "#mes_extracto";
  await page.waitForSelector(inputSelector, { visible: true });
  await page.click(inputSelector, { delay: 500 });
  await page.waitForNetworkIdle();

  const monthSelector =
    /* TODO: These selectors should select the latest month dynamically, but puppeteer times out. These however work in the browser. */
    // "body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-months > table > tbody > tr > td > span:not(.disabled):last-child()";
    // "body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-months > table > tbody > tr > td > span.enabled:last-of-type";
    `body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-months > table > tbody > tr > td > span:nth-child(${MES})`;

  await page.waitForSelector(monthSelector);
  await page.click(monthSelector, { delay: 500 });

  const descargarSelector =
    "#extracto_tarjeta_form > div.botonera-bottom > button";
  await page.waitForSelector(descargarSelector);
  await page.click(descargarSelector);

  // Wait for the new tab to open and get its page object
  const pages = await browser.pages();
  const pdfPage = pages[pages.length - 1];

  // Generate the PDF and save it to a file
  await pdfPage.pdf({
    path: `docs/extracto-tc-regional-${getMonthName(
      MES
    )}-${getCurrentYear()}.pdf`,
  });

  await browser.close();
};

descargarExtracto();
