// импортирую утилиты selenuim-webdriver
const { Builder, By, Key, until } = require('selenium-webdriver');
 
// ссылка на сайт
const Yandex= 'https://ya.ru/';
// родительский жэлемент, корень результата поиска
const RESULT_ITEM_SEL = 'li.serp-item[data-cid]';
 
// массив селекторов результатов поиска (текстовых элементов)
const TEXT_SELECTORS = [
  'div.text-container',
  'div.organic__url-text'
];
 
(async () => {
 let driver;
  try {
    // какой поисковый запрос вбивать в Яндекс
    const find = 'шариковая ручка бренды';
    // какую строку искать в результатах поиска
    const str = 'parker';
 console.log('Поиск строки', `"${str}"`, 'на странице Яндекса по запросу', `"${find}"`);
 
    // инициализация selenium driver на основе Chrome
 driver = await new Builder()
 .forBrowser('firefox')
 .build();
    // произвести переход на яндекс
 await driver.get(Yandex);
    // найти на странице поисковое поле и ввести запрос, нажать Enter
 await driver.findElement(By.name('text')).sendKeys(find , Key.RETURN);
    // ожидать появления хотя бы одного элемента-результата поиска
 await driver.wait(until.elementLocated(By.css(RESULT_ITEM_SEL), 1000 * 10));
 
    // флаг "нашли строку"
 let found = false;
    // цикл по всем возможным селекторам
    for (const sel of TEXT_SELECTORS) {
      // найти все элементы, удовлетворяющие селектору, и рсположенные внутри результата запроса
      const els = await driver.findElements(By.css(`${RESULT_ITEM_SEL} ${sel}`));
      for (let i = 0; i < els.length; ++i) {
        const el = els[i];
        // получить текстовое содержимое элемента
        const text = await el.getText();
        // если текст содержит искомую строку
        if (text.toLowerCase().indexOf(str.toLowerCase()) > -1) {
          // вывести номер результата
 console.log(`"${str}"`, 'Найдено на позиции', i + 1, `: "${text}"`);
          // установить флаг в true
 found = true;
        }
      }
    }
 
    // если найти не удалось, то сообщить
    if (!found) {
 console.log('Не найдено ни одного вхождения');
    }
  } finally {
    // закрытие браузера
 await driver.quit();
  }
})();