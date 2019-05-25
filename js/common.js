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

        /**
         * обработка отправки формы Отправить заявку
         * Страница отзывов наших клиентов
         */
        $(document).on('click', '.clientReviewsBidButton', function () {
            var form = $(this).parents('.clientReviewsBidForm');
            form.find('.loader').removeClass('hidden');
            form.find(".error_massage").text(''); // очищаем все поля с ошибками
            form.find(".error_massage").addClass('hidden');
            form.find(".label_wrap").removeClass('error');
            var msg = form.serialize(); // собираем данные формы

            function success (data) {
                console.log(data);
                form.find('.loader').addClass('hidden');
                if (data.success) {
                    form.find("input, textarea").val('');// очищаем все поля с данными
                    var input = form.find("[name=success_text]");
                    input.next("span").html(data.success_text);
                    input.next("span").removeClass('hidden');
                } else {
                    // вписываем ошибки в поля с классом text_error по соответствующим name'ам
                    $.each(data.alert, function (key, value) {
                        var input = form.find("[name=" + key + "]");
                        form.find("." + key + "Input").addClass('error');
                        input.next("span.error_massage").html(value);
                        input.next("span.error_massage").removeClass('hidden');
                    });
                }
            }

            $.post(
                reviews_ajax.ajaxurl, // путь к файлу обработчику
                {
                    data: msg,
                    nonce: reviews_ajax.nonce_bid,
                    action: reviews_ajax.action_bid
                },
                success.bind(this),
                "json"
            );
            return false;
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

        $('.js-masked, .js_popup_call input[name=phone], .maske_phone').mask('+38(000) 00-00-000');

        $('.js_call-sticky').sticky({topSpacing:0});

    });

    //Fixed header
    $(document).on('ready load scroll resize',function () {
        if($(window).width() >= 1200){
            if($(window).scrollTop() >= 1){
                $('.header').addClass('header_fix');
                $('.popup_call').addClass('popup_call_open');
                $('.ads_logo img').addClass('logoscreen_in');
            }else{
                $('.header').removeClass('header_fix');
                $('.popup_call').removeClass('popup_call_open');
                $('.ads_logo img').removeClass('logoscreen_in');
                $('.sticky-wrapper').addClass('sticky_edit');
            }
        }
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


    /*mmenu*/
    /*Animation*/

    var wow = new WOW(
        {
            boxClass:     'wow',      // default
            animateClass: 'animated', // default
            offset:       0,          // default
            mobile:       false,       // default
            live:         true        // default
        }
    );
    wow.init();

    /*Animation*/

	/*SEO js*/
	 // Табы
    var init_tabs = function () {
        var tabs = $('#tabs');
        $('.tabs-content.tab-content-inner > div', tabs).each(function(i){
            if ( i != 0 ) $(this).hide('slow');
        });
        tabs.on('click', '.tabs a', function(e){
            e.preventDefault();
            var tabId = $(this).attr('href');
            $('.tabs a',tabs).removeClass();
            $(this).addClass('active');
            $('.tabs-content.tab-content-inner > div', tabs).hide('slow');
            $(tabId).show('slow');
        });

        $('.mobile-accordion-title').click(function(){
            if($(this).hasClass('mobile-accordion-title-active')){
                $(this).removeClass('mobile-accordion-title-active');
                $(this).siblings('.mobile-accordion-content').slideUp(500);
            }else{
                $('.mobile-accordion-title').removeClass('mobile-accordion-title-active');
                $(this).addClass('mobile-accordion-title-active');
                $('.mobile-accordion-content').slideUp(500);
                $(this).siblings('.mobile-accordion-content').slideDown(500);
            }
        });

        // Мобильная версия
        if ( window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches ) {
            $('.mobile-accordion-inner').removeClass('hidden');
        } else
        if ( window.matchMedia('(min-width: 480px) and (max-width: 767px)').matches ) {
            $('.mobile-accordion-inner').removeClass('hidden');
        } else
        if ( window.matchMedia('(min-width: 320px) and (max-width: 479px)').matches ) {
            $('.mobile-accordion-inner').removeClass('hidden');
        }

    };  init_tabs();

    // Клонирывание елементов таба.
    var init_tab_content_clone = function () {
        var tabContentClone = {
            _title: function () {
                $('.titleSiteSearchAudit').html($('.siteSearchAudit').html());
                $('.titleSelectionSemanticKernel').html($('.selectionSemanticKernel').html());
                $('.titleInternalOptimization').html($('.internalOptimization').html());
                $('.titleExternalOptimization').html($('.externalOptimization').html());
                $('.titleMakingReport').html($('.makingReport').html());
            },
            _content: function () {
                $('.contentSiteSearchAudit').html($('#siteSearchAudit').html());
                $('.contentSelectionSemanticKernel').html($('#selectionSemanticKernel').html());
                $('.contentInternalOptimization').html($('#internalOptimization').html());
                $('.contentExternalOptimization').html($('#externalOptimization').html());
                $('.contentMakingReport').html($('#makingReport').html());
            }
        };
        tabContentClone._title();
        tabContentClone._content();
    };  init_tab_content_clone();

    $('.review-slider-item').addClass('hidden');
    // Слайдер комментариев
    $(document).ready(function () {
        $('.review-slider-item').removeClass('hidden');
        var init_review_slider = function () {

            var $review_btn, $review_slider = $('.review-slider-item');
            $review_btn = $('.slide-arrow-right');
            $review_slider.slick({
                autoPlay:false,
                fade:false,
                dots:false,
                arrows:false,
                infinite:true,
                pauseOnHover:false,
                pauseOnDotsHover:false,
                speed:500,
                slidesToShow:2,
                slidesToScroll:1,
                responsive:[{
                    breakpoint:480,
                    settings:{
                        autoPlay:false,
                        fade:false,
                        dots:false,
                        arrows:false,
                        infinite:true,
                        pauseOnHover:false,
                        pauseOnDotsHover:false,
                        speed:500,
                        slidesToShow:1,
                        slidesToScroll:1
                    }
                },{
                    breakpoint:479,
                    settings:{
                        autoPlay:false,
                        fade:false,
                        dots:false,
                        arrows:false,
                        infinite:true,
                        pauseOnHover:false,
                        pauseOnDotsHover:false,
                        speed:500,
                        slidesToShow:1,
                        slidesToScroll:1
                    }
                }]
            });

            $review_slider.removeClass('hidden');
            $review_btn.click(function(){ $review_slider.slick('slickNext'); });

        };  init_review_slider();
    });

    // Сео текст
    var init_spoler_seo_text = function () {
        $(function(){
            var spolerContent = $('.spoler-seo-content'),
                animateTime = 750,
                readMoreLink = $('.spoler-seo-item .link-inner .link-read-more');
                readMoreLink.click(function(){
                    if( spolerContent.height() === 75 ){
                        autoHeightAnimate( spolerContent, animateTime );
                    } else {
                        spolerContent.stop().animate({ height: '75' }, animateTime );
                    }

                    if( readMoreLink.hasClass('link-read-more-active') ){
                        $(this).removeClass('link-read-more-active').html( 'Читать полностью...' );
                        spolerContent.removeClass('active-seo-content');
                        $(this).addClass('link-read-more');
                    }else{
                        readMoreLink.removeClass('link-read-more-active');
                        spolerContent.addClass('active-seo-content');
                        $(this).addClass('link-read-more-active').html( 'Скрыть текст...' );
                        $(this).removeClass('link-read-more');
                    }
                });
        });
        function autoHeightAnimate( element, time ){
            var curHeight = element.height(),
                autoHeight = element.css('height', 'auto').height();

                element.height( curHeight );
                element.stop().animate({ height: autoHeight }, time);
        }
    };  init_spoler_seo_text();

    var init_spoler_logo_brend = function () {
        $(function(){
            var spolerLogoBrend = $('.we-work-with-section-item'),
                animateTime = 750,
                readMoreLink = $('.we-work-with-section-inner .link-inner .link-work-with-read-more');
                readMoreLink.click(function(){
                    if ( window.matchMedia('(min-width: 480px) and (max-width: 767px)').matches ) {
                        if( spolerLogoBrend.height() === 300 ){
                            autoHeightAnimate(spolerLogoBrend, animateTime);
                        } else {
                            spolerLogoBrend.stop().animate({ height: '300' }, animateTime);
                        }
                    }
                    if ( window.matchMedia('(min-width: 320px) and (max-width: 479px)').matches ) {
                        if( spolerLogoBrend.height() === 500 ){
                            autoHeightAnimate(spolerLogoBrend, animateTime);
                        } else {
                            spolerLogoBrend.stop().animate({ height: '500' }, animateTime);
                        }
                    }

                    if( readMoreLink.hasClass('link-work-with-read-more-active') ){
                        $(this).removeClass('link-work-with-read-more-active').html( 'Показать больше...' );
                        spolerLogoBrend.removeClass('active-seo-content');
                        $(this).addClass('link-work-with-read-more');
                    }else{
                        readMoreLink.removeClass('link-work-with-read-more-active');
                        spolerLogoBrend.addClass('active-seo-content');
                        $(this).addClass('link-work-with-read-more-active').html( 'Скрыть содержимое...' );
                        $(this).removeClass('link-work-with-read-more');
                    }
                });
        });
        function autoHeightAnimate(element, time){
            var curHeight = element.height(),
                autoHeight = element.css('height', 'auto').height();

            element.height(curHeight);
            element.stop().animate({ height: autoHeight }, time);
        }
    };  init_spoler_logo_brend();

    /*SMM js*/

    $('.slider-text, .slider-works, .js-slider-case').removeClass('hidden');

    //============  SLICK SLIDER
    $('.slider-text').slick({
        lazyLoad: 'ondemand',
        infinite: true,
        speed: 300,
        slidesToShow: 2,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.slider-works').slick({
        lazyLoad: 'ondemand',
        infinite: true,
        speed: 300,
        slidesToShow: 6,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.js-slider-case').slick({
        lazyLoad: 'ondemand',
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        dots: false,
        arrows: true,
        responsive: []
    });
    /*SMM js*/

    $('.js-review-slider').slick({
        autoPlay:false,
        fade:false,
        dots:false,
        arrows:false,
        infinite:true,
        pauseOnHover:false,
        pauseOnDotsHover:false,
        speed:500,
        slidesToShow:2,
        slidesToScroll:1,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]

        // responsive:[{
        //     breakpoint:480,
        //     settings:{
        //         autoPlay:false,
        //         fade:false,
        //         dots:false,
        //         arrows:false,
        //         infinite:true,
        //         pauseOnHover:false,
        //         pauseOnDotsHover:false,
        //         speed:500,
        //         slidesToShow:1,
        //         slidesToScroll:1
        //     }
        // },{
        //     breakpoint:479,
        //     settings:{
        //         autoPlay:false,
        //         fade:false,
        //         dots:false,
        //         arrows:false,
        //         infinite:true,
        //         pauseOnHover:false,
        //         pauseOnDotsHover:false,
        //         speed:500,
        //         slidesToShow:1,
        //         slidesToScroll:1
        //     }
        // }]
    });




    // Скрыл фото авторов комментариев.
    $('.review-photo:not(.e-review-photo)').addClass('hidden');

    $(function () {
        var adsGlobal = window || {} && this;
        /**
         *  Media responsive.
         *  @Param  media_min_width = Number.
         *  @Param  media_max_width = Number.
         *  @Param  callback function to handlers.
         */
        adsGlobal.get_media_responsive__ = (function ( media_min_width, media_max_width, mediaCallback ) {
            if ( window.matchMedia( `(min-width: ${ media_min_width }px)` ).matches && window.matchMedia( `(max-width: ${ media_max_width }px)` ).matches ) {
                if ( mediaCallback.readyState ) {  //IE
                    mediaCallback.onreadystatechange = function() {
                        if ( mediaCallback.readyState === 'loaded' || mediaCallback.readyState === 'complete' || mediaCallback.readyState === 'interactive' ) {
                            mediaCallback.onreadystatechange = null;
                            mediaCallback();
                        }
                    };
                } else {  //Others
                    mediaCallback.onload = function() {
                        mediaCallback();
                    };
                }   return mediaCallback();
            }
        });

        function initClearPhoto () {
            var reviewsClientPhoto = '.reviews-our-client-footer-img.client-photo-img',
                notImg = '.reviews-our-client-content-inner.not-img',
                clientPhoto = $( reviewsClientPhoto ).find( 'img' );
                clientPhoto.each(function () {
                    if ( !$( this ).attr( 'src' ))
                          $( this ).parent( clientPhoto ).hide();

                    if ( $( this ).parent( clientPhoto ).attr( 'style' ))
                         $( this ).parent( clientPhoto ).next( $( '.reviews-our-client-footer-information' )).css({ 'padding': 0 });

                    if ( $( this ).parent( clientPhoto ).attr( 'style' ))
                         $( this ).parent( clientPhoto ).parent().parent().find( $( '.reviews-our-client-body' )).find( $( '.reviews-our-client-content-inner' )).addClass( 'not-img' );

                });

                $( notImg ).each(function () {
                    if ( $( notImg ).hasClass( 'not-img' ))
                         $( this ).parent().next( $( '.reviews-our-client-footer' )).find( $( '.reviews-our-client-footer-information' )).find( $( '.reviews-our-client-description' )).addClass( 'marginB' )
                });
        }   initClearPhoto();

        function initDinamicContent() {
            var reviewSection = '.reviews-section-item .row';
            if (reviewSection) {
                $(window).scroll(function() {
                    var pH = $( document ).height(),
                        wH = $( window ).height(),
                        wS = $( this ).scrollTop();
                    if ( parseInt(pH) === parseInt((wH + wS)) ){
                        var form = $('#pages');
                        var msg = form.serialize();
                        var loader = $('.bottom_loader');
                        if (loader && loader.hasClass('hidden')) {
                            loader.removeClass('hidden');
                            $.post(
                                reviews_ajax.ajaxurl, // путь к файлу обработчику
                                {
                                    data: msg,
                                    nonce: reviews_ajax.nonce,
                                    action: reviews_ajax.action
                                },
                                function (data) {
                                    var loader = $('.bottom_loader');
                                    if (data.html)
                                    {
                                        loader.addClass('hidden');
                                        var form = $('#pages');
                                        form.find('input[name="page"]').val(data.page);
                                        $( reviewSection ).append(data.html).masonry( 'reloadItems' );
                                        initMansory();
                                    }
                                    if (!data.haveNextPost) {
                                        loader.remove();
                                    }
                                },
                                "json"
                            );
                        }

                    }
                });
            }
        }   window.location.pathname === '/reviews-our-of-clients' ? initDinamicContent() : '';

        // function initMansory() {
            // var row = '.row-grid',
                // items = '.grid-items',
                // masonryOtions = {
                    // itemSelector:items,
                    // columnWidth:items
                // };  $( row ).masonry( masonryOtions );
        // }   initMansory();

        function initDotDotDot() {
            var reviewsClientContentText = '.js-wrap-review-content',
                reviewsClientContentTextParagraph = '.js-wrap-review-content > p',
                reviewsClientTitle = '.js-wrap-review-title',
                reviewsClientContentOptions = {
                    ellipsis:'...',
                    wrap:'word',
                    height:255,
                    fallbackToLetter:true,
                    watch:true
                },
                reviewsClientTitleOptions = {
                    ellipsis:'...',
                    wrap:'word',
                    height:100,
                    fallbackToLetter:true,
                    watch:true
                };
                lastWorlds();
                $( reviewsClientContentText ).dotdotdot( reviewsClientContentOptions );
                $( reviewsClientContentTextParagraph ).dotdotdot( reviewsClientContentOptions );
                $( reviewsClientTitle ).dotdotdot( reviewsClientTitleOptions );
        }   initDotDotDot();

        function initModalReview() {
            window.REMODAL_GLOBALS = {
                NAMESPACE: 'modal',
                DEFAULTS: {
                    hashTracking: false
                }
            };
            var reviewFooter = '.reviews-our-client-footer',
                reviewBody = '.reviews-our-client-body',
                modalAppendContent = '.js-modal-append-content',
                modalReviewHeader = '.reviews-our-client-header',
                modalReviewTitle = '.reviews-our-client-title',
                modalReviewLinks = '.reviews-our-clients-links',
                modalReviewInformation = '.reviews-our-client-footer-information',
                modalReviewClient = $( '[ data-remodal-target=js-review-client-modal ]' ).remodal();

                $(document).on('click', '.reviews-our-client-footer-text', function () {
                    var reviewContentHtml = $( this ).closest( $( reviewFooter )).siblings( reviewBody ).find( modalAppendContent ).html(),
                        reviewTitleHtml = $( this ).closest( $( reviewFooter )).siblings( reviewBody ).find( modalReviewHeader ).find( modalReviewTitle ).html(),
                        reviewLinks = $( this ).closest( $( reviewFooter )).siblings( reviewBody ).find( modalReviewHeader ).find( modalReviewLinks ).html(),
                        modalReviewInformationTitle = $( this ).closest( $( reviewFooter )).find( modalReviewInformation ).find( '.reviews-our-client-title' ).html(),
                        modalReviewInformationDescription = $( this ).closest( $( reviewFooter )).find( modalReviewInformation ).find( '.reviews-our-client-description' ).html(),
                        modalTitle = $( '.re-modal-header' ).find( '.reviews-our-client-title' ),
                        modalDescr = $( '.re-modal-header' ).find( '.reviews-our-client-description' ),
                        modalContent = $( '.re-modal-body' ).find( '.re-modal-content' ),
                        modalClientName = $( '.re-modal-footer' ).find( '.reviews-our-client-title' ),
                        modalClientRang = $( '.re-modal-footer' ).find( '.reviews-our-client-description' );

                        function showReModal() {
                            modalReviewClient.open();
                            modalTitle.html( reviewTitleHtml );
                            modalDescr.html( reviewLinks );
                            modalContent.html( reviewContentHtml );
                            modalClientName.html( modalReviewInformationTitle );
                            modalClientRang.html( modalReviewInformationDescription );
                            $('.re-modal-content').find($('p > iframe')).removeAttr('height');
                            $('.re-modal-content').find($('iframe')).removeAttr('height');
                        }   showReModal();

                });
        }   initModalReview();

        function lastWorlds(){
            $('.reviews-our-client-content-item p:last-child').each(function () {
                $( this ).html(function(){
                    var text= $(this).text().trim().split(' '),
                        last = text.pop();
                        return text.join(' ') + ( text.length > 0 ? " <span class='last-world-quote'>" + last + "</span>" : last );
                });
            });
        }

        function gridLayout(){
            if ( $('.reviews-section-item').find('.row').hasClass('row-grid') ){
                $('.reviews-section-item').find('.row').removeClass('row-grid');
            } else {
                $('.reviews-section-item').find('.row').addClass('row-grid');
            }
            if ( $('.reviews-section-item').find('.row').find('.col-md-6').hasClass( 'grid-items' ) ){
                $('.reviews-section-item').find('.row').find('.col-md-6').removeClass( 'grid-items' );
            } else {
                $('.reviews-section-item').find('.row').find('.col-md-6').addClass( 'grid-items' );
            }
            $('.reviews-section-item').find('.row').find('.col-md-6').removeAttr('style');
            $('.reviews-section-item').find('.row').removeAttr('style');
            return false;
        }

        function slickMainCase (){
            var caseSlider = '.case_slider',
                caseSliderOpt = {
                autoplay: false,
                autoplaySpeed: 3000,
                arrows: false,
                dots: true,
                infinite: true,
                focusOnSelect: false,
                pauseOnFocus: false,
                pauseOnHover: false,
                speed: 500,
                fade: true,
                cssEase: 'linear'
            };
            $( caseSlider ).slick( caseSliderOpt ).removeClass( 'hidden' );
        }   slickMainCase();

        get_media_responsive__(812, 812, function () {
            var reviewsClientContentText = '.js-wrap-review-content',
                reviewsClientContentTextParagraph = '.js-wrap-review-content > p',
                reviewsClientContentOptions = {
                    ellipsis:'...',
                    wrap:'word',
                    height:670,
                    fallbackToLetter:true,
                    watch:true
                };
                lastWorlds();
                $( reviewsClientContentText ).dotdotdot( reviewsClientContentOptions );
                $( reviewsClientContentTextParagraph ).dotdotdot( reviewsClientContentOptions );
        });
        get_media_responsive__(667, 667, function () {
            gridLayout();
        });
        get_media_responsive__(480, 480, function () {
            gridLayout();
        });
        get_media_responsive__(568, 568, function () {
            var reviewsClientContentText = '.js-wrap-review-content',
                reviewsClientContentTextParagraph = '.js-wrap-review-content > p',
                reviewsClientContentOptions = {
                    ellipsis:'...',
                    wrap:'word',
                    height:670,
                    fallbackToLetter:true,
                    watch:true
                };
                lastWorlds();
                $( reviewsClientContentText ).dotdotdot( reviewsClientContentOptions );
                $( reviewsClientContentTextParagraph ).dotdotdot( reviewsClientContentOptions );
                gridLayout();
        });
        get_media_responsive__(375, 375, function () {
            $('.reviews-section-item').find('.row').removeClass('row-grid');
            $('.reviews-section-item').find('.row').find('.col-md-6').removeClass( 'grid-items' );
            gridLayout();
        });
        get_media_responsive__(320, 479, function () {
            var reviewsClientContentText = '.js-wrap-review-content',
                reviewsClientContentTextParagraph = '.js-wrap-review-content > p',
                reviewsClientContentOptions = {
                    ellipsis:'...',
                    wrap:'word',
                    height:400,
                    fallbackToLetter:true,
                    watch:true
                };
                lastWorlds();
                $( reviewsClientContentText ).dotdotdot( reviewsClientContentOptions );
                $( reviewsClientContentTextParagraph ).dotdotdot( reviewsClientContentOptions );
                gridLayout();
        });
    });
});
