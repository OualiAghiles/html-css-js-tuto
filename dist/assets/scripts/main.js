class Slider {
    /**
     *
     * @param {HTMLElements} element
     * @param {object} options
     * @param {object} options.slidesToScroll "Nombre d'element a slider"
     * @param {object} options.slidesVisible "Nombre d'element Visible dans une vue"
     */
    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1
        }, options)
        let children = [].slice.call(element.children)
        this.currentitem = 0
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
    }

    /**
     * Applique les bonnes dimentions aux élements du slider
     */
    setStyle () {
        let ratio = this.items.length / this.options.slidesVisible
        this.container.style.width = (ratio * 100)+ "%"
        this.items.forEach(item => item.style.width = ((100 / this.options.slidesVisible / ratio) + '%'))
    }

    createNavigation () {
        let nextButton = this.createDivWithClass('slider_next')
        let prevButton = this.createDivWithClass('slider_prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
    }

    next () {
        this.gotToItem(this.currentitem + this.options.slidesToScroll)
    }
    prev () {
        this.gotToItem(this.currentitem - this.options.slidesToScroll)
    }

    /**
     *  Déplace le slider vers l'element ciblé
     * @param {number} index
     */
    gotToItem (index) {
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d('+ translateX +'%, 0, 0)'
        this.currentitem = index
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
}
document.addEventListener('DOMContentLoaded', function () {

    new Slider(document.querySelector("#slider"),{
        slidesToScroll: 1,
        slidesVisible: 1
    })

})
