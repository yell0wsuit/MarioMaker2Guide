var isNx = (typeof window.nx !== 'undefined')
var isPageSwitched = false
var isSoundLoaded = !isNx

// Joy-Con 横持ちなら1、それ以外なら0
var CTRL_KEY = 'ctrl'

function saveQuery() {
  // 既にあるならなにもしない
  if (window.sessionStorage.getItem(CTRL_KEY)) return

  var queryStrs = decodeURIComponent(window.location.search).split('?')
  if (queryStrs.length === 2) {
    var queryArr = queryStrs[1].split('&')
    queryArr.forEach(function(query) {
      var kv = query.split('=')
      if (kv.length === 2 && kv[1]) {
        var key = kv[0]
        if (key === CTRL_KEY) {
          var val = kv[1] ? kv[1] : ''
          window.sessionStorage.setItem(key, val)
        }
      }
    })
  }
}

saveQuery()

function getKeyString(key) {
  var keylist = ['A', 'B', 'X', 'Y', 'L', 'R', 'ZL', 'ZR', '+', '-', 'HOME']
  var ctrl = parseInt(window.sessionStorage.getItem(CTRL_KEY), 10) || 0

  function getKeyCodeSet(ctrl) {
    if (ctrl === 1) {
      return ["e0ab", "e0ac", "e0ad", "e0ae", "e0e8", "e0e9", "e0e8", "e0e9", "e0f1", "e0f2", "e0f4"]
    }
    return ["e0e0", "e0e1", "e0e2", "e0e3", "e0e4", "e0e5", "e0e6", "e0e7", "e0f1", "e0f2", "e0f4"]
  }

  var num = keylist.indexOf(key);
  var keyCodeSet = getKeyCodeSet(ctrl)
  return String.fromCodePoint('0x' + keyCodeSet[num])
}

function canFocus() {
  return !isPageSwitched
}

function canPageSwitch() {
  return !isPageSwitched && isSoundLoaded
}

function incrementPlayReportCounter(arg) {
  if (isNx && window.nx.playReport) {
    if (typeof arg === 'number') {
      window.nx.playReport.incrementCounter(arg)
    } else if (arg.dataset && arg.dataset.counterId) {
      var counterId = parseInt(arg.dataset.counterId, 10)
      window.nx.playReport.incrementCounter(counterId)
    }
  }
}

function playSound(label, opt_onEnded) {
  if (isNx && window.wsnd && window.wsnd.play) {
    if (isSoundLoaded) {
      window.wsnd.play(label, opt_onEnded)
    } else if (opt_onEnded) {
      opt_onEnded()
    }
  } else if (opt_onEnded) {
    setTimeout(function() {
      opt_onEnded()
    }, 500)
  }
}

function endApplet() {
  // ページ遷移中ならなにもしない(連打対策)
  if (!canPageSwitch()) return

  isPageSwitched = true
  var $retBtn = $('#ret-button')
  $retBtn.addClass('is-focus')
  $retBtn.focus()

  var incrementCounterId = $retBtn.attr('data-counter-id')
  if (incrementCounterId) {
    incrementPlayReportCounter(parseInt(incrementCounterId, 10))
  }

  // 遷移中はどこにも動けないようにする
  disabledOtherLink()
  // 音を鳴らす
  playSound('cancel')

  setTimeout(function() {
    sendMessage('end-bgm')
    window.location.href = 'http://localhost/'
  }, 450)
}

function goBack() {
  // ページ遷移中ならなにもしない(連打対策)
  if (!canPageSwitch()) return

  isPageSwitched = true
  var $retBtn = $('#ret-button')
  $retBtn.addClass('is-focus')
  $retBtn.focus()

  // 遷移中はどこにも動けないようにする
  disabledOtherLink()
  // 音を鳴らす
  playSound('cancel')

  setTimeout(function() {
    window.history.back()
  }, 450)
}

function goBackOrEnd() {
  if (window.history.length > 1) {
    goBack()
  } else {
    endApplet()
  }
}

function disableTouch() {
  // aタグ以外タッチを効かないようにする
  window.addEventListener('touchstart', function(e) {
    if (e.target.tagName !== 'A' && $(e.target).parents('a').length === 0) {
      e.preventDefault()
    }
  }, {
    once: false,
    passive: false,
    capture: true
  })
}

function disabledOtherLink(selectedId) {
  $('a').each(function() {
    var otherId = $(this).attr('id')
    if (typeof otherId === 'undefined' || typeof selectedId === 'undefined' || otherId !== selectedId) {
      $(this).attr('tabindex', -1)
    }
  })
}

function selectBtn(e) {
  if (!canPageSwitch()) return
  $(e).parent().addClass('is-selected')
}

function switchPage(e, url, counterId) {
  if (!canPageSwitch()) return

  isPageSwitched = true
  // 遷移中はどこにも動けないようにする
  disabledOtherLink(e.id)

  var incrementCounterId = (typeof counterId === 'undefined') ? e : counterId
  incrementPlayReportCounter(incrementCounterId)
  var nextPath = url || $(e).attr('ref')

  // 音を鳴らす
  playSound('fixed')

  setTimeout(function() {
    // urlが指定されているならurlを優先
    window.location.href = nextPath
  }, 400)
}

function getRandomInt(maxValue) {
  return Math.floor(Math.random() * (maxValue + 1))
}

function keyfocus(nextId, dir) {
  // ページ遷移中ならなにもしない(連打対策)
  if (!canPageSwitch()) return
  var keyCodes = {
    'left': 37,
    'right': 39,
    'up': 38,
    'down': 40
  }
  if (!event || event.keyCode !== keyCodes[dir]) return

  if (nextId) {
    var $nextFocusElm = $('#' + nextId)
    if ($nextFocusElm.length) {
      $nextFocusElm.focus()
      return
    }
  }
  // nextIdがないなら、動かさない
  event.preventDefault()
}

function sendMessage(message) {
  if (isNx && window.nx.sendMessage) {
    window.nx.sendMessage(message)
  }
}

(function() {
  if (isNx) {
    if (window.nx.setCursorScrollSpeed) {
      window.nx.setCursorScrollSpeed(10)
    }
    var isDisplayedContents = false;
    function canControl() {
      return canPageSwitch() && isDisplayedContents
    }
    // 音の設定
    if (window.wsnd) {
      window.wsnd.load({
        'cursor': '../../audio/se_ui_offlinehtml_select.wav',
        'cancel': '../../audio/se_ui_offlinehtml_cancel.wav',
        'fixed': '../../audio/se_ui_offlinehtml_decide.wav'
      }, function() {
        isSoundLoaded = true
      })
    } else {
      isSoundLoaded = true
    }
    // フッターの設定
    window.nx.footer.setAssign('B', '', goBackOrEnd, {
      se: ''
    })
    window.nx.footer.unsetAssign('X')
    // プレイレポート
    if (window.nx.playReport) {
      // 改訂があった場合は数字を変更して下さい
      window.nx.playReport.setCounterSetIdentifier(0)
    }
    window.addEventListener('NXFirstPaintEndAfterLoad', function() {
      if (window.history.length === 1 && window.nx.sendMessage) {
        sendMessage('start-bgm')
      }
      setTimeout(function() {
        isDisplayedContents = true
      }, 100)
    })
    window.addEventListener('keydown', function(e) {
      if (!canControl()) {
        e.preventDefault()
      }
    })
    window.addEventListener('touchstart', function(e) {
      if (!canControl()) {
        e.preventDefault()
      }
    })
  }
})()
