window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContent = document.querySelectorAll('.tabcontent');
    const tabsPerent = document.querySelector('.tabheader__items');

    // tabs

    function hideTabsContent() {
        tabsContent.forEach(item => {
            // item.style.display = 'none';
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    };

    function showTabsContent(i = 0) {
        // tabsContent[i].style.display = 'block';
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };

    tabsPerent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabsContent();
                    showTabsContent(i);
                };
            });
        };

    });

    hideTabsContent();
    showTabsContent();

    // timer

    const deadline = '2023-07-01';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60) % 24));
            minutes = Math.floor((t / (1000 * 60) % 60));
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    };

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selection, endtime) {
        const timer = document.querySelector(selection);
        const days = timer.querySelector('#days');
        const hours = timer.querySelector('#hours');
        const minutes = timer.querySelector('#minutes');
        const seconds = timer.querySelector('#seconds');
        const timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            };
        };
    };

    setClock('.timer', deadline);

    // modal

    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector(".modal");
    // const modalCloseBtn = modal.querySelector('[data-close]');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    };



    // modalCloseBtn.addEventListener('click', closeModal);
    // тут ми видозмінили івент, і зробили його більш динамічним(?) через оператор ||
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        };
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        };
    });

    const modalTimerId = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        };
    };

    window.addEventListener('scroll', showModalByScroll);

    // використовуємо класи для карточок

    class MenuCard {
        constructor(src, alt, title, descr, price, perentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.perent = document.querySelector(perentSelector);
            this.transfer = 27;
            this.chengeToUAH();
        }

        chengeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(ClassName => element.classList.add(ClassName));
            }


            element.innerHTML = `
                <img src=${this.src} alt=${this.alt} >
                <h3 class="menu__item-subtitle">${this.title} </h3>
                <div class="menu__item-descr">${this.descr} </div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.perent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/sport.jpg",
        "vegy",
        'Меню "від секретаря Академії"',
        'Меню "від секретаря Академії" - це новий підхід до приготовлення страв, в якому вигляд страви немає значення(Бо це ж не від архитектора там якогось), хоч вони на вигляд не дуже апетитні, але користь для органіма ви точно отримаєте. <br><br>',
        9,
        '.menu .container',


    ).render();

    new MenuCard(
        "img/tabs/дід-2.jpg",
        "elite",
        'Меню “Преміум як у Діда”',
        'Меню “Преміум як у Діда” - ми використовуємо не тільки гарний дизайн пакування, але і якісне виконання страв за рецептом самих Архонтів. Відчуйте себе унікальним завдяки їх рецептурі <br> PS: рецепти Райден не додані до меню.',
        20,
        '.menu .container',
        'menu__item'

    ).render();

    new MenuCard(
        "img/tabs/junks-2.jpg",
        "post",
        'Меню "Пісне як сенен-ай"',
        'Наше спецеальне "Пісне як сенен-ай" меню - це винятковий підбір інгридіентів: повне відсутність продуктів твариного походження. Повна гармонія з собою та стриманість від сочних глав яою..<br><br><br>',
        15,
        '.menu .container',
        'menu__item'

    ).render();

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        // loading: 'Почекайте, дід оброблює інформацію',
        loading: 'img/form/spinner.svg',
        success: "Дякую котику! Ми скоро з тобою зв'яжемся, мяу~",
        failure: 'Ой..йой... щось пішло не так...'
    };

    forms.forEach(item => {
        postDate(item);
    });

    function postDate(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');

            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;
            // showThanksModal(message.loading);
            // statusMessage.textContent = message.loading;
            form.append(statusMessage);

            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            // request.setRequestHeader('Content-type', 'application/json');

            const formData = new FormData(form);

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            fetch('server.php', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },

            })

            // request.send(json);

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     };
            // });

        });

    };

    function showThanksModal(message) {
        const prevmodalDialog = document.querySelector('.modal__dialog');

        prevmodalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');

        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div> 
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevmodalDialog.classList.add('show');
            prevmodalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    };

    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => console.log(json))

});
