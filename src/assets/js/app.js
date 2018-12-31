class Slider {


    /**
     * This callback is displayed as part of the Requester class.
     * @callback moveCallback
     * @param {number} index
     */


    /**
     *
     * @param {HTMLElements} element
     * @param {object} options
     * @param {object} [options.slidesToScroll=1] "Nombre d'element a slider"
     * @param {object} [options.slidesVisible=1] "Nombre d'element Visible dans une vue"
     * @param {boolean} [options.loop=true] permet de boucler en fin de slides ( oui ou non ?)
     * @param {boolean} [options.pagination=false] permet d'avoir une pagination pour les slides ( oui ou non ?)
     * @param {boolean} [options.navigation=true] permet d'avoir une navigation pour les slides ( oui ou non ?)
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: true,
            pagination: true,
            navigation: true
        }, options)
        let children = [].slice.call(element.children)
        this.currentitem = 0
        this.isMobile = false
        this.onMoveCallbacs = []

        // Modification du DOM
        this.root = this.createDivWithClass('slider_content')
        this.container = this.createDivWithClass('slider_container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('slider_item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        if (this.options.navigation) {
            this.createNavigation()
        }
        if (this.options.pagination) {

            this.createPagination()
        }
        this.onWindowResize()
        this.onMoveCallbacs.forEach(cb => cb(0))
        window.addEventListener('resize', this.onWindowResize.bind((this)))
    }

    /**
     * Applique les bonnes dimentions aux élements du slider
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible / ratio) + '%'))
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].style.backgroundImage = "url(https://picsum.photos/1600/1300?image=" + i + 6 + ")"
        }


    }

    onWindowResize() {
        let mobile = window.innerWidth < 900
        if (mobile == !this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.onMoveCallbacs.forEach(cb => cb(this.currentitem))
        }
    }

    createNavigation() {
        let nextButton = this.createDivWithClass('slider_next')
        let prevButton = this.createDivWithClass('slider_prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('slider_prev--hidden')
            } else {
                prevButton.classList.remove('slider_prev--hidden')
            }
            if (this.items[this.currentitem + this.slidesVisible] === undefined) {
                nextButton.classList.add('slider_next--hidden')
            } else {
                nextButton.classList.remove('slider_next--hidden')
            }
        })
    }

    createPagination() {
        let pagination = this.createDivWithClass('pagination')
        let dots = []
        this.root.appendChild(pagination)
        // boucle pour generer les puce selon le nombre de slide existant
        for (let i = 0; i < this.items.length; i = i + this.options.slidesToScroll) {
            // creation des puces selon le nombre de slide
            let dot = this.createDivWithClass('pagination_dot')
            // ajout de l'evenement au click en appelant la methode goToItem
            dot.addEventListener('click', () => this.gotToItem(i))
            // ajoute les puces dans la div pagination
            pagination.appendChild(dot)
            // ajout des puce dans le tableau
            dots.push(dot)
        }

        this.onMove(index => {
            let activeDot = dots[Math.floor(index / this.options.slidesToScroll)]
            if (activeDot) {
                dots.forEach(dot => dot.classList.remove('active'))
                activeDot.classList.add('active')
            }
        })
    }

    next() {
        this.gotToItem(this.currentitem + this.slidesToScroll)
    }

    prev() {
        this.gotToItem(this.currentitem - this.slidesToScroll)
    }

    /**
     *  Déplace le slider vers l'element ciblé
     * @param {number} index
     */
    gotToItem(index) {

        if (index < 0) {
            index = this.items.length - this.slidesVisible
        } else if (index >= this.items.length || (this.items[this.currentitem + this.options.slidesVisible] === undefined && index > this.currentitem)) {
            index = 0
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentitem = index
        this.onMoveCallbacs.forEach(cb => cb(index))
    }

    /**
     *
     * @param {moveCallback} cb
     */
    onMove(cb) {
        this.onMoveCallbacs.push(cb)
    }

    /**
     *
     * @param {sting} className
     * @return {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}


// responsive menu

class MobileMenuNav {
    /**
     *
     * @param {HTMLElement} element (humberger element )
     * @param {string} mobileMenu ( class to ul links on mobile )
     */
  constructor (element, mobileMenu) {
    this.element = element
    this.cloneMenu()
    let content = this.element.parentNode.parentNode
    content.appendChild(this.cloneMenu())
    this.nav = mobileMenu
    this.menuChild = document.querySelector(this.nav)
    // mobile menu
    this.element.addEventListener('click', (e)=> {
        e.preventDefault()
        this.element.classList.toggle('open')
        this.menuChild.classList.toggle('open')
    })
  }

    /**
     * clone the menu
     * @return {HTMLElement}
     */
  cloneMenu() {
      let menu = document.querySelector('.navigation ul')
      let clone = menu.cloneNode(true)
      clone.classList.add('mobile_menu')
      return clone
  }
}


// scroll events

class ScrollEvent {
    constructor () {

        this.wScrollY()
        window.addEventListener('scroll',() => this.onScroll())

    }
    wScrollY () {
        let supportPageOffset = window.pageXOffset !== undefined;
        let isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop
    }
    onScroll () {
        let element = document.querySelector('nav')
        let top = 100
        console.log('top =' + top)
        console.log('scroll =' + this.wScrollY())
        let hasClass = element.classList.contains('light')
        if (this.wScrollY() > top && !hasClass) {
            element.style.background = '#ffffff'
            element.classList.add('light')

        } else {
            element.style.background = 'transparent'
            element.classList.remove('light')
        }

    }
}


// execution
document.addEventListener('DOMContentLoaded', function () {
    // slider
    new Slider(document.querySelector("#slider"),{
        slidesToScroll: 1,
        slidesVisible: 1,
        loop: false,
        pagination: true,
        navigation: true
    });
    new MobileMenuNav(document.querySelector('.humberger'), '.mobile_menu')
    new ScrollEvent()
})
