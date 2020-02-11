(function() {
  if (isNx) {
    window.addEventListener('NXFirstPaintEndAfterLoad', function() {
      $('#ret-button').attr('tabindex', 0)
    })
  } else {
    $(function() {
      $('#ret-button').attr('tabindex', 0)
    })
  }
})()
