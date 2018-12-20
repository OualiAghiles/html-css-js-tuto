class Slider {
    /**
     *
     * @param {HTMLElements} element
     * @param {object} options
     * @param {object} options.slidesToScroll "Nombre d'element a slider"
     * @param {object} options.slidesVisible "Nombre d'element Visible dans une vue"
     */
    constructor (element, options = {}) {
        console.log('bien charger')
    }
}
document.addEventListener('domContentLoaded', function () {

    new slider(document.querySelector("#slider"),{
        slidesToScroll: 1,
        slidesVisible: 1
    })

})
