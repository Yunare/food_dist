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

    const slider = document.querySelectorAll('.offer__slide');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current = document.querySelector('#current');
    const sliderWrapper = document.querySelector('.offer__slider-wrapper');
    const sliderField = document.querySelector('.offer__alider-inner');
    const width = window.getComputedStyle(sliderWrapper).width;


    // треба опреділити тепершнє положення слайдеров завдяки шндексам

    let slideIndex = 1;
    let offset = 0;

    // Встановлюємо ширину потрібному блоку 
    sliderField.style.width = 100 * slider.length + "%";
    // ставимо наші слайди в ряд
    sliderField.style.display = 'flex';
    // щоб наші слайди плавно передвигались
    sliderField.style.transition = '0.5s all';
    // тепер ми скриваємо елементи які не потрапляють в область відомості
    sliderWrapper.style.overflow = 'hidden';


    // перебираємо наші слайди і встановлюємо потрібну ширину кожному
    slider.forEach(slide => {
        slide.style.width = width;
    });

    // тепер навішуємо івенти на наші стрілочки, щоб рухати наші слайди
    // Ми робимо це задопомоги того що би здвигаємо картинку вліво чи в право
    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slider.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        sliderField.style.transform = `transLateX(-${offset}px)`;

        if (slideIndex == slider.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slider.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = `slideIndex`
        }
    });
    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slider.length - 1)
        } else {
            offset -= +width.slice(0, width.length - 2);
        }

        sliderField.style.transform = `transLateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slider.length;
        } else {
            slideIndex--;
        }

        if (slider.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = `slideIndex`
        }

    });



    // Запускаємо функцію з потрібними даними

    // showSliders(slideIndex);

    // створюємо функцію яка буде показувати або скривати потрібний слайдер.
    //  Першим в нашій умові ми говоримо, що якщо індекс слайду буде більше ніж довжина слайдів взагалом(тобто слайд дійде до кінця) то ми повертаємо індекс слайду 1, і навпаки якщо наш індекс слайду буде дорівнювати менше 0 то ми його поветаємо на кількусть довжини слайду взагалом.



    // функціонал який підставляє нам нолик попереду цифри чи ні/ Ми змінюємо завдяки textContent  до потрібного нам елементу. 

    // if (slider.length < 10) {
    //     total.textContent = `0${slider.length}`;
    // } else {
    //     total.textContent = slider.length;
    // }

    // function showSliders(n) {
    //     if (n > slider.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slider.length;
    //     }

    // Далі по функционалу ми скриваємо  слайди/ Ми перебираємо елементи як масив(томущо воно видається нам як масив завдяки - querySelectorAll) і до кожного item ми приміняємо item.style.display = 'none' - аби скрити їх зі сторінки

    // slider.forEach(item => item.style.display = 'none');

    // тепер нам потрібно показати слайд який потрібно. Ми указуємо наш елемент з слайдерами, він у нас іде як масив. Тому показуємо його індекс і на потрібному слайді показумємо картинку

    // slider[slideIndex - 1].style.display = 'block';

    // Тут ми показуємо тепершній слайд (число)

    // if (slider.length < 10) {
    //     current.textContent = `0${slideIndex}`;
    // } else {
    //     current.textContent = slideIndex;
    // }
    // };


    // створюємо функционал який буде видоізміняти наш індекс при переключенію слайдів
    // ця функція буде визивати нашу попередню функцію яку ми створили showSliders(), та поміщаємо конструкцію slideIndex += n яка буде збільшена на ту кількість яка прийде.

    // function plusSlider(n) {
    //     showSliders(slideIndex += n);
    // }

    // обработчик подій на prev та next
    // prev на нього вішаємо обрабочик клік і коли це стається в нас в функції showSliders віднімається 1 що видозмінить індекс, і потім той індекс потрапить до функції showSliders() і змінить нам на потрібний слайдер
    // next тут майже все те саме але тільки добавляємо 1.

    // prev.addEventListener('click', () => {
    //     plusSlider(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlider(1);
    // });
});


