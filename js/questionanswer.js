(function() {
  $(function() {
    var isDismissScrollIndicator = false
    var pageBottom = $(document).innerHeight() - $(window).innerHeight()

    if (pageBottom <= $(window).scrollTop()) {
      isDismissScrollIndicator = true
    }

    function scrollHandler() {
      if (!isDismissScrollIndicator) {
        $("#scroll-indicator").addClass('is-dismiss')
        isDismissScrollIndicator = true
      }
    }
    window.addEventListener('scroll', scrollHandler)
  })
})()
