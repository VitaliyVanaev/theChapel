(function() {
     // ======== ПЕРВОЕ ФОТО ========
    const loader = document.getElementById('loader');
    const firstSlide = document.querySelector('.slide.active');
    
    // Сразу прячем контент (на случай если CSS не успел)
    document.body.style.overflow = 'hidden';
    
    function showContent() {
        // Показываем контент
        document.body.style.overflow = '';
        loader.classList.add('hidden');
        
        // Удаляем загрузчик из DOM через секунду
        setTimeout(() => {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 1000);
    }
    
    if (firstSlide) {
        // Если первое фото уже в кэше
        if (firstSlide.complete) {
            console.log('Фото в кэше, показываем сразу');
            showContent();
        } else {
            // Ждем загрузку первого фото
            console.log('Ждем загрузку первого фото...');
            firstSlide.addEventListener('load', showContent);
            
            // На случай ошибки загрузки
            firstSlide.addEventListener('error', showContent);
            
            // Максимум ждем 5 секунд
            setTimeout(() => {
                console.log('Таймаут, показываем сайт');
                showContent();
            }, 5000);
        }
    } else {
        // Если вдруг нет фото
        showContent();
    }

    // СЛАЙДШОУ С ПОДДЕРЖКОЙ СВАЙПОВ
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let slideInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    function showSlide(index) {
        // Зацикливание слайдов
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));
        
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Запускаем автоматическую смену слайдов
    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    startSlideshow();

    const gallery = document.getElementById('gallery');
    
    if (gallery) {
        // Обработчики для свайпов
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
            // Останавливаем автопрокрутку во время свайпа
            clearInterval(slideInterval);
        }, { passive: true });
        
        gallery.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        gallery.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            
            isSwiping = false;
            // Возобновляем автопрокрутку
            startSlideshow();
        });
        
        gallery.addEventListener('touchcancel', () => {
            isSwiping = false;
            startSlideshow();
        });

        // Добавляем поддержку мыши для тестирования на компьютере
        let mouseDown = false;
        let mouseStartX = 0;
        let mouseEndX = 0;

        gallery.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseStartX = e.screenX;
            clearInterval(slideInterval);
        });

        gallery.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            mouseEndX = e.screenX;
        });

        gallery.addEventListener('mouseup', () => {
            if (!mouseDown) return;
            
            if (mouseEndX !== 0) {
                handleMouseSwipe();
            }
            
            mouseDown = false;
            mouseStartX = 0;
            mouseEndX = 0;
            startSlideshow();
        });

        gallery.addEventListener('mouseleave', () => {
            if (mouseDown) {
                mouseDown = false;
                startSlideshow();
            }
        });

        function handleSwipe() {
            const swipeThreshold = 50; // минимальное расстояние для свайпа
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Свайп вправо - предыдущий слайд
                    prevSlide();
                } else {
                    // Свайп влево - следующий слайд
                    nextSlide();
                }
            }
        }

        function handleMouseSwipe() {
            const swipeThreshold = 50;
            const diff = mouseEndX - mouseStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }
    }

    // Функция для анимации нажатия
    function addPressAnimation(button) {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.97)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.97)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // КНОПКА 1: История храма
    const historyBtn = document.getElementById('toggleHistoryBtn');
    const historyCard = document.getElementById('historyCard');
    
    // КНОПКА 2: Расписание
    const scheduleBtn = document.getElementById('toggleScheduleBtn');
    const scheduleCard = document.getElementById('scheduleCard');
    
    if (historyBtn && historyCard) {
        addPressAnimation(historyBtn);
        
        historyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (scheduleCard && scheduleCard.classList.contains('show')) {
                scheduleCard.classList.remove('show');
                scheduleBtn.textContent = scheduleBtn.getAttribute('data-open-text');
            }
            
            historyCard.classList.toggle('show');
            
            if (historyCard.classList.contains('show')) {
                historyBtn.textContent = historyBtn.getAttribute('data-close-text');
            } else {
                historyBtn.textContent = historyBtn.getAttribute('data-open-text');
            }
        });
    }
    
    if (scheduleBtn && scheduleCard) {
        addPressAnimation(scheduleBtn);
        
        scheduleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (historyCard && historyCard.classList.contains('show')) {
                historyCard.classList.remove('show');
                historyBtn.textContent = historyBtn.getAttribute('data-open-text');
            }
            
            scheduleCard.classList.toggle('show');
            
            if (scheduleCard.classList.contains('show')) {
                scheduleBtn.textContent = scheduleBtn.getAttribute('data-close-text');
            } else {
                scheduleBtn.textContent = scheduleBtn.getAttribute('data-open-text');
            }
        });
    }

    document.addEventListener('touchstart', ()=>{}, {passive: true});

    // ======== КАСТОМНЫЙ АУДИО ПЛЕЕР ========
    const audio = document.getElementById('audioElement');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');

    if (audio && playPauseBtn) {
        // Форматирование времени
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        function updateTimeDisplay() {
            currentTimeSpan.textContent = formatTime(audio.currentTime);
            durationSpan.textContent = formatTime(audio.duration);
            
            const progress = (audio.currentTime / audio.duration) * 100 || 0;
            progressFill.style.width = `${progress}%`;
        }

        audio.addEventListener('loadedmetadata', function() {
            durationSpan.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', updateTimeDisplay);

        playPauseBtn.addEventListener('click', function(e) {
            if (audio.paused) {
                audio.play()
                    .then(() => {
                        playIcon.style.display = 'none';
                        pauseIcon.style.display = 'flex';
                    })
                    .catch(error => console.log('Ошибка воспроизведения:', error));
            } else {
                audio.pause();
                playIcon.style.display = 'flex';
                pauseIcon.style.display = 'none';
            }
        });

        if (progressBar) {
            progressBar.addEventListener('click', function(e) {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const clickRatio = clickX / width;
                audio.currentTime = clickRatio * audio.duration;
            });
        }

        audio.addEventListener('ended', function() {
            playIcon.style.display = 'flex';
            pauseIcon.style.display = 'none';
            audio.currentTime = 0;
        });

        if (progressBar) {
            progressBar.addEventListener('touchstart', function(e) {
                const rect = progressBar.getBoundingClientRect();
                const touchX = e.touches[0].clientX - rect.left;
                const width = rect.width;
                const touchRatio = Math.max(0, Math.min(1, touchX / width));
                audio.currentTime = touchRatio * audio.duration;
            });
        }

        audio.addEventListener('pause', function() {
            playIcon.style.display = 'flex';
            pauseIcon.style.display = 'none';
        });

        audio.addEventListener('play', function() {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'flex';
        });
    }
})();