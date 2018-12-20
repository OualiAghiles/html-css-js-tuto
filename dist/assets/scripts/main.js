class Slider {
    /**
     *
     * @param {HTMLElements} element
     * @param {object} options
     * @param {object} options.slidesToScroll "Nombre d'element a slider"
     * @param {object} options.slidesVisible "Nombre d'element Visible dans une vue"
     */
    constructor (element, options = {}) {
        this.element = element;
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1
        }, options);
        this.children = [].slice.call(element.children);
        let root = this.createDivWithClass('slider_content');
        let container = this.createDivWithClass('slider_container');
        root.appendChild(container);
        this.element.appendChild(root);
        this.children.forEach(function (child) {
            container.appendChild(child)
        })
    }

    /**
     *
     * @param {string} className
     * @returns {HTMLElement}
     */
    createDivWithClass(className){
        let div = document.createElement('div');
        div.setAttribute('class',className);
        return div
    }
}
document.addEventListener('DOMContentLoaded', function () {

    new Slider(document.querySelector("#slider"),{
        slidesToScroll: 1,
        slidesVisible: 1
    })

})
