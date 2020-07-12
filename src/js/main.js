const {TweenMax} = require('gsap')
const {Swiper} = require('swiper')
const $ = require('jquery')

window.addEventListener('DOMContentLoaded', () => {
  const $bigBall = $('.cursor__ball--big')
  const $tooltip = $('.slider__tooltip')
  const $paralaxBlock = $('.slider')
  const $sliderContent = $('.slider__content')
  const burgerBtn = $('.burger-menu')
  const burgerLinks = $('.navigation__link')

  document.body.addEventListener('mousemove', onMouseMove)
  document.body.addEventListener('mouseenter', onMouseMove)

  const slider = new Swiper('.slider-swiper')

  slider.on('slideChange', function ({activeIndex = 0}) {
    hideContent()
    showContent(activeIndex)
  });

  burgerBtn.click(function (e) {
    e.preventDefault();
    $(this).toggleClass('burger-menu--active');
  })

  burgerLinks.each(function (_, item) {
    $(this).on('click', (e) => {
      e.preventDefault()
      burgerBtn.removeClass('burger-menu--active');
    })
  })

  function hideContent() {
    $sliderContent.each((_, item) => {
      $(item).removeClass('slider__content--active fadeIn')
    })
  }

  function showContent(i) {
    $sliderContent.eq(i).addClass('slider__content--active fadeIn')
  }

  function onMouseMove(e) {
    if (e.target.parentNode.dataset.slider || e.target.dataset.slider) {
      $tooltip.addClass('slider__tooltip--show')
    } else {
      $tooltip.removeClass('slider__tooltip--show')
    }

    let x = e.clientX / window.innerWidth
    let y = e.clientY / window.innerHeight
    $paralaxBlock.css('transform', 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)')

    TweenMax.to($bigBall, .4, {
      x: e.pageX - 15,
      y: e.pageY - 15
    })
  }

  showContent(0)
})

