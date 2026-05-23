$(function(){
	
			const $slider = $('.slider-container');
            const $slides = $('.slide');
            const $indicators = $('.indicator');
            const $prevTitle = $('.prev-title');
            const $nextTitle = $('.next-title');
            const totalSlides = $slides.length;
            let currentSlide = 0;
            let isAnimating = false;

            // 터치 이벤트 변수
            let touchStartX = 0;
            let touchEndX = 0;
            let touchStartY = 0;
            let touchEndY = 0;
            let minSwipeDistance = 50; // 최소 스와이프 거리

            // 초기화
            setTimeout(() => {
                $slider.removeClass('loading').addClass('loaded');
				updateButtonTitles();
            }, 100);

            // 버튼 타이틀 업데이트 - HTML에서 직접 가져오기
            function updateButtonTitles() {
                const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
                const nextIndex = (currentSlide + 1) % totalSlides;
                
                // HTML에서 슬라이드 타이틀 가져오기
                const prevTitle = $slides.eq(prevIndex).find('.slide-title').text();
                const nextTitle = $slides.eq(nextIndex).find('.slide-title').text();
                
                $prevTitle.text(prevTitle);
                $nextTitle.text(nextTitle);
            }

            // 슬라이드 변경 함수
            function changeSlide(newIndex, direction = 'next') {
                if (isAnimating || newIndex === currentSlide) return;
                
                isAnimating = true;
                const $current = $slides.eq(currentSlide);
                const $next = $slides.eq(newIndex);
                
                // 모든 클래스 초기화
                $slides.removeClass('current next wiping wipe-left wipe-right entering entered');
                
                // 새로운 슬라이드를 회전+확대 상태로 준비
                $next.addClass('current entering');
                
                // 현재 슬라이드를 위에 올리고 와이퍼 애니메이션 적용
                $current.addClass('wiping');
                
                // 사선 와이퍼 애니메이션과 새로운 슬라이드 등장 애니메이션 시작
                requestAnimationFrame(() => {
                    // 와이퍼 애니메이션
                    if (direction === 'next') {
                        $current.addClass('wipe-left');
                    } else {
                        $current.addClass('wipe-right');
                    }
                    
                    // 새로운 슬라이드 등장 애니메이션 (회전+확대 → 정상)
                    $next.addClass('entered');
                });

                // 애니메이션 완료 후 정리
                setTimeout(() => {
                    $slides.removeClass('wiping wipe-left wipe-right entering entered');
                    $next.addClass('current');
                    
                    currentSlide = newIndex;
                    updateIndicators();
                    isAnimating = false;
                }, 600);
            }

            // 터치 이벤트 핸들러
            function handleTouchStart(e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }

            function handleTouchMove(e) {
                // 터치 이동 중 스크롤 방지 (세로 스크롤은 허용)
                const touchMoveX = e.touches[0].clientX;
                const touchMoveY = e.touches[0].clientY;
                const deltaX = Math.abs(touchMoveX - touchStartX);
                const deltaY = Math.abs(touchMoveY - touchStartY);
                
                // 가로 스와이프가 세로 스와이프보다 큰 경우에만 기본 동작 방지
                if (deltaX > deltaY) {
                    e.preventDefault();
                }
            }

            function handleTouchEnd(e) {
                touchEndX = e.changedTouches[0].clientX;
                touchEndY = e.changedTouches[0].clientY;
                handleSwipe();
            }

            function handleSwipe() {
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                
                // 세로 스와이프는 무시
                if (Math.abs(deltaY) > Math.abs(deltaX)) return;
                
                // 최소 스와이프 거리 확인
                if (Math.abs(deltaX) < minSwipeDistance) return;
                
                if (isAnimating) return;
                
                if (deltaX > 0) {
                    // 오른쪽 스와이프 - 이전 슬라이드
                    prevSlide();
                } else {
                    // 왼쪽 스와이프 - 다음 슬라이드
                    nextSlide();
                }
            }

            // 인디케이터 업데이트
            function updateIndicators() {
                $indicators.removeClass('active');
                $indicators.eq(currentSlide).addClass('active');
				updateButtonTitles();
            }

            // 다음 슬라이드
            function nextSlide() {
                const next = (currentSlide + 1) % totalSlides;
                changeSlide(next, 'next');
            }

            // 이전 슬라이드
            function prevSlide() {
                const prev = (currentSlide - 1 + totalSlides) % totalSlides;
                changeSlide(prev, 'prev');
            }

            // 이벤트 리스너
            $('.next-btn').on('click', nextSlide);
            $('.prev-btn').on('click', prevSlide);

            // 터치 이벤트 리스너
            $slider[0].addEventListener('touchstart', handleTouchStart, { passive: false });
            $slider[0].addEventListener('touchmove', handleTouchMove, { passive: false });
            $slider[0].addEventListener('touchend', handleTouchEnd, { passive: true });

            // 인디케이터 클릭
            $indicators.on('click', function() {
                if (isAnimating) return;
                const targetSlide = parseInt($(this).data('slide'));
                const direction = targetSlide > currentSlide ? 'next' : 'prev';
                changeSlide(targetSlide, direction);
            });

            // 키보드 네비게이션
            $(document).on('keydown', function(e) {
                if (isAnimating) return;
                if (e.keyCode === 37) { // 왼쪽 화살표
                    prevSlide();
                } else if (e.keyCode === 39) { // 오른쪽 화살표
                    nextSlide();
                }
            });

            // 자동 슬라이드 (옵션)
            let autoSlideInterval;
            
            function startAutoSlide() {
                autoSlideInterval = setInterval(nextSlide, 5000);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            // 마우스 호버시 자동 슬라이드 중지
            $slider.on('mouseenter', stopAutoSlide);
            $slider.on('mouseleave', startAutoSlide);

            // 자동 슬라이드 시작 (원하면 주석 해제)
            // startAutoSlide();

});