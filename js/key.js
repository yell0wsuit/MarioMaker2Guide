(function() {
  var ctrl = parseInt(window.sessionStorage.getItem(CTRL_KEY), 10) || 0

  $('#key-A').append(getKeyString('A'))
  if (ctrl === 1) {
    $('#back-key').addClass('four-leaves-key')
  }
  $('#back-key').append(getKeyString('B'))
})()
