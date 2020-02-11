var prevContentId
var imgDirPath = '../../img/'
var yamamuraImg = [
  'yamamura_edamame.webp',
  'yamamura_karaage.webp',
  'yamamura_kirakira.webp'
]
var yamamuraTouchImg = [
  'yamamura_edamame_fall.webp',
  'yamamura_karaage_fall.webp',
  'yamamura_kirakira_after.webp'
]

var yamamuraFooterImg = [
  'yamamura_normal.webp',
  'yamamura_Sleep.webp'
]

var yamamuraFooterTouchImg = [
  'yamamura_normal_after.webp',
  'yamamura_wake.webp'
]

var yamamuraImgIndex = 0
var yamamuraFooterImgIndex = 0

function focusBtn(e) {
  if (!canFocus()) return

  playSound('cursor')

  function toggleContent(e) {
    function convertToMainContentId(focusedId) {
      return 'about' + focusedId.replace(/btn-/g, '-')
    }
    var contentId = convertToMainContentId(e.id)
    if (typeof prevContentId !== 'undefined') {
      $('#' + prevContentId).addClass('is-hidden')
    }
    $('#' + contentId).removeClass('is-hidden')
    prevContentId = contentId

    var $toDetail = $('#to-detail')
    if ($toDetail[0]) {
      var $linkElm = $('#' + e.id)
      if ($linkElm.attr('ref')) {
        var $yamamuraImg = $('#yamamura-img')
        yamamuraImgIndex = getRandomInt(yamamuraImg.length - 1)
        if ($yamamuraImg[0]) {
          $yamamuraImg.attr('src', imgDirPath + yamamuraImg[yamamuraImgIndex])
          $toDetail.addClass('is-appear')
        }
      } else {
        $toDetail.removeClass('is-appear')
      }
    }
  }

  toggleContent(e)
  $('#main-description').removeClass('is-hidden')
}

function convertToBtnId(focusedId) {
  return 'btn' + focusedId.replace(/about-/g, '-')
}

function changeCharacterImg() {
  var $yamamuraImg = $('#yamamura-img')
  if ($yamamuraImg[0]) {
    $yamamuraImg.attr('src', imgDirPath + yamamuraTouchImg[yamamuraImgIndex])
    $('#to-detail-balloon').addClass('is-hidden')
  }
}

function gotoDetail(e) {
  if (!prevContentId) return
  var btnId = convertToBtnId(prevContentId)
  var $btn = $('#' + btnId)
  var link = $btn.attr('ref')
  // リンクがないなら何もしない
  if (!link) return

  changeCharacterImg()
  switchPage(e, link, parseInt($btn.attr('data-counter-id'), 10))
  // refocus
  $('#' + btnId).focus()
}

function touchStartToDetail() {
  if (!prevContentId) return
  var btnId = convertToBtnId(prevContentId)
  var link = $('#' + btnId).attr('ref')
  if (!link) {
    event.preventDefault()
  }
}

function touchGotoDetail(e) {
  if (!prevContentId) return
  var btnId = convertToBtnId(prevContentId)
  if (btnId === e.id) {
    gotoDetail(e)
  }
}

function keySwitchPage(e) {
  // Aでないなら無視
  if (event && event.keyCode !== 13) return
  changeCharacterImg()
  switchPage(e)
}

function back() {
  var $yamamuraImg = $('#yamamura-footer-img')
  if ($yamamuraImg[0]) {
    $yamamuraImg.attr('src', imgDirPath + yamamuraFooterTouchImg[yamamuraFooterImgIndex])
  }
  var $toDetailBalloon = $('#to-detail-balloon')
  if ($toDetailBalloon[0]) {
    $toDetailBalloon.addClass('is-hidden')
  }
  goBackOrEnd()
}

function enableFocus(id) {
  $('#' + id).attr('tabindex', 0)
}

(function() {
  if (isNx) {
    // フッターの設定
    window.nx.footer.setAssign('B', '', back, {
      se: ''
    })
  }
  $(function() {
    disableTouch()

    yamamuraFooterImgIndex = getRandomInt(yamamuraFooterImg.length - 1)
    var $yamamuraFooterImg = $('#yamamura-footer-img')
    if ($yamamuraFooterImg[0]) {
      $yamamuraFooterImg.attr('src', imgDirPath + yamamuraFooterImg[yamamuraFooterImgIndex])
    }
  })
})()
