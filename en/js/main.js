$(function(){
	
	const lenis = new Lenis({ lerp: 0.07, smooth: true });
	
	lenis.on('scroll', ScrollTrigger.update)
	gsap.ticker.add((time)=>{
	  lenis.raf(time * 1000)
	})
	
	
	//메인 스와이퍼
	var swiper1 = new Swiper('.visual', {
		effect: 'fade',
		fadeEffect: { 
			crossFade: true 
		},
		touchRatio:  0,
		slidesPerView: 1,
		/**autoplay: {
			delay: 10000,
			disableOnInteraction: false,
		},**/
		speed: 1600,
		loop:false,
		//touchRatio: 0,
		pagination: {
			el: ".vpaging",
			clickable: true,
		},
		navigation: {
			nextEl: ".vnext",
			prevEl: ".vprev",
		},
		on: {
			slideChange: function () {
				$(".swiper-slide:eq("+(this.realIndex + 1)+")").addClass('on').siblings().removeClass("on")
			}
		},
	});
		
		
	document.querySelectorAll('.section2 .txtwrap h3').forEach(text => {
	// 1. 텍스트 분할
	const splitText = new SplitType(text, {
		type: 'words'
	});

	// 2. 관련 요소 선택
	const section   = text.closest('.section2');
	const paragraph = section.querySelector('.section2 .txtwrap p');
	const img       = section.querySelector('.section2 img');

	// 3. 타임라인 생성
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: section,
			start: 'top center',
			end: () => `+=${window.innerHeight * 1.2}px`,
			scrub: true,
			//markers: true,
			// pin: true, // 필요 시 활성화
		}
	});

	// 4. 텍스트 애니메이션
	tl.from(splitText.words, {
		opacity: 0,
		y: 50,
		filter: "blur(5px)",
		ease: 'none',
		stagger: 1,
		duration: 5
	});

	// 5. 이미지 스케일 애니메이션 (동시에 시작)
	if (img) {
		tl.fromTo(img,
			{ scale: 1.2 },
			{ scale: 1, duration: 10, ease: 'none' },
			'<' // 바로 위와 동시에 실행
		);
	}

	// 6. 가상의 빈 구간 (스크롤 여유)
	tl.to({}, {
		duration: 10
	});
});
	

	
		
		
	/* section3 */
	let tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".section3 .conwrap",
			start: "top top",
			end: "+=200%", // 전체 애니메이션 길이를 200%로 설정
			pin: true,
			pinSpacing: false,
			scrub: true,
		}
	});
	tl.to(".section3 .box2", {
		clipPath: "inset(0% 0 0 0)",
		duration: 0.5,
		ease: "none",
	})
	tl.to(".section3 .box1 .bg", {
		y: "-30%",
		duration: 0.5,
		ease: "none",
	}, "<")
	tl.to(".section3 .box3", {
		clipPath: "inset(0% 0 0 0)",
		duration: 0.5,
		ease: "none"
	}, ">=0"); // box2 애니메이션 직후 시작
	tl.to(".section3 .box2 .bg", {
		y: "-30%",
		duration: 0.5,
		ease: "none",
	}, "<")
			
		
	Splitting();
	
	let currentIndex;
	let activeIndex;
	let lastIndex;
	let activeSlide;
	let prevSlideName;
	let nextSlideName;

	function detectBrowser() {
	  const agent = navigator.userAgent.toLowerCase();
	  if (agent.includes('msie') || agent.includes('trident') || agent.includes('edge')) {
		return 'ie';
	  } else if (agent.includes('firefox')) {
		return 'firefox';
	  } else if (agent.includes('opr')) {
		return 'opera';
	  } else if (agent.includes('chrome')) {
		return 'chrome';
	  } else if (agent.includes('safari')) {
		return 'safari';
	  }
	  return '';
	}

	/**
	 * realIndex 기반으로 prev/next 버튼 텍스트를 업데이트
	 */
	function updateNavNames(swiper) {
	  if (!swiper.originalNames || swiper.originalNames.length === 0) return;

	  const names = swiper.originalNames;
	  const len   = names.length;
	  const real  = swiper.realIndex;
	  const prev  = names[(real - 1 + len) % len];
	  const next  = names[(real + 1)     % len];

	  const prevBtn = document.querySelector('.prev-btn dl dd');
	  const nextBtn = document.querySelector('.next-btn dl dd');
	  if (prevBtn) prevBtn.textContent = prev;
	  if (nextBtn) nextBtn.textContent = next;
	}

	const sec2Swiper = new Swiper('.section4 .gallery', {
	  slidesPerView: 1,
	  speed: 600,
	  spaceBetween: 0,
	  centeredSlides: false,
	  grabCursor: true,
	  freeMode: false,
	  allowTouchMove: true,
	  parallx: true,
	  slidesPerGroup: 1,
	  effect: 'fade',
	  loop: true,
	  loopAdditionalSlides: 1,
	  loopedSlides: 1,
	  initialSlide: 0,
	  navigation: {
		nextEl: '.gnext',
		prevEl: '.gprev',
	  },
	  on: {
		init: function () {
		  // 원본 슬라이드만 골라 data-name 배열 생성
		  this.originalNames = Array.from(this.slides)
			.filter(sl => !sl.classList.contains('swiper-slide-duplicate'))
			.map(sl => sl.getAttribute('data-name'));

		  updateNavNames(this);
		},

		// 텍스트만 먼저 바꿔줌 (애니메이션/이미지는 transition 끝난 후)
		slideChangeTransitionStart: function () {
		  updateNavNames(this);
		},

		// 슬라이드 전환 완료 후 이미지와 애니메이션 처리
		slideChangeTransitionEnd: function () {
		  if (!this.originalNames || this.originalNames.length === 0) return;

		  const len = this.originalNames.length;
		  const real = this.realIndex;

		  // 현재 realIndex에 해당하는 슬라이드 찾기
		  const currentEl = Array.from(this.slides)
			.find(sl => Number(sl.getAttribute('data-swiper-slide-index')) === real);

		  if (currentEl) {
			const img = currentEl.querySelector('img');
			if (img) {
			  const imgUrl = img.src;
			  //document.querySelectorAll('.section4 .gallery .gal .bg')
				//.forEach(bg => bg.style.backgroundImage = `url(${imgUrl})`);
			}
		  }
		},

		setTransition: function (speed) {
		  if (detectBrowser() !== 'ie') {
			Array.from(this.slides).forEach(sl => {
			  sl.style.transition = `${speed}ms`;
			  const inner = sl.querySelector('.thumb_inner');
			  if (inner) inner.style.transition = `${speed}ms`;
			});
		  }
		}
	  }
	});
	
	function custom_cursor(){

		var $cursor = null;
		var $inner = null;
		var $circle = null;

		if( $('html').hasClass('mobile') || $('html').hasClass('ie10') ) { return; }

		// default moving
		$('body').mousemove(function(e) {
			TweenMax.to($('#custom_cursor'), 1.3, {
				x: e.clientX,
				y: e.clientY,
				ease: Power3.easeOut
			});
		});

		// global cursor
		$(document).on({
			mouseenter: function(){
				$cursor = $('#custom_cursor');
				$inner = $cursor.find('.custom_cursor_inner');
				$circle = $cursor.find('.custom_hover_circle');

				var $this = $(this);
				var words = ( $this.data('hover') != undefined ) ? $this.data('hover') : '';

				if( $this.hasClass('drag') ){ $cursor.addClass('drag'); }

				if( $this.hasClass('custom_simple_cursor') ){
					words = '';

					var size = ( $this.data('size') != undefined ) ? $this.data('size') : '48';

					TweenMax.to($inner, .1, {width: size,height: size,ease: Power0.easeNone});
				}


				TweenMax.killTweensOf($circle);
				TweenMax.to($circle, .3, {width: '100%',height: '100%',autoAlpha: 1,ease: Power0.easeNone});
			},
			mouseleave: function(){
				$cursor = $('#custom_cursor');
				$inner = $cursor.find('.custom_cursor_inner');
				$circle = $cursor.find('.custom_hover_circle');

				var $this = $(this);

				if( $this.hasClass('drag') ){ $cursor.removeClass('drag'); }

				if( $this.hasClass('custom_simple_cursor') ){
					TweenMax.to($inner, .2, {width: '100%',height: '100%',ease: Power0.easeNone});
				}

				TweenMax.killTweensOf($circle);
				TweenMax.to($circle, .2, {width: '0%',height: '0%',autoAlpha: 0,ease: Power0.easeNone});
			}
		}, '.custom_hover');
		
	};
	custom_cursor()
	

	
	
	function hoverEvent(){
		if($(window).width() >= 1400){
			$(".section5 .ccwrap .cc .inner").hover(function(){
				$(this).find("p").slideDown(300);
			}, function(){
				$(this).find("p").slideUp(300);
			});
		}
	}
	
	hoverEvent();
	
	$(window).resize(function(){
		hoverEvent();
	});


	var press = new Swiper('.press', {
		loop: true,
		slidesPerView: "auto",
		speed: 1600,
	});
});