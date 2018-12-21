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
     */
    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: true,
            pagination: false
        }, options)
        let children = [].slice.call(element.children)
        this.currentitem = 0
        this.isMobile = false
        this.onMoveCallbacs = []

        // Modification du DOM
        this.root  = this.createDivWithClass('slider_content')
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
        this.createNavigation()
        this.createPagination()
        this.onWindowResize()
        this.onMoveCallbacs.forEach(cb => cb(0))
        window.addEventListener('resize', this.onWindowResize.bind((this)))
    }

    /**
     * Applique les bonnes dimentions aux élements du slider
     */
    setStyle () {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = (ratio * 100)+ "%"
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible / ratio) + '%'))
        for (let i = 0; i < this.items.length; i++){
            this.items[i].style.backgroundImage = "url(https://picsum.photos/1600/1300?image="+ i + 5 +")"
        }
    }

    onWindowResize () {
        let mobile = window.innerWidth < 800
        if (mobile ==! this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.onMoveCallbacs.forEach(cb => cb(this.currentitem))
        }
    }

    createNavigation () {
        let nextButton = this.createDivWithClass('slider_next')
        let prevButton = this.createDivWithClass('slider_prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true)  {
            return
        }
        this.onMove(index => {
            if (index === 0 ) {
                prevButton.classList.add('slider_prev--hidden')
            } else {
                prevButton.classList.remove('slider_prev--hidden')
            }
            if (this.items[this.currentitem + this.slidesVisible] === undefined){
                nextButton.classList.add('slider_next--hidden')
            } else {
                nextButton.classList.remove('slider_next--hidden')
            }
        })
    }
    createPagination () {

    }

    next () {
        this.gotToItem(this.currentitem + this.slidesToScroll)
    }
    prev () {
        this.gotToItem(this.currentitem - this.slidesToScroll)
    }

    /**
     *  Déplace le slider vers l'element ciblé
     * @param {number} index
     */
    gotToItem (index) {

        if (index < 0) {
            index = this.items.length - this.slidesVisible
        } else if (index >= this.items.length || (this.items[this.currentitem + this.options.slidesVisible] === undefined && index > this.currentitem)) {
            index = 0
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d('+ translateX +'%, 0, 0)'
        this.currentitem = index
        this.onMoveCallbacs.forEach(cb => cb(index))
    }

    /**
     *
     * @param {moveCallback} cb
     */
    onMove (cb) {
        this.onMoveCallbacs.push(cb)
    }

    /**
     *
     * @param {sting} className
     * @return {HTMLElement}
     */
    createDivWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }
    get slidesToScroll () {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }
    get slidesVisible () {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}
document.addEventListener('DOMContentLoaded', function () {

    new Slider(document.querySelector("#slider"),{
        slidesToScroll: 2,
        slidesVisible: 2,
        loop: true,
        pagination: true
    })

})
