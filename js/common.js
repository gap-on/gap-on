$(function() {
    $(document).ready(function() {
        function divresize() {
            var windowHeight = $(window).height() - 60;
            $('.menu').css('height', windowHeight);
        }
        divresize();
        $(window).resize(function () {
            divresize();
        });
    });

    var empt = $('.js-empty_inp');
    $('.placeholder').animate({
        'opacity':1
    },0);
    $(document).on('focus', '.js-empty_inp', function () {
        $(this).prev('.js-placeholder').animate({
            'opacity':0
        },300);
        $(document).on('blur', '.js-empty_inp', function () {
            if($(this).val() == ''){
                $(this).prev('.js-placeholder').animate({
                    'opacity':1
                },300);
            }else{
                $(this).prev('.js-placeholder').removeClass('display');
            }
        });
    });

    var txtOpt = $('.js-aria_opt');
        txtOpt.focus(function () {
            $(this).parent('.js-area').animate({
                'height':'50px'
            },300);
            txtOpt.blur(function () {
                if($(this).val() == ''){
                $(this).parent('.js-area').animate({
                    'height':'30px'
                },300);
                }else {
                    $(this).parent('.js-area').animate({
                        'height': '50px'
                    }, 300);
                }
            });
        });
    $('.menu').hide();
    $(document).ready(function () {
        $('.menu').show();
        $('.menu_wrap').click(function () {
            $('.menu').addClass('open_menu_slide');
            $('.menu_overlay').css('display','block')
        });
        $('.closeModalIcon,.menu_overlay').click(function () {
            $('.menu').removeClass('open_menu_slide');
            $('.menu_overlay').attr('style','');
        });
    });

    /*Anchors*/
    $('.js-anchor').on('click', function(e){
        e.preventDefault();
        var t = 700,
            h = $('.header_wrap').height(),
            d = $(this).attr('data-href') ? $(this).attr('data-href') : $(this).attr('href');
        $('html,body').stop().animate({ scrollTop: $(d).offset().top - h }, t);
    });

    var lastId,
        topMenu = $(".anchors"),
        topMenuHeight = 65,
        menuItems = topMenu.find("a"),
        scrollItems = menuItems.map(function(){
            var item = $($(this).attr("href"));
            if (item.length) { return item; }
        });
    menuItems.click(function(e){
        var href = $(this).attr("href"),
            offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 700);
        console.log($(this).attr("href"));
        e.preventDefault();
    });
    $(window).on('scroll load',function(){
        var fromTop = $(this).scrollTop() + topMenuHeight + 1,
            cur = scrollItems.map(function(){
                if ($(this).offset().top < fromTop){
                    return this;
                }
            });
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            menuItems
                .removeClass("active_screen")
                .filter("[href='#"+ lastId +"']").addClass("active_screen");
        }
    });
    /*Anchors*/
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
    function showModal (div){
        $(div)
            .css('display', 'block')
            .animate({opacity: 1, top: '50%'}, 200);
    }
    /*Modal*/
    $(document).ready(function() {
        var overlay = $('#overlay'),
            openModal = $('.js-thank_btn'),
            close = $('.modal1_close_button,.modal_close_wrap, #overlay'),
            modal = $('.modalDiv');

        openModal.click( function(e){
            e.preventDefault();
            var div = $(this).attr('data-href');
            animateShowModal(overlay, 400, div);
        });

        close.click( function(){
            modal
                .animate({opacity: 0, top: '50%'}, 200,
                    funcCloseModal()
                );
        });

        //============  ESCAPE key pressed
        $(document).keydown(function(e) {
            if (e.keyCode == 27) {
                modal
                    .animate({opacity: 0, top: '60%'}, 200,
                        funcCloseModal()
                    );
            }
        });
        function funcCloseModal() {
            var that = $(this);

            that.css('display', 'none');
            overlay.fadeOut(400);

            setTimeout(function () {
                modal.removeAttr('style');
            }, 600);
        };

        $('.close_thankModal').click(function () {
            $('.thankModal').animate({opacity: 0, top: '50%'}, 400).css('display', 'none');
            overlay.fadeOut(400);
        });
        $('.menu_thank_modal').click(function (e) {
            e.preventDefault();
            $('.menu').removeClass('open_menu_slide');
            overlay.fadeIn(400,
                function(){
                    $('.thankModal')
                        .css('display', 'block')
                        .animate({opacity: 1, top: '50%'}, 200);
                });
        });
    });
    /*Modal*/
    /*mmenu*/
    $(document).ready(function () {
        $('.header-mobile , #myMenu').removeClass('hidden');
        //============  MMENU
        $('#myMenu').mmenu({
            extensions: [ 'effect-menu-slide','pagedim-black'],
            navbar: {
                title: '<div class="ads_logo">\n' +
                '            <img src="img/gap_header_logo.png" alt="" class="logoscreen_out_mmenu">\n' +
                '        </div>'
            },
            offCanvas: {
                position: 'left'
            }
        });
        var apiButt = $('#myMenu').data('mmenu');
        apiButt.bind('open:finish', function() {
            $('.hamburger').addClass('is-active');
        });
        apiButt.bind('close:finish', function() {
            $('.hamburger').removeClass('is-active');
        });
    });

});
    /*mmenu*/