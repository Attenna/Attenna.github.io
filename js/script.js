(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('.nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  // Theme (day/night) toggle
  var THEME_KEY = 'theme-preference';
  var $themeToggle = $('#theme-toggle');
  function applyTheme(theme){
    var root = document.documentElement || document.body;
    if (theme === 'night'){
      root.setAttribute('data-theme', 'night');
      $themeToggle.find('span').removeClass('fa-moon').addClass('fa-sun');
    } else {
      root.removeAttribute('data-theme');
      $themeToggle.find('span').removeClass('fa-sun').addClass('fa-moon');
    }
  }

  // init from localStorage or prefers-color-scheme
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved){
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
      applyTheme('night');
    }
  } catch (e){}

  $themeToggle.on('click', function(){
    try {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'night' ? 'day' : 'night';
      applyTheme(next === 'night' ? 'night' : 'day');
      localStorage.setItem(THEME_KEY, next === 'night' ? 'night' : 'day');
    } catch (e){}
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"><span class="fa fa-twitter"></span></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"><span class="fa fa-facebook"></span></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"><span class="fa fa-pinterest"></span></a>',
            '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodedUrl + '" class="article-share-linkedin" target="_blank" title="LinkedIn"><span class="fa fa-linkedin"></span></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  // Back to top functionality
  $('.back-to-top').on('click', function(e){
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function(e){
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 70 }, 600);
    }
  });

  // 1) 回到顶部：滚动超过一屏才显
  var $backTop = $('.quick-nav-widget .back-to-top');
  function updateBackTopVisibility(){
    if (!$(window).width()) return;
    var threshold = window.innerHeight || document.documentElement.clientHeight;
    if (window.scrollY > threshold){
      $backTop.addClass('is-visible');
    } else {
      $backTop.removeClass('is-visible');
    }
  }
  $(window).on('scroll resize', updateBackTopVisibility);
  updateBackTopVisibility();

  // 2) IntersectionObserver 控制侧栏 sticky/显隐
  var quickNav = document.querySelector('.quick-nav-widget');
  var mainFirstPost = document.querySelector('#main .article');
  if (quickNav && mainFirstPost && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          // 文章顶部在视口可见 -> 取消锁定，保持在“最新文章下面”的自然位置
          quickNav.classList.remove('is-sticky');
          quickNav.classList.add('is-visible');
        } else {
          // 超过阈值 -> 开启锁定并显示
          quickNav.classList.add('is-sticky');
          quickNav.classList.add('is-visible');
        }
      });
    }, { rootMargin: '-80px 0px 0px 0px', threshold: 0.0 });
    io.observe(mainFirstPost);
  } else if (quickNav){
    // 兼容：若不支持 IO，默认显示
    quickNav.classList.add('is-visible');
  }

  // 3) 上下篇卡片缩略图：改为服务端渲染（helpers.first_image），前端不再注入

  // 悬浮回到顶部按钮：滚动超过一屏显示
  var $floatingTop = $('.floating-back-top');
  function updateFloatingTop(){
    var threshold = window.innerHeight || document.documentElement.clientHeight;
    if (window.scrollY > threshold){
      $floatingTop.addClass('is-visible');
    } else {
      $floatingTop.removeClass('is-visible');
    }
  }
  if ($floatingTop.length){
    $(window).on('scroll resize', updateFloatingTop);
    updateFloatingTop();
    $floatingTop.on('click', function(){
      $('html, body').animate({ scrollTop: 0 }, 600);
    });
  }

})(jQuery);