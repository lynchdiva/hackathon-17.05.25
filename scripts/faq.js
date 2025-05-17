$(document).ready(function() {
    // Обработка клика по карточке
    $('.faq-card').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            return;
        }
        
        $('.faq-card').removeClass('active');
        $(this).addClass('active');
        
        $('html, body').animate({
            scrollTop: $(this).offset().top - 20
        }, 300);
    });
    
    // Объекты для управления речью для каждой карточки
    const speechControllers = {};
    
    // Инициализация контроллеров речи для каждой карточки
    $('.faq-card').each(function(index) {
        const cardId = `card-${index}`;
        $(this).data('card-id', cardId);
        
        speechControllers[cardId] = {
            synth: window.speechSynthesis,
            utterance: null,
            isPaused: false,
            speaking: false
        };
    });
    
    // Функция для чтения текста
    function speakText(cardId, text) {
        const controller = speechControllers[cardId];
        
        if (controller.speaking && !controller.isPaused) {
            controller.synth.cancel();
        }
        
        if (controller.isPaused) {
            controller.synth.resume();
            controller.isPaused = false;
            $(`[data-card-id="${cardId}"] .pause-btn`).show();
            $(`[data-card-id="${cardId}"] .resume-btn`).hide();
            return;
        }
        
        controller.utterance = new SpeechSynthesisUtterance(text);
        controller.utterance.lang = 'ru-RU';
        controller.utterance.rate = 0.9;
        
        controller.utterance.onstart = function() {
            controller.speaking = true;
            $(`[data-card-id="${cardId}"] .voice-btn`).not('.pause-btn, .resume-btn').addClass('active');
            $(`[data-card-id="${cardId}"] .pause-btn`).show();
            $(`[data-card-id="${cardId}"] .voice-btn`).not('.pause-btn, .resume-btn').hide();
        };
        
        controller.utterance.onend = function() {
            controller.speaking = false;
            $(`[data-card-id="${cardId}"] .voice-btn`).removeClass('active');
            $(`[data-card-id="${cardId}"] .pause-btn, [data-card-id="${cardId}"] .resume-btn`).hide();
            $(`[data-card-id="${cardId}"] .voice-btn`).not('.pause-btn, .resume-btn').show();
        };
        
        controller.utterance.onerror = function() {
            controller.speaking = false;
            $(`[data-card-id="${cardId}"] .voice-btn`).removeClass('active');
            $(`[data-card-id="${cardId}"] .pause-btn, [data-card-id="${cardId}"] .resume-btn`).hide();
            $(`[data-card-id="${cardId}"] .voice-btn`).not('.pause-btn, .resume-btn').show();
        };
        
        controller.synth.speak(controller.utterance);
    }
    
    // Обработка кнопки голосового воспроизведения
    $('.voice-btn').not('.pause-btn, .resume-btn').click(function(e) {
        e.stopPropagation();
        
        const card = $(this).closest('.faq-card');
        const cardId = card.data('card-id');
        const question = card.find('.faq-question').text();
        const answer = card.find('.faq-answer').text().trim();
        const textToSpeak = question + " " + answer;
        
        // Остановить все другие воспроизведения
        $('.faq-card').each(function() {
            const otherCardId = $(this).data('card-id');
            if (otherCardId !== cardId && speechControllers[otherCardId].speaking) {
                speechControllers[otherCardId].synth.cancel();
            }
        });
        
        // Остановить воспроизведение текста с изображения
        if (textSpeechController.speaking) {
            textSpeechController.synth.cancel();
        }
        
        speakText(cardId, textToSpeak);
    });
    
    // Обработка кнопки паузы
    $('.pause-btn').click(function(e) {
        e.stopPropagation();
        
        const cardId = $(this).closest('.faq-card').data('card-id');
        const controller = speechControllers[cardId];
        
        controller.synth.pause();
        controller.isPaused = true;
        $(this).hide();
        $(`[data-card-id="${cardId}"] .resume-btn`).show();
    });
    
    // Обработка кнопки продолжения
    $('.resume-btn').click(function(e) {
        e.stopPropagation();
        
        const cardId = $(this).closest('.faq-card').data('card-id');
        const controller = speechControllers[cardId];
        
        controller.synth.resume();
        controller.isPaused = false;
        $(this).hide();
        $(`[data-card-id="${cardId}"] .pause-btn`).show();
    });
    
    // Закрытие карточки при клике вне ее
    $(document).click(function(e) {
        if (!$(e.target).closest('.faq-card').length) {
            $('.faq-card').removeClass('active');
        }
    });
    // Обработка загрузки фото
    $('#uploadBtn2').click(function() {
        $('#file-input').click();
    });
    
    // Drag and drop для загрузки фото
    $('#upload-area').on('dragover', function(e) {
        e.preventDefault();
        $(this).css('border-color', '#667eea');
        $(this).css('background', '#f8fafc');
    });
    
    $('#upload-area').on('dragleave', function(e) {
        e.preventDefault();
        $(this).css('border-color', '#cbd5e0');
        $(this).css('background', 'white');
    });
    
    $('#upload-area').on('drop', function(e) {
        e.preventDefault();
        $(this).css('border-color', '#cbd5e0');
        $(this).css('background', 'white');
        
        if (e.originalEvent.dataTransfer.files.length) {
            handleImageUpload(e.originalEvent.dataTransfer.files[0]);
        }
    });
    
    $('#file-input').change(function() {
        if (this.files && this.files[0]) {
            handleImageUpload(this.files[0]);
        }
    });
    
    function handleImageUpload(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            $('#image-preview').attr('src', e.target.result);
            $('#preview-container').show();
            $('#recognize-btn').prop('disabled', false);
            $('#text-result').text('');
            $('#read-text-btn, #pause-text-btn, #resume-text-btn').prop('disabled', true).hide();
            $('#read-text-btn').show().prop('disabled', true);
        }
        
        reader.readAsDataURL(file);
    }
    
    // Распознавание текста с фото
    $('#recognize-btn').click(function() {
        const imageSrc = $('#image-preview').attr('src');
        $('#text-result').text('Идет распознавание текста...');
        $(this).prop('disabled', true);
        
        Tesseract.recognize(
            imageSrc,
            'rus',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            $('#text-result').text(text);
            $('#read-text-btn').prop('disabled', false);
        }).catch(err => {
            $('#text-result').text('Ошибка при распознавании текста: ' + err);
        });
    });
    
    // Контроллер речи для распознанного текста
    const textSpeechController = {
        synth: window.speechSynthesis,
        utterance: null,
        isPaused: false,
        speaking: false
    };
    
    // Чтение распознанного текста
    $('#read-text-btn').click(function() {
        const textToRead = $('#text-result').text();
        if (textToRead.trim() === '') return;
        
        // Остановить все другие воспроизведения
        $('.faq-card').each(function() {
            const cardId = $(this).data('card-id');
            if (speechControllers[cardId].speaking) {
                speechControllers[cardId].synth.cancel();
            }
        });
        
        $(this).hide();
        $('#pause-text-btn').show().prop('disabled', false);
        
        if (textSpeechController.synth.speaking && !textSpeechController.isPaused) {
            textSpeechController.synth.cancel();
        }
        
        if (textSpeechController.isPaused) {
            textSpeechController.synth.resume();
            textSpeechController.isPaused = false;
            $('#pause-text-btn').show();
            $('#resume-text-btn').hide();
            return;
        }
        
        textSpeechController.utterance = new SpeechSynthesisUtterance(textToRead);
        textSpeechController.utterance.lang = 'ru-RU';
        textSpeechController.utterance.rate = 0.9;
        
        textSpeechController.utterance.onstart = function() {
            textSpeechController.speaking = true;
        };
        
        textSpeechController.utterance.onend = function() {
            textSpeechController.speaking = false;
            $('#read-text-btn').show();
            $('#pause-text-btn, #resume-text-btn').hide();
        };
        
        textSpeechController.utterance.onerror = function() {
            textSpeechController.speaking = false;
            $('#read-text-btn').show();
            $('#pause-text-btn, #resume-text-btn').hide();
        };
        
        textSpeechController.synth.speak(textSpeechController.utterance);
    });
    
    // Пауза при чтении распознанного текста
    $('#pause-text-btn').click(function() {
        textSpeechController.synth.pause();
        textSpeechController.isPaused = true;
        $(this).hide();
        $('#resume-text-btn').show();
    });
    
    // Продолжение чтения распознанного текста
    $('#resume-text-btn').click(function() {
        textSpeechController.synth.resume();
        textSpeechController.isPaused = false;
        $(this).hide();
        $('#pause-text-btn').show();
    });
    
    // Блок мероприятий - календарь
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    // Данные мероприятий с датами в формате Date
    const eventsData = {
        'center': [
            {
                title: 'Концерт классической музыки',
                description: 'Выступление городского симфонического оркестра',
                date: new Date(currentYear, currentMonth, 5),
                theme: 'culture'
            },
            {
                title: 'Лекция о здоровом питании',
                description: 'Врач-диетолог расскажет о правильном питании для пожилых',
                date: new Date(currentYear, currentMonth, 10),
                theme: 'health'
            },
            {
                title: 'Мастер-класс по рисованию',
                description: 'Основы акварельной живописи для начинающих',
                date: new Date(currentYear, currentMonth, 15),
                theme: 'hobby'
            }
        ],
        'north': [
            {
                title: 'Выставка народных промыслов',
                description: 'Традиционные ремесла нашего края',
                date: new Date(currentYear, currentMonth, 8),
                theme: 'culture'
            },
            {
                title: 'Бесплатная юридическая консультация',
                description: 'Для пенсионеров по вопросам социальных льгот',
                date: new Date(currentYear, currentMonth, 12),
                theme: 'social'
            }
        ],
        'south': [
            {
                title: 'Йога для старшего возраста',
                description: 'Групповые занятия по адаптированной программе',
                date: new Date(currentYear, currentMonth, 7),
                theme: 'health'
            },
            {
                title: 'Клуб настольных игр',
                description: 'Шахматы, шашки, домино и другие игры',
                date: new Date(currentYear, currentMonth, 14),
                theme: 'hobby'
            }
        ],
        'east': [
            {
                title: 'Экскурсия в краеведческий музей',
                description: 'Бесплатная экскурсия для пенсионеров',
                date: new Date(currentYear, currentMonth, 6),
                theme: 'culture'
            },
            {
                title: 'Семинар по компьютерной грамотности',
                description: 'Основы работы с компьютером и интернетом',
                date: new Date(currentYear, currentMonth, 13),
                theme: 'education'
            }
        ],
        'west': [
            {
                title: 'Танцевальный вечер',
                description: 'Ретро-музыка и танцы для старшего поколения',
                date: new Date(currentYear, currentMonth, 9),
                theme: 'culture'
            },
            {
                title: 'Встреча с ветеранами',
                description: 'Чайная церемония и воспоминания',
                date: new Date(currentYear, currentMonth, 11),
                theme: 'social'
            }
        ]
    };
    
    // Инициализация календаря
    function initCalendar() {
        renderCalendar(currentMonth, currentYear);
        
        // Навигация по месяцам
        $('#prev-month').click(function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
        
        $('#next-month').click(function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }
    
    // Отрисовка календаря
    function renderCalendar(month, year) {
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                           "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        
        $('#calendar-month').text(`${monthNames[month]} ${year}`);
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Пн=0, Вс=6
        
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        let calendarHtml = '';
        
        // Заголовки дней недели
        days.forEach(day => {
            calendarHtml += `<div class="calendar-day">${day}</div>`;
        });
        
        // Пустые ячейки для начала месяца
        for (let i = 0; i < startingDay; i++) {
            calendarHtml += `<div class="calendar-day empty"></div>`;
        }
        
        // Дни месяца
        const today = new Date();
        const currentRegion = $('#region-select').val();
        const currentTheme = $('#theme-select').val();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            const isToday = currentDate.toDateString() === today.toDateString();
            
            // Проверяем, есть ли мероприятия в этот день для выбранного региона и темы
            let hasEvent = false;
            if (currentRegion && eventsData[currentRegion]) {
                const regionEvents = eventsData[currentRegion];
                for (const event of regionEvents) {
                    if (event.date.toDateString() === currentDate.toDateString() && 
                        (!currentTheme || event.theme === currentTheme)) {
                        hasEvent = true;
                        break;
                    }
                }
            }
            
            let dayClasses = 'calendar-day';
            if (isToday) dayClasses += ' today';
            if (hasEvent) dayClasses += ' event';
            
            calendarHtml += `<div class="${dayClasses}" data-date="${currentDate.toISOString()}">${i}</div>`;
        }
        
        $('#calendar-grid').html(calendarHtml);
        
        // Обработка клика по дню календаря
        $('.calendar-day:not(.header, .empty)').click(function() {
            const dateStr = $(this).data('date');
            const date = new Date(dateStr);
            
            if ($(this).hasClass('event')) {
                const region = $('#region-select').val();
                const theme = $('#theme-select').val();
                
                if (region && eventsData[region]) {
                    let filteredEvents = eventsData[region].filter(event => 
                        event.date.toDateString() === date.toDateString() && 
                        (!theme || event.theme === theme)
                    );
                    
                    if (filteredEvents.length > 0) {
                        let eventsHtml = '';
                        filteredEvents.forEach(event => {
                            eventsHtml += `
                                <div class="event-item">
                                    <div class="event-title">${event.title}</div>
                                    <div class="event-date">${formatDate(event.date)}</div>
                                    <div class="event-description">${event.description}</div>
                                </div>
                            `;
                        });
                        
                        $('#events-list').html(eventsHtml);
                    }
                }
            }
        });
    }
    
    // Форматирование даты
    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
    
    // Обработка выбора района
    $('#region-select').change(function() {
        const region = $(this).val();
        if (region) {
            $('#theme-select').prop('disabled', false);
            displayEvents(region);
            renderCalendar(currentMonth, currentYear);
        } else {
            $('#theme-select').prop('disabled', true);
            $('#events-list').html('<p>Пожалуйста, выберите город для отображения мероприятий</p>');
            renderCalendar(currentMonth, currentYear);
        }
    });
    
    // Обработка выбора темы
    $('#theme-select').change(function() {
        const region = $('#region-select').val();
        if (region) {
            displayEvents(region, $(this).val());
            renderCalendar(currentMonth, currentYear);
        }
    });
    
    // Отображение мероприятий
    function displayEvents(region, theme = '') {
        let events = eventsData[region];
        
        if (theme) {
            events = events.filter(event => event.theme === theme);
        }
        
        if (events.length === 0) {
            $('#events-list').html('<p>Нет мероприятий по выбранным критериям</p>');
            return;
        }
        
        // Сортируем мероприятия по дате
        events.sort((a, b) => a.date - b.date);
        
        let eventsHtml = '';
        events.forEach(event => {
            eventsHtml += `
                <div class="event-item">
                    <div class="event-title">${event.title}</div>
                    <div class="event-date">${formatDate(event.date)}</div>
                    <div class="event-description">${event.description}</div>
                </div>
            `;
        });
        
        $('#events-list').html(eventsHtml);
    }
    
    // Инициализация приложения
    initCalendar();
});
    $(document).ready(function() {
        // FAQ Cards functionality
        let currentExpandedCard = null;
        let synth = window.speechSynthesis;
        let utterance = null;
        let isPlaying = false;
        
        $('.faq-card').click(function() {
            const $card = $(this);
            
            if ($card.hasClass('expanded')) {
                // If clicking the already expanded card, close it
                currentExpandedCard = null;
                stopSpeech();
            } else {
                // Close any previously expanded card
                if (currentExpandedCard) {
                    currentExpandedCard.removeClass('expanded');
                    stopSpeech();
                }
                
                // Expand the clicked card
                $card.addClass('expanded');
                currentExpandedCard = $card;
            }
        });
        
        // Voice control for FAQ cards
        $('.voice-control').click(function(e) {
            e.stopPropagation();
            const $card = $(this).closest('.faq-card');
            const text = $card.find('.faq-question').text() + '. ' + $card.find('.faq-answer').text();
            
            if (isPlaying) {
                pauseSpeech();
            } else {
                speakText(text);
            }
        });
        
        function speakText(text) {
            stopSpeech();
            utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ru-RU';
            utterance.rate = 0.9;
            
            utterance.onend = function() {
                isPlaying = false;
                $('.voice-control, .photo-voice').removeClass('fa-pause').addClass('fa-microphone');
            };
            
            synth.speak(utterance);
            isPlaying = true;
            $('.voice-control, .photo-voice').removeClass('fa-microphone').addClass('fa-pause');
        }
        
        function pauseSpeech() {
            if (synth.speaking) {
                synth.pause();
                isPlaying = false;
                $('.voice-control, .photo-voice').removeClass('fa-pause').addClass('fa-microphone');
            }
        }
        
        function stopSpeech() {
            synth.cancel();
            isPlaying = false;
            $('.voice-control, .photo-voice').removeClass('fa-pause').addClass('fa-microphone');
        }
    

    });
