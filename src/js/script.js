window.addEventListener('DOMContentLoaded', () => {
    
    // products classes

    class Product {
        constructor (src, alt, subtitle, descr, oldPrice, newPrice, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.oldPrice = oldPrice;
            this.newPrice = newPrice;
            this.parent = document.querySelector(parentSelector);
        }
        render(){
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="catalog-item">
                    <div class="catalog-item__wrapper">
                        <div class="catalog-item__content catalog-item__content_active">
                            <img src=${this.src} alt=${this.alt} class="catalog-item__img">
                            <div class="catalog-item__subtitle">${this.subtitle}</div>
                            <div class="catalog-item__descr">${this.descr}</div>
                            <a href="" class="catalog-item__link">MORE DETAILS</a>
                        </div>
                        <ul class="catalog-item__list">
                            <li>During your workout, you will hear an audio alert for your target heart rate;</li>
                            <li>You will see an informative graphical indicator of target heart rate training zones.</li>
                            <li>You will also see information about calorie expenditure during the workout.</li>
                            <li>You will be able to view data for 10 workouts.</li>
                            <a href="" class="catalog-item__list__link">BACK</a>
                        </ul>
                    </div>
                    <hr>
                    <div class="catalog-item__footer">
                        <div class="catalog-item__price">
                            <div class="catalog-item__old-price">${this.oldPrice}</div>
                            <div class="catalog-item__new-price">${this.newPrice}</div>
                        </div>
                        <button data-modal="order" class="btn btn_buy">BUY</button>
                    </div>
                </div>

            `
            this.parent.append(div);
        }
    }
    

    // Server catalog

    async function fetchDataAndRender() {
        const response = await fetch('http://localhost:3000/catalog');
        const data = await response.json();
        data.forEach(({img, alt, subtitle, descr, oldPrice, newPrice, parent }) => {
        new Product (img, alt, subtitle, descr, oldPrice, newPrice, parent).render();
        });
        const buttonsOrder = document.querySelectorAll('[data-modal="order"]'),
              modalDescr = document.querySelector('#order .modal__descr'),
              productFront = document.querySelectorAll('.catalog-item__content'),
              productBack = document.querySelectorAll('.catalog-item__list'),
              catalogItem = document.querySelectorAll('.catalog-item');

        buttonsOrder.forEach(button => button.addEventListener('click', () => {
            const product = button.parentElement.parentElement;
            modalDescr.textContent = product.querySelector('.catalog-item__subtitle').textContent;
            openModal(modalOrder)
        }));

        catalogItem.forEach((item, i) => {
            item.addEventListener('click', (e) => {
                if(e.target && e.target.tagName == 'A'){
                e.preventDefault();
                productFront[i].classList.toggle('catalog-item__content_active');
                productBack[i].classList.toggle('catalog-item__list_active');   
                }
            })
        })

    }
      
    fetchDataAndRender();
      
      
    // modal сonsultation

    const modalConsultation = document.querySelector('#consultation'),
          modalOrder = document.querySelector('#order'),
          buttonsConsult = document.querySelectorAll('[data-modal="consultation"]'),
          overlay = document.querySelector('.overlay');
    
    const modalTimerId = setTimeout(() => {
            openModal(modalConsultation);
        }, 5000);

    function openModal(selector) {

        if(modalTimerId) {
            clearInterval(modalTimerId);
        }

        selector.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        selector.style.opacity = '0';
        requestAnimationFrame(()=>{
            selector.style.opacity = '1';
        })
    }
          
    function closeModal (selector) {
        selector.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    buttonsConsult.forEach(button => button.addEventListener('click', () => openModal(modalConsultation)));

    overlay.addEventListener('click', (e)=> {
        if (e.target == overlay || e.target.getAttribute('data-close') == '') {
            if(modalConsultation.style.display === 'block'){
                closeModal(modalConsultation);
            } else if(modalOrder.style.display === 'block'){
                closeModal(modalOrder);
            }
        }
        
    })

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && (window.getComputedStyle(modalConsultation).display === 'block' || window.getComputedStyle(modalOrder).display === 'block')) {
            if (window.getComputedStyle(modalConsultation).display === 'block'){
                closeModal(modalConsultation)
            } else {
                closeModal(modalOrder)
            }      
        }
    })


    // tabs

    const tabs = document.querySelectorAll('.catalog__tab'),
          catalogContent = document.querySelectorAll('.catalog__content');
          
          
          
    
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            tabs.forEach(elem => elem.classList.remove('catalog__tab_active'))  
            tab.classList.toggle('catalog__tab_active');
            catalogContent.forEach(item => item.classList.remove('catalog__content_active'));
            catalogContent[i].classList.add('catalog__content_active');
        })
    });


    // scroll top arrow

    const pageUp = document.querySelector('.pageup');

    window.addEventListener('scroll', () => {
        if (this.scrollY >= 1300) {
            pageUp.style.display = 'block';
            pageUp.classList.remove('pageup_hide');
            pageUp.classList.add('pageup_show');
            
        } else {
            pageUp.classList.remove('pageup_show');
            pageUp.classList.add('pageup_hide');
        }
      });


    
})