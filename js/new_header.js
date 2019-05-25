/**
 * Показать модалку анимационно
 * @param overlay background popUp
 * @param time время анимации
 * @param div блок который хотим показать
 */
function animateShowModal (overlay, time, div) {
    overlay.fadeIn(time, showModal(div));
}

/**
 *
 * @param div
 */
function showModal (div) {
    $(div)
        .css('display', 'block')
        .animate({opacity: 1, top: '50%'}, 200);
}
