
const mainScript = () => {
  gsap.registerPlugin(ScrollTrigger);
  $("html").css("scroll-behavior", "auto");
  $("html").css("height", "auto");
  function replaceHyphenWithSpan(el) {
    $(el).html(function (index, oldHtml) {
      return oldHtml.replaceAll("-", "<span>-</span>");
    });
  }
  const lenis = new Lenis({
    lerp: 0.15,
    smootth: false
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  const viewport = {
    w: window.innerWidth,
    h: window.innerHeight,
  };
  function isInHeaderCheck(el) {
    const rect = $(el).get(0).getBoundingClientRect();
    const headerRect = $('.header').get(0).getBoundingClientRect();

    return Math.abs(rect.top - headerRect.top) <= 2; // sai số 2px là chấp nhận được
  }
  class Header {
    constructor() {
      this.tl = null;
    }
    trigger() {
      this.setup();
      this.interact();
    }
    setup() {
      this.tl = gsap.timeline({
        onStart: () => {
          console.log('init')
          $('[data-init-df]').removeAttr('data-init-df');
          this.init = true
        },
        onComplete() {
        }
      });
      new MasterTimeline({
        timeline: this.tl,
        tweenArr: [
          new ScaleInset({ el: $('.header_logo').get(0) }),
          ...$('.header_item_inner').map((idx, el) => new FadeIn({ el: el, onMask: true })),
        ]
      })
      let menu_item = new SplitType('.main_menu_item_txt ', { types: 'lines, words', lineClass: 'kv_line' });
    }
    play() {
      this.tl.play();
    }
    interact() {
      $(".navbar-toggler-icon-wrap").on("click", (e) => {
        e.preventDefault();
        if ($('body').hasClass('menu-open')) {
          $('body').removeClass('menu-open');
          this.deactiveMenuTablet();
        }
        else {
          $('body').addClass('menu-open');
          this.activeMenuTablet();
        }
      })
    }
    toggleColorMode = (color) => {
      let elArr = Array.from($(`[data-section="${color}"]`));
      if (elArr.some(function (el) { return isInHeaderCheck(el) })) {
        $('.header').addClass(`on-${color}`);
      }
      else if (!$('.header').hasClass('on-show-menu')) {
        $('.header').removeClass(`on-${color}`);
      }
    }
    toggleOnHide = (inst) => {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const $header = $('.header');
      const isScrollHeader = scrollTop > $('.header').height() * (viewport.w > 767 ? 4 : 1.5);
      if (isScrollHeader) {
        if (inst.direction >= 0) {
          $header.addClass('on-hide');
          $('.cove_btn_crolltop').addClass('active')
        }
        else {
          $header.removeClass('on-hide');
        }
      } else {
        $('.cove_btn_crolltop').removeClass('active')
        $header.removeClass('on-hide');
      }
    }
    activeMenuTablet = () => {
      // lenis.stop();
      gsap.fromTo('.main_menu_item_txt .word', { autoAlpha: 0, yPercent: 100 }, { duration: .8, autoAlpha: 1, yPercent: 0, stagger: .025, ease: "circ.inOut" });
      gsap.fromTo('.main_menu_logo', { scale: 1.5 }, { duration: 1, scale: 1, ease: "circ.inOut" });
      gsap.fromTo('.main_menu', { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }, {
        duration: 1, clipPath: 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)', ease: "circ.inOut"
      });
    }
    deactiveMenuTablet = () => {
      // lenis.start();
      $('body').removeClass('menu-open')
      gsap.fromTo('.main_menu_item_txt .word', { autoAlpha: 1, yPercent: 0 }, { duration: .6, autoAlpha: 0, yPercent: 100, stagger: .025, ease: "circ.inOut" });
      gsap.fromTo('.main_menu_logo', { scale: 1 }, { duration: .8, scale: .8, ease: "circ.inOut" });
      gsap.fromTo('.main_menu', { clipPath: 'polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)' }, {
        duration: 1, clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', ease: "circ.inOut"
      });
    }
  }
  const header = new Header();
  header.trigger();
  lenis.on("scroll", function (inst) {
    header.toggleColorMode('green');
    header.toggleOnHide(inst);
  });
  function heroAmim() {
    console.log('khanh')
     let tlScroll = gsap.timeline({
        scrollTrigger: {
          trigger: '.muine_hero',
          start: viewport.w > 991 ? 'top+=50% bottom' : 'top+=70% bottom-=70%',
          end: viewport.w > 991 ? 'bottom top-=40%' : 'bottom-=40% top-=40%',
          scrub: 1
                }
      });
      tlScroll
      .fromTo('.muine_hero_inner img', { yPercent: 10 }, { yPercent: -20 , ease: 'none'}, 0)
  }
  heroAmim();
  function intro() {
    new MasterTimeline({
      triggerInit: '.muine_intro ',
      scrollTrigger: { trigger: '.muine_intro ' },
      tweenArr: [
        new FadeSplitText({ el: $('.muine_intro_info_subtitle').get(0), onMask: true }),
        new ScaleInset({ el: $('.muine_intro_slider_item:first-child ').get(0) }),
        new FadeSplitText({ el: $('.muine_intro_info_title').get(0), onMask: true }),
        new FadeSplitText({ el: $('.muine_intro_info_des').get(0), onMask: true }),
        ...$('.muine_intro_slider.mySwiper .muine_intro_slider_item img').map((idx, el) => new FadeIn({ el: el })),
        new FadeIn({ el: $('.muine_intro_info_check') }),
        new FadeIn({ el: $('.muine_intro_info_bottom') }),
      ]
    })
  }
  intro();
  function content() {
    $('.muine_content_room_item').each((idx, item) => {
      new MasterTimeline({
        triggerInit: item,
        scrollTrigger: { trigger: item },
        tweenArr: [
          new FadeIn({ el: item }),
          new ScaleInset({ el: $(item).find('.muine_content_room_item_img  ').get(0) }),
          new FadeSplitText({ el: $(item).find('.muine_content_room_item_title ').get(0), onMask: true }),
          new FadeSplitText({ el: $(item).find('.muine_content_room_item_des ').get(0), onMask: true }),
          ...$('.muine_content_info_img img').map((idx, el) => new FadeIn({ el: el })),

        ]
      })
    })
    new MasterTimeline({
      triggerInit: '.muine_content ',
      scrollTrigger: { trigger: '.muine_content ' },
      tweenArr: [
        new FadeSplitText({ el: $('.muine_content_info_title ').get(0), onMask: true }),
        new FadeSplitText({ el: $('.muine_content_info_des').get(0), onMask: true }),
        new FadeIn({el: $('.muine_content_info_link')}),
      ]
    })
  }
  content();
  function section_find() {
    new MasterTimeline({
      triggerInit: '.muine_find ',
      scrollTrigger: { trigger: '.muine_find ' },
      tweenArr: [
        new FadeSplitText({ el: $('.muine_find_title  ').get(0), onMask: true }),
        new FadeSplitText({ el: $('.muine_find_des').get(0), onMask: true }),
      ]
    })
    $('.muine_find_item').each((idx,item) => {
       new MasterTimeline({
        triggerInit: item,
        scrollTrigger: { trigger: item },
        tweenArr: [
          new ScaleInset({ el: $(item).find('.muine_find_item_img   ').get(0) }),
          new FadeIn({ el: $(item).find('.muine_find_item_img .muine_find_item_img_des ') }),
          new FadeSplitText({ el: $(item).find('.muine_find_item_txt_des  ').get(0), onMask: true }),
          new FadeIn({ el: $(item).find('.muine_find_item_txt_link ') }),

        ]
      })
    })
  }
  section_find();
  function logo() {
    new MasterTimeline({
      triggerInit: '.muine_story ',
      scrollTrigger: { trigger: '.muine_story ' },
      tweenArr: [
        new FadeSplitText({ el: $('.muine_story_subtitle   ').get(0), onMask: true }),
        ...$('.muine_story_content_img').map((idx, el) => new FadeIn({ el: el })),
      ]
    })
    new MasterTimeline({
      triggerInit: '.muine_story_recent ',
      scrollTrigger: { trigger: '.muine_story_recent ' },
      tweenArr: [
        new FadeSplitText({ el: $('.muine_story_recent_title  ').get(0), onMask: true }),
      ]
    })

    $('.muine_story_recent_item').each((idx, item) => {
      new MasterTimeline({
        triggerInit: item,
        scrollTrigger: { trigger: item },
        tweenArr: [
          new ScaleInset({ el: $(item).find('.muine_story_recent_item_img ').get(0) }),
          new FadeSplitText({ el: $(item).find('.muine_story_recent_item_title  ').get(0), onMask: true }),
          new FadeSplitText({ el: $(item).find('.muine_story_recent_item_time  ').get(0), onMask: true }),
        ]
      })
    })
  }
  logo();
  $('.muine_intro_info_bottom').click(function () {

    $(this).toggleClass('active')
    $('.muine_intro_info_bottom_child').slideToggle(300);
  });
  var swiper = new Swiper(".mySwiper", {
    spaceBetween: 0,
    slidesPerView: 6,
    freeMode: true,
    watchSlidesProgress: true,
  });
  var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: swiper,
    },
  });

  const items = $('.muine_content_room_item');

};
window.onload = mainScript;