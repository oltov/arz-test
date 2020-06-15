const init = () => {

  const btnAddArticle = document.querySelector(`#add-article`);
  const btnRemoveArticle = document.querySelector(`#remove-article`);
  const btnLookArticle = document.querySelector(`#look-article`);
  const resultBlockNode = document.querySelector(`.article--result`);
  const btnCopy = document.querySelector(`.button--copy`);
  const urlRegexp = /(\w+):\/\/([\w.]+)\/(\S*)/;
  let resultIsActive = false;
  let resultBlockIsReady = false;
  let validateIsActive = true;

  // копирование готовой верстки блока
  // флаг validateIsActive для контроля кнопки "Посмотреть результат"

  const copyNode = () => {
    if (!validateIsActive) {
      return;
    }
    validateIsActive = false;
    btnCopy.addEventListener(`click`, () => {
      if (resultBlockIsReady) {
        const nodeAtricle = document.querySelector(`#result-article`).outerHTML;
        navigator.clipboard.writeText(nodeAtricle);
        alert(`Код скопирован в буфер обмена.`);
      } else {
        alert(`Не все поля корретно заполнены. Копирование не выполнено.`);
        btnCopy.setAttribute(`style`, `display: none;`);
      }
    });
  };

  // связка полей главного заголовка

  const updateTopTitle = () => {
    const input = document.querySelector(`#constructor-top-title`);
    const topTitle = document.querySelector(`#result-top-title`);
    input.addEventListener(`input`, () => {
      topTitle.textContent = input.value.trim();
    });
  };

  // отобразить блок с результатами

  const showBlockResult = () => {
    resultBlockNode.setAttribute(`style`, `display: block;`);
    resultIsActive = true;
    inputListners();
    updateTopTitle();
    controlInputs();
    formatingLink();
  };

  // обработчики инпутов, работают только пока нет блока с результатами
  // (на видео при клике в поле ввода показываются результаты)

  const inputListners = () => {
    const allInputs = document.querySelectorAll(`#article-constructor input`);
    if (!resultIsActive) {

      allInputs.forEach(item => {
        item.addEventListener(`focus`, showBlockResult);
      });

    } else {
      allInputs.forEach(item => {
        item.removeEventListener(`focus`, showBlockResult);
      });
    }
  };

  // запуск обработчиков инпутов при открытии страницы

  inputListners();

  // добавление нового материала(статьи)

  const addNewArticle = () => {
    const newArticleTemplate = document.querySelector(`#new-article`);
    const wrapperConstructor = document.querySelector(`#article-constructor`);

    if (newArticleTemplate && wrapperConstructor) {

      const fragment = document.createDocumentFragment();
      let newArticle = newArticleTemplate.content.cloneNode(true);
      fragment.appendChild(newArticle);
      wrapperConstructor.append(fragment);

      addResultLink();
      controlInputs();
      inputListners();
    }
  };

  // удаление последнего материала(статьи)

  const deleteArticle = () => {
    const linkArticle = document.querySelectorAll(`.article__link`);
    const lastTask = document.querySelectorAll(`.article__inputs-wrapper`);

    if (lastTask && lastTask.length > 1) {
      lastTask[lastTask.length - 1].remove();
    }

    if (linkArticle && linkArticle.length > 1) {
      linkArticle[linkArticle.length - 1].remove();
      controlInputs();
    }

    if (linkArticle && linkArticle.length === 1) {
      resultBlockNode.setAttribute(`style`, `display: none;`);
      btnCopy.setAttribute(`style`, `display: none;`);
      resultIsActive = false;
      inputListners();
    }
  };

  // добавление ссылки на новую статью

  const addResultLink = () => {
    const linkTemplate = document.querySelector(`#link-to-article`);
    const blockArticle = document.querySelector(`#result-article`);

    if (linkTemplate && blockArticle) {
      const fragment = document.createDocumentFragment();
      let newArticle = linkTemplate.content.cloneNode(true);
      fragment.appendChild(newArticle);
      blockArticle.append(fragment);
    }

    // обработчик кнопки редактирование ссылки
    formatingLink();
  };

  // связывание инпутов конструктора и полей с результатами

  const controlInputs = () => {
    const fields = document.querySelectorAll(`[data-input-fields]`);
    const linkTitles = document.querySelectorAll(`[data-link-article]`);

    for (let i = 0; i < fields.length; i++) {
      const inputTitle = fields[i].querySelector(`.input__field--title`);
      const inputSubTitle = fields[i].querySelector(`.input__field--subtitle`);
      const redactLink = fields[i].querySelector(`.input__field--link`);
      const title = linkTitles[i].querySelector(`.article__title`);
      const subTitle = linkTitles[i].querySelector(`.article__subtitle`);
      const link = linkTitles[i].querySelector(`.article__description`);

      inputTitle.addEventListener(`input`, () => {
        title.textContent = inputTitle.value.trim();
        if (title.textContent) {
          title.classList.remove(`article__title--warning`);
          title.setAttribute(`data-content`, `true`);
        } else {
          title.classList.add(`article__title--warning`);
          title.textContent = `Введите заголовок`;
        }
      });

      inputSubTitle.addEventListener(`input`, () => {
        subTitle.textContent = inputSubTitle.value.trim();
      });

      redactLink.addEventListener(`input`, () => {
        link.textContent = redactLink.value.trim();
        if (link.textContent) {
          link.classList.remove(`article__description--result`);
        } else {
          link.classList.add(`article__description--result`);
        }
      });
    }
  };

  // обработка вставленной ссылки

  const formatingLink = () => {
    const bloksConstructor = document.querySelectorAll(`.article__inputs-wrapper`);
    const linksDescription = document.querySelectorAll(`[data-link-article]`);

    for (let i = 0; i < bloksConstructor.length; i++) {
      const btn = bloksConstructor[i].querySelector(`[data-format-link]`);
      const nodeDes = linksDescription[i].querySelector(`.article__description`);
      const field = bloksConstructor[i].querySelector(`[data-input-link]`);
      const warningElement = linksDescription[i].querySelector(`[data-link-warning]`);

      btn.addEventListener(`click`, () => {
        const isContent = urlRegexp.test(field.value.trim());

        if (isContent) {
          nodeDes.textContent = field.value.trim().match(urlRegexp)[2];
          nodeDes.classList.remove(`article__description--result`);
          warningElement.setAttribute(`style`, `display: none`);
          linksDescription[i].setAttribute(`href`, field.value.trim());
          linksDescription[i].setAttribute(`data-content`, `true`);
        } else {
          nodeDes.classList.add(`article__description--result`);
          warningElement.setAttribute(`style`, `display: block`);
          warningElement.textContent = `Неверный формат ссылки`;
        }
      });
    }
  };

  // проверка заполненности всех полей
  const validate = () => {
    const contents = [...document.querySelectorAll(`[data-content]`)];

    const errorList = contents.filter(item => {
      return item.getAttribute(`data-content`) === `false`;
    });

    resultBlockIsReady = errorList.length === 0 ? true : false;
  };

  // обработчики кнопок добавить, удалить и посмотреть материал

  btnAddArticle.addEventListener(`click`, addNewArticle);
  btnRemoveArticle.addEventListener(`click`, deleteArticle);

  btnLookArticle.addEventListener(`click`, () => {

    if (!resultIsActive) {
      resultBlockNode.setAttribute(`style`, `display: block;`);
      btnCopy.setAttribute(`style`, `display: block;`);
      resultIsActive = true;
      inputListners();
      updateTopTitle();
      controlInputs();
      formatingLink();
      validate();
      copyNode();

    } else {
      btnCopy.setAttribute(`style`, `display: block;`);
      validate();
      copyNode();
    }
  });
};

export {init};
