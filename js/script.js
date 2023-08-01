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

    const deadline = '2023-09-01';

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

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // внизу ми визивали функцію яку ми самі створила, аби отримати нам потрібні даніі

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({ img, altimg, title, descr, price }) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });


    // А тут ми використовуємо бібліотеку


    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        // loading: 'Почекайте, дід оброблює інформацію',
        loading: 'img/form/spinner.svg',
        success: "Дякую котику! Ми скоро з тобою зв'яжемся, мяу~",
        failure: 'Ой..йой... щось пішло не так...'
    };

    forms.forEach(item => {
        bindPostDate(item);
    });

    const postDate = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostDate(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');

            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            form.append(statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postDate('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
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


    // Slider


    // отримуємо доступ до елементів на сторінці з якими ми будемо працювати

    const slides = document.querySelectorAll('.offer__slide');
    const slider = document.querySelector('.offer__slider');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const slidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;

    // треба опреділити тепершнє положення слайдеров завдяки шндексам

    let slideIndex = 1;
    let offset = 0;

    // функціонал який підставляє нам нолик попереду цифри чи ні/ Ми змінюємо завдяки textContent  до потрібного нам елементу. 

    const showNomber_0 = () => {
        if (slides.length < 10) {
            total.textContent = `0${slides.length}`;
            current.textContent = `0${slideIndex}`;
        } else {
            total.textContent = slides.length;
            current.textContent = slideIndex;
        }
    };

    showNomber_0();

    // Встановлюємо ширину потрібному блоку 
    slidesField.style.width = 100 * slides.length + "%";
    // ставимо наші слайди в ряд
    slidesField.style.display = 'flex';
    // щоб наші слайди плавно передвигались
    slidesField.style.transition = '0.5s all';
    // тепер ми скриваємо елементи які не потрапляють в область відомості
    slidesWrapper.style.overflow = 'hidden';


    // перебираємо наші слайди і встановлюємо потрібну ширину кожному
    slides.forEach(slide => {
        slide.style.width = width;
    });

    // Модефікація слайдів

    // блок з слайдерами ставим позицію релатів щоб нормально отображались елементи
    slider.style.position = 'relative';

    // добавляється дотси до наших слайдів завждяки CSS
    const indicators = document.createElement('ol');
    // створюємо пустий масив в який згодом положимо наші дотси (лішки - ті полоски)
    const dots = [];
    // добаваляємо не существующий клас для отображенія
    indicators.classList.add('carousel-indicators');
    // стілізуємо наш блок
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    // Добавляємо нашу обертку в нутирь нашого слайдера
    slider.append(indicators);

    // тепер нам треба помістити в створений блок наші слайди
    for (let i = 0; i < slides.length; i++) {

        const dot = document.createElement('li');

        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
    `;

        if (i == 0) {
            dot.style.opacity = 1;
        }
        // добавляємо в індікатори самі дотси
        indicators.append(dot);
        // Добавляємо в масив новостворені дотси
        dots.push(dot);
    }

    // створення функції - там де вказуємо ширину не відображались букви
    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }
    // тепер навішуємо івенти на наші стрілочки, щоб рухати наші слайди
    // Ми робимо це задопомоги того що би здвигаємо картинку вліво чи в право

    // створення функції показу активності дотсів(щоб не повторявся код по декілька разів)
    const showDotsOpacity = () => {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = '1';
    }
    next.addEventListener('click', () => {
        // використовування методу реплейс(регулярних виразах) ми таким чином убираємо не потрібні нам букви (px) які не потрібні для нашої ширини
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }

        slidesField.style.transform = `transLateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        showNomber_0();

        showDotsOpacity();
    });


    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1)
        } else {
            offset -= deleteNotDigits(width);
        }

        slidesField.style.transform = `transLateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        showNomber_0();

        showDotsOpacity();
    });

    // console.log(slideIndex);

    // Функціонал який дозволяє клікать на дотси і воно перемекає на потрібний нам слайд
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {

            const slideTo = e.target.getAttribute('data-slide-to');
            // console.log(slideTo);
            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);

            slidesField.style.transform = `transLateX(-${offset}px)`;

            showNomber_0();

            showDotsOpacity();
        });

        // Запускаємо функцію з потрібними даними

        // showSliders(slideIndex);

        // створюємо функцію яка буде показувати або скривати потрібний слайдер.
        //  Першим в нашій умові ми говоримо, що якщо індекс слайду буде більше ніж довжина слайдів взагалом(тобто слайд дійде до кінця) то ми повертаємо індекс слайду 1, і навпаки якщо наш індекс слайду буде дорівнювати менше 0 то ми його поветаємо на кількусть довжини слайду взагалом.

        // function showSliders(n) {
        //     if (n > slides.length) {
        //         slideIndex = 1;
        //     }

        //     if (n < 1) {
        //         slideIndex = slider.length;
        //     }

        //     // Далі по функционалу ми скриваємо  слайди/ Ми перебираємо елементи як масив(томущо воно видається нам як масив завдяки - querySelectorAll) і до кожного item ми приміняємо item.style.display = 'none' - аби скрити їх зі сторінки

        //     slider.forEach(item => item.style.display = 'none');

        //     // тепер нам потрібно показати слайд який потрібно. Ми указуємо наш елемент з слайдерами, він у нас іде як масив. Тому показуємо його індекс і на потрібному слайді показумємо картинку

        //     slider[slideIndex - 1].style.display = 'block';

        //     // Тут ми показуємо тепершній слайд (число)

        //     if (slider.length < 10) {
        //         current.textContent = `0${slideIndex}`;
        //     } else {
        //         current.textContent = slideIndex;
        //     }
        // };


        // створюємо функционал який буде видоізміняти наш індекс при переключенію слайдів
        // ця функція буде визивати нашу попередню функцію яку ми створили showSliders(), та поміщаємо конструкцію slideIndex += n яка буде збільшена на ту кількість яка прийде.

        function plusSlider(n) {
            showSliders(slideIndex += n);
        };

        // обработчик подій на prev та next
        // prev на нього вішаємо обрабочик клік і коли це стається в нас в функції showSliders віднімається 1 що видозмінить індекс, і потім той індекс потрапить до функції showSliders() і змінить нам на потрібний слайдер
        // next тут майже все те саме але тільки добавляємо 1.

        prev.addEventListener('click', () => {
            plusSlider(-1);
        });

        next.addEventListener('click', () => {
            plusSlider(1);
        });
    });


    // Calc початок 97 урок

    // Отримуємо доступ до потрібних нам елементів
    const result = document.querySelector('.calculating__result span');



    let sex = '';
    let haight = null;
    let weight = null;
    let age = null;
    let ratio = 0;


    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    };


    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    };


    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            };
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            };
        })
    };

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big', 'calculating__choose-item_active');

    console.log(result);
    // створюємо формулу яка буде розраховувати нам нашу дозу?

    function calcTotal() {
        // прописуємо умову, якщо щось не вказано то формула далі не буде нічого розраховувати, та видать нам повідомлення 
        if (!sex || !haight || !weight || !age || !ratio) {
            result.textContent = 'Котику, ти щось забув вказати~';
            return;
        };
        // сама формула розрахунку
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * haight) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.6 * haight) - (5.7 * age)) * ratio);
        }
    };

    calcTotal();

    // створюємо функцію щоб отримувати інформацію з статичних блоків

    function getStaticInformation(selector, activeClass) {
        const element = document.querySelectorAll(selector);

        element.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                console.log(ratio, sex);

                element.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    };

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            };

            switch (input.getAttribute('id')) {
                case 'height':
                    haight = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            };
            calcTotal();
        });


    };

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});
