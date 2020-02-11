var prevMsgId
var isShowSubMessage = false
var isCursorMovedByKey = false

function focusMenu(e) {
  if (!canFocus()) return

  if (isCursorMovedByKey) {
    playSound('cursor')
    isCursorMovedByKey = false
  }

  function toggleMsg(e) {
    function convertToMessageId(focusedId) {
      return 'msg' + focusedId.replace(/btn-/g, '-').replace(/-focus-area/g, '')
    }
    var msgId = convertToMessageId(e.id)
    if (typeof prevMsgId !== 'undefined') {
      $('#' + prevMsgId).addClass('is-hidden')
    }
    // メッセージの表示
    var msgElm = $('#' + msgId)
    msgElm.removeClass('is-hidden')
    if (!isShowSubMessage) {
      msgElm.addClass('is-first')
      isShowSubMessage = true
    } else {
      msgElm.removeClass('is-first')
    }
    prevMsgId = msgId
  }

  toggleMsg(e)
}

function defocusMenu(e) {
  if (typeof prevMsgId !== 'undefined') {
    $('#' + prevMsgId).addClass('is-hidden')
  }
  prevMsgId = undefined
}

(function() {
  var bgImgIndex = getRandomInt(4)
  var $bgImg = $('#top-img-' + bgImgIndex)
  $bgImg.attr('src', $bgImg.attr('ref'))
  $bgImg.removeClass('is-hidden')

  if (isNx) {
    // フッターの設定
    window.nx.footer.setAssign('B', '', endApplet, {
      se: ''
    })
  }
  $(function() {
    disableTouch()

    setTimeout(function() {
      for (var i = 0; i < 5; ++i) {
        var $bgImg = $('#top-img-' + i)
        $bgImg.attr('src', $bgImg.attr('ref'))
      }
    }, 0)

    var prevActiveElement = document.activeElement
    window.addEventListener('keydown', function(e) {
      prevActiveElement = document.activeElement
      if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
        isCursorMovedByKey = true
      }
    }, {
      once: false,
      passive: true,
      capture: true
    })

    window.addEventListener('touchstart', function() {
      isCursorMovedByKey = false
    }, {
      once: false,
      passive: true,
      capture: true
    })
  })
})()
