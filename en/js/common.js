$(function(){

	const observer = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
		  if (entry.isIntersecting) {
			$(entry.target).addClass('in-view');
			// observer.unobserve(entry.target); // 1회만 감지할 경우 사용
		  } else {
			//$(entry.target).removeClass('in-view'); // 필요 없다면 이 줄 제거
		  }
		});
	  }, {
		threshold: 0.1 // 10% 이상 보이면 작동
	  });

	  $('.ani').each(function() {
		observer.observe(this);
	  });
	  
	
	
	$(window).scroll(function(){
		checkOffset();
		var winH = $(window).scrollTop();
		
		if((winH) > 50){
			$("#header").addClass("scroll");
			$(".top-btn").addClass("visible");
			$(".floating_btn").fadeIn(200);
		}else{
			$("#header").removeClass("scroll");
			$(".top-btn").removeClass("visible");
			$(".floating_btn").fadeOut(200);
		}
	});
	$(window).trigger('scroll');
	
	function checkOffset() {
		var a=$(document).height()-$(window).height();
		var b=$('.foot').outerHeight();
		scroll = $(window).scrollTop();

		if (scroll > a-b) {
			$("#wrap").css("position","relative");
			$(".top-btn").css("position","absolute").css("bottom",b + 20);
			$(".floating_btn").css("position","absolute").css("bottom",b + 100);
		}else {
			$("#wrap").css("position","static");
			$(".top-btn").css("position","fixed").css("bottom","20px");
			$(".floating_btn").css("position","fixed").css("bottom","100px");
		}
	}
	checkOffset();
	
		$(".top-btn").on("click", function(){
			$("html, body").animate({scrollTop:0}, 1200, function(){
				//$(".logo > a").focus();
				console.log('top');
			});
	});
	
$(".floating_btn").hide();


	
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var navbarHeight = $('#header').outerHeight();

	$(window).scroll(function(event){
		didScroll = true;
	});

	setInterval(function() {
		if (didScroll) {
			hasScrolled();
			didScroll = false;
		}
	}, 250);

	function hasScrolled() {
		var st = $(this).scrollTop();
		
		// Make sure they scroll more than delta
		if(Math.abs(lastScrollTop - st) <= delta)
			return;
		
		// If they scrolled down and are past the navbar, add class .nav-up.
		// This is necessary so you never see what is "behind" the navbar.
		if (st > lastScrollTop && st > navbarHeight){
			// Scroll Down
			$('#header').removeClass('nav-down').addClass('nav-up');
		} else {
			// Scroll Up
			$('#header').removeClass('nav-up').addClass('nav-down');
		}
		
		lastScrollTop = st;
	}

	$(".pcNav>ul>li").mouseover(function(){
		$("#header").addClass("on");
	});

	$("#header").mouseleave(function(){
		$("#header").removeClass("on");
	});
	
	$(".btnMenu").click(function(){
		$(".allMenu").toggleClass("open");
		$(".btnMenu").toggleClass("open");
		$(".head h1 a").toggleClass("open");
		$("#header").toggleClass("open");
	});
	
	var $depth1 = $(".allMenu .inner>ul>li>a");
	$depth1.click(function(){
		if($(window).width() <= 795){
				if($(this).parent().hasClass("active") == false){ 
					$(".allMenu .inner>ul>li").removeClass("active");
					$(this).parent().addClass("active");
					$(".allMenu .inner>ul>li>a").removeClass("on");
					$(this).addClass("on");
					
					$(".allMenu .inner>ul>li>ul").stop().slideUp(300);
					$(this).next().stop().slideDown(300);
				}
				else{
					$(this).parent().removeClass("active");
					$(this).next().stop().slideUp(300);
					$(this).removeClass("on");
				}

		}else {
			$(".allMenu .inner>ul>li>a").show();
			 $(".allMenu .inner>ul>li>a").removeClass("on");
		}
	});
	$(window).on("resize", function(){
		if($(this).width() <= 795){
			$(".allMenu .inner>ul>li>ul").hide();
		}else {
			$(".allMenu .inner>ul>li>ul").css("display", "flex");
			$(".allMenu .inner>ul>li>a").removeClass("on");
		}
	}).resize();


$(".head .gnb .language").click(function(){
	$(this).toggleClass('act');
		$(".head .gnb .language .lang_list").slideToggle();
	});

});