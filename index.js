// импортирую утилиты selenuim-webdriver
const { Builder, By, Key, until } = require('selenium-webdriver');
 
// ссылка на сайт
const Yandex= 'https://ya.ru/';
// родительский элемент, корень результата поиска
const Answer = 'li.serp-item[data-cid]';
 
// массив селекторов результатов поиска (текстовых элементов)
const text_elements = [
  'div.text-container',
  'div.organic__url-text'
];
 
(async () => {
 let driver1;
  try {
    // какой поисковый запрос вбивать в Яндекс
    const find = 'шариковая ручка бренды';
    // какую строку искать в результатах поиска
    const str = 'parker';
 console.log('Поиск строки', `"${str}"`, 'на странице Яндекса по запросу', `"${find}"`);
 
    // инициализация selenium driver на основе Chrome
 driver1 = await new Builder()
 .forBrowser('firefox')
 .build();
    // произвести переход на яндекс
 await driver1.get(Yandex);
    // найти на странице поисковое поле и ввести запрос, нажать Enter
 await driver1.findElement(By.name('text')).sendKeys(find , Key.RETURN);
    // ожидать появления хотя бы одного элемента-результата поиска
 await driver1.wait(until.elementLocated(By.css(Answer), 1000 * 10));
 
    // флаг "нашли строку"
 let found = false;
    // цикл по всем возможным селекторам
    for (const subject of text_elements) {
      // найти все элементы, удовлетворяющие селектору, и расположенные внутри результата запроса
      const search = await driver1.findElements(By.css(`${Answer} ${subject}`));
      for (let i = 0; i < search.length; ++i) {
        const searching = search[i];
        // получить текстовое содержимое элемента
        const writing_texting = await searching.getText();
        // если текст содержит искомую строку
        if (writing_texting.toLowerCase().indexOf(str.toLowerCase()) > -1) {
          // вывести номер результата
 console.log(`"${str}"`, 'Найдено на позиции', i + 1, `: "${writing_texting}"`);
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
 await driver1.quit();
  }
})();