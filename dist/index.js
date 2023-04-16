"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
require("dotenv").config();
const MES = process.env.MES;
function getCurrentYear() {
    return new Date().getFullYear();
}
function getMonthName(month) {
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
const descargarExtracto = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.goto("https://secure.regional.com.py/RegionalWeb/");
    yield page.setViewport({ width: 1080, height: 1024 });
    const formSelector = "#nro-documento";
    yield page.waitForSelector(formSelector);
    yield new Promise((r) => setTimeout(r, 500));
    yield page.type(formSelector, process.env.REGIONAL_DOC, { delay: 100 });
    yield page.type("#auth-password", process.env.REGIONAL_PASS);
    yield page.click("#btnLogin");
    yield page.waitForNetworkIdle();
    const extractosSelector = "#acciones > a.accion.a-extracto";
    yield page.waitForSelector(extractosSelector, { visible: true });
    yield page.click(extractosSelector, { delay: 500 });
    yield page.waitForNetworkIdle();
    const opcionesLabel = "#extracto_tarjeta_form > div.panel.panel-default.panel-transferencias > div.panel-body.step-container > div > div.panel.panel-default.last > div.panel-body.panel-generico.pd-15 > div.contenedor-radio > div:nth-child(2) > div > div > div.col-xs-10.col-sm-10.col-md-10.col-lg-10.mt-10.pd-0 > label";
    yield page.waitForSelector(opcionesLabel, { visible: true });
    yield page.click(opcionesLabel, { delay: 500 });
    const inputSelector = "#mes_extracto";
    yield page.waitForSelector(inputSelector, { visible: true });
    yield page.click(inputSelector, { delay: 500 });
    yield page.waitForNetworkIdle();
    const monthSelector = `body > div.datepicker.datepicker-dropdown.dropdown-menu.datepicker-orient-left.datepicker-orient-bottom > div.datepicker-months > table > tbody > tr > td > span:nth-child(${MES})`;
    yield page.waitForSelector(monthSelector);
    yield page.click(monthSelector, { delay: 500 });
    const descargarSelector = "#extracto_tarjeta_form > div.botonera-bottom > button";
    yield page.waitForSelector(descargarSelector);
    yield page.click(descargarSelector);
    const pages = yield browser.pages();
    const pdfPage = pages[pages.length - 1];
    yield pdfPage.pdf({
        path: `docs/extracto-tc-regional-${getMonthName(MES)}-${getCurrentYear()}.pdf`,
    });
    yield browser.close();
});
descargarExtracto();
//# sourceMappingURL=index.js.map