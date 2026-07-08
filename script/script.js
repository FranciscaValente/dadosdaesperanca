$(document).ready(function() {


    $('.faqHeader').on('click', function() {
        var card = $(this).parent('.faqCard');
        if(card.hasClass('active')) {
            card.removeClass('active');
            $(this).next('.faqContent').slideUp(300);
        } else {
            $('.faqCard').removeClass('active');
            $('.faqContent').slideUp(300);
            card.addClass('active');
            $(this).next('.faqContent').slideDown(300);
        }
    });


    var themeToggleBtn = $('#darkModeToggle');
    var bodyElement = $('body');
    
    function applyTheme(isDark) {
        if (isDark) {
            bodyElement.addClass('dark-mode');
            themeToggleBtn.html('Modo Claro ☀️');
        } else {
            bodyElement.removeClass('dark-mode');
            themeToggleBtn.html('Modo Escuro 🌙');
        }
    }

    var savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    themeToggleBtn.on('click', function(e) {
        e.preventDefault();
        var isDarkNow = bodyElement.hasClass('dark-mode');
        var newDarkState = !isDarkNow;
        applyTheme(newDarkState);
        localStorage.setItem('theme', newDarkState ? 'dark' : 'light');
    });

    var btnTopo = $('#btnTopo');
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) { 
            btnTopo.fadeIn(); 
        } else { 
            btnTopo.fadeOut(); 
        }
    });

    btnTopo.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    function initCarousel() {
        var track = $('.carouselTrack');
        var cards = $('.galeriaCard');
        var prevBtn = $('.prevBtn');
        var nextBtn = $('.nextBtn');
        
        if (track.length === 0) return;

        var currentIndex = 0;

        function getVisibleCards() {
            var width = $(window).width();
            if (width > 1024) return 3;
            if (width > 768) return 2;
            return 1;
        }

        function updateCarousel() {
            var visibleCards = getVisibleCards();
            var maxIndex = Math.max(0, cards.length - visibleCards);
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            var firstCard = cards.first();
            var cardWidth = firstCard.outerWidth(true);
            
            if (cardWidth <= 0) {
                setTimeout(updateCarousel, 100);
                return;
            }

            var offset = -(currentIndex * cardWidth);
            track.css({
                'transform': 'translateX(' + offset + 'px)',
                'display': 'flex'
            });
        }

        nextBtn.off('click').on('click', function(e) {
            e.preventDefault();
            var visibleCards = getVisibleCards();
            if (currentIndex < cards.length - visibleCards) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.off('click').on('click', function(e) {
            e.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        $(window).on('resize', updateCarousel);
        updateCarousel();
        $(window).on('load', updateCarousel);
    }

    function validarFormulario(formId) {
        var form = $(formId);
        if (form.length === 0) return;

        form.on('submit', function(e) {
            e.preventDefault();
            var isValid = true;
            
            form.find('.erro-feedback').text('');
            form.find('input, textarea, select').removeClass('input-erro');

            form.find('[required]').each(function() {
                var valor = $(this).val().trim();
    
                if (valor === '' || valor === null) {
                    isValid = false;
                    $(this).addClass('input-erro');
                    var campoNome = $(this).prev('label').text() || 'Este campo';
                    $(this).next('.erro-feedback').text(campoNome + ' é obrigatório.');
                }
            });

            var emailInput = form.find('input[type="email"]');
            if (emailInput.length > 0 && emailInput.val().trim() !== '') {
                var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailReg.test(emailInput.val())) {
                    isValid = false;
                    emailInput.addClass('input-erro');
                    emailInput.next('.erro-feedback').text('Por favor, insira um e-mail válido.');
                }
            }

            if (emailInput.length > 0 && emailInput.attr('required') && emailInput.val().trim() === '') {
                isValid = false;
                emailInput.addClass('input-erro');
                emailInput.next('.erro-feedback').text('O e-mail é obrigatório.');
            }

            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
                return false;
            } else {
                alert('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
                form[0].reset();
            }
        });
    }

    function initMap() {
        var mapElement = $('#map');
        if (mapElement.length === 0) return;

        var luandaCoords = [-8.8147, 13.2302]; 
        
        var map = L.map('map').setView(luandaCoords, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker(luandaCoords).addTo(map)
            .bindPopup('<b>Dados da Esperança</b><br>Avenida Comandante Valódia, Luanda.')
            .openPopup();
    }

    initCarousel();
    validarFormulario('#formContacto');
    validarFormulario('#formAgendar');

    initMap();
});
