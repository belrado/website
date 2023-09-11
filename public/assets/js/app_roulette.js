/*
roulette.js 파일 불러오기전 AppCsrfAjax.js 파일을 먼저 불러온뒤
AppCsrfAjax.js 상속받는다.
*/
var Roulette = function () {
    try {
        AppCsrfAjax.call(this);
    }catch(e){
        console.log('AppCsrfAjax.js is not defined')
    }
    this.rouletteElem = $('.roulette');
    this.remainNumElem = $('#remain_event_num');
    this.startBtn = $('#rouletteStart');
    this.resetBtn = $('#reset');
    this.startDeg = 0;
    this.eventName = [];
    this.eventNum = 5;
    this.eventRange = [];
    this.rouletteDeg = 0;
    this.action = false;
    this.winType = 'fixed';
    this.env = 'production';
    this.duration = 6.8;
    this.remainNum = 0;
};
try {
    Roulette.prototype = Object.create(AppCsrfAjax.prototype);
} catch(e) {}
Roulette.prototype.constructor = Roulette;
Roulette.prototype.checkTransitionEnd = function(callBack) {
    this.rouletteElem.on({
        'transitionend': function(e) {
            if (typeof callBack === 'function') {
                callBack();
            }
        }
    });
};
Roulette.prototype.getRandomNum = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Roulette.prototype.getRouletteDeg = function() {
    var el = document.querySelector('.roulette');
    var elStyle = window.getComputedStyle(el, null);
    var style = elStyle.getPropertyValue('transform')
        || elStyle.getPropertyValue('-moz-transform')
        || elStyle.getPropertyValue('-webkit-transform')
        || elStyle.getPropertyValue('-ms-transform')
        || elStyle.getPropertyValue('-o-transform');
    var values = style.split('(')[1],
        values = values.split(')')[0],
        values = values.split(',');
    var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
    var result = (angle > 0 ? 360 - angle : angle);
    result = (result > 0) ? result : result*-1;
    return result;
};
Roulette.prototype.getFixRouletteDeg = function(deg) {
    var _this = this;
    var min = 0;
    var max = 0;
    for(key in _this.eventRange) {
        if (deg >= _this.eventRange[key]['start'] && _this.eventRange[key]['end'] > deg) {
            min = _this.eventRange[key]['start'] + 6;
            max = _this.eventRange[key]['end'] - 6;
        }
    }
    return this.getRandomNum(min, max);
};
Roulette.prototype.winNum = function(selectNum) {
    var selectNum = selectNum || 0;
    var num = this.getRandomNum(18, 23);
    var winNum = (num * 360) + selectNum;
    this.rouletteDeg = selectNum;
    if (this.env === 'develop') {
        console.log('스타트'+this.rouletteDeg, '선택된 박스 각도'+selectNum, '룰렛 돌릴 360도각'+(num*360), '최종각도'+winNum);
    }
    return winNum;
};
Roulette.prototype.setting = function() {
    var range = 360 / this.eventNum;
    for (var i=0; i<this.eventNum; i++) {
        /*
        정렬 방식 오름차순 / 내림차순
        */
        /*this.eventRange[i] = {
            'start': ((this.eventNum-1)-i)*range,
            'end': ((this.eventNum-1)-i)*range+range,
            'name': this.eventName[i]
        }*/
        this.eventRange[i] = {
            'start': i*range,
            'end': i*range+range,
            'name': this.eventName[i]
        }
    }
    console.log('eventRange', this.eventRange)
};
Roulette.prototype.startAni = function() {
    var _this = this;
    _this.rouletteElem.addClass('setani');
};
Roulette.prototype.setEvent = function() {
    var _this = this;
    _this.startBtn.on('click', function(e) {
        if (!_this.action) {
            _this.action = true;
            if (_this.remainNum > 0) {
                var event_code = $(this).data('eventcode');
                var opt  = {
                    loading: false,
                    sendData: {
                        'event_code': event_code
                    }
                }
                _this.rouletteElem.addClass('setani');
                $('.pop-up-layout').remove();
                _this.sendAjax(opt, function(data) {
                    if (data.response === 'success') {
                        console.log(data);
                        _this.rouletteDeg = _this.getRouletteDeg();
                        _this.rouletteElem.removeClass('setani');
                        _this.rouletteElem.removeClass('run');
                        _this.rouletteElem.css({
                            '-webkit-transform': 'rotate('+(_this.rouletteDeg*-1)+'deg)',
                            'transform': 'rotate('+(_this.rouletteDeg*-1)+'deg)',
                            '-webkit-transition': ' none',
                            'transition': ' none'
                        });
                        if (_this.winType === 'fixed') {
                            var selectEvent = parseInt(data.win_coin);
                            var fixDeg = _this.getFixRouletteDeg(_this.eventRange[selectEvent]['end']-10);
                            var winNum = _this.winNum(fixDeg);
                        } else {
                            var winNum = _this.getRandomNum(6000, 8130);
                        }
                        setTimeout(function() {
                            _this.rouletteElem.addClass('run');
                            $('.run').css({
                                '-webkit-transform': 'rotate('+(winNum*-1)+'deg)',
                                'transform': 'rotate('+(winNum*-1)+'deg)',
                                '-webkit-transition': '-webkit-transform '+(_this.duration)+'s cubic-bezier(0.110, 0.810, 0.120, 1.024)',
                                'transition': 'transform '+(_this.duration)+'s cubic-bezier(0.110, 0.810, 0.120, 1.024)'
                            });
                            _this.checkTransitionEnd(function(){
                                if (this.env === 'develop') {
                                    var nowDeg = _this.getRouletteDeg();
                                    for(key in _this.eventRange) {
                                        if (nowDeg >= _this.eventRange[key]['start'] && _this.eventRange[key]['end'] > nowDeg) {
                                            console.log('총각도'+winNum+' 각도: '+fixDeg+', '+nowDeg+' 당첨:'+_this.eventRange[key]['name']);
                                        }
                                    }
                                }
                                _this.resultPopup('win', _this.eventRange[selectEvent]['name']);
                                _this.action = false;
                            });
                            // css transition end 감지 에러가 생겼다면 처리
                            setTimeout(function() {
                                if (_this.action) {
                                    _this.resultPopup('win', _this.eventRange[selectEvent]['name']);
                                    _this.action = false;
                                }
                            }, (_this.duration * 1000 + 200));
                        }, 20);
                    } else {
                        _this.rouletteElem.removeClass('setani');
                        _this.rouletteElem.css({
                            '-webkit-transform': 'rotate(0deg)',
                            'transform': 'rotate(0deg)',
                            '-webkit-transition': ' none',
                            'transition': ' none'
                        });
                        _this.resultPopup('error', data.msg);
                    }
                  //  _this.remainNum = data.remain_event;
                    _this.remainNum--;
                   _this.remainNumElem.text(_this.remainNum);

                }, function(e) {
                    _this.rouletteElem.removeClass('setani');
                    _this.rouletteElem.css({
                        '-webkit-transform': 'rotate(0deg)',
                        'transform': 'rotate(0deg)',
                        '-webkit-transition': ' none',
                        'transition': ' none'
                    });
                    _this.resultPopup();
                });
            } else {
                _this.resultPopup('exhaustion');
            }
        } else {
            // window.location.reload();
        }
    });
    // 리셋
    _this.resetBtn.on({
        click: function(e) {
            _this.rouletteElem.removeClass('run').css({
                '-webkit-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)',
                '-webkit-transition': ' none',
                'transition': ' none'
            });
        }
    });
    // 팝업닫기 이벤트 바인딩
    _this.popupclose();
};
Roulette.prototype.popupclose = function() {
    var _this = this;
    $(document).on('click', '.close-popup', function() {
        $('.pop-up-layout').removeClass('show');
        setTimeout(function() {
            $('.pop-up-layout').remove();
        }, 400);
        _this.action = false;
    });
};
Roulette.prototype.resultPopup = function(type, msg, url = '') {
    var html = '<div class="pop-up-layout">';
    html += '<div class="pop-up-content">';
    html += '<a href="javascript:;" class="pop-up-cancel-btl close-popup">닫기</a>';
    if (type === 'exhaustion') {
        html += '<p class="text-area">참여가능 횟수가<br>모두 소진되었습니다.</p>';
        html += '<div class="pop-up-btl-layout">';
        html += '<a href="'+A_URL+'/roulette">다시하기</a>';
        html += '<a href="'+A_URL+'">홈으로 이동</a>';
        html += '</div>';
    } else if (type === 'win') {
        html += '<p class="text-area">축하합니다<br><strong>'+msg+'</strong>에<br>당첨되었습니다!</p>';
        html += '<div class="pop-up-btl-layout">';
        html += '<a href="javascript:;" class="close-popup">닫기</a>';
        html += '</div>';
    } else if (type === 'error') {
        html += '<p class="text-area">'+msg+'</p>';
        html += '<div class="pop-up-btl-layout">';
        html += '<a href="javascript:;" class="close-popup">닫기</a>';
        html += '</div>';
    } else if (type === 'login') {
        html += '<p class="text-area">'+msg+'</p>';
        html += '<div class="pop-up-btl-layout">';
        html += '<a href="' + A_URL + '/member/login?url=/benefit/roulette/list/' + url + '" class="close-popup">로그인</a>';
        html += '</div>';
        // 스토어로 이동 추가
        // } else if (type === '') {
        //     html += '<p class="text-area"><strong>홍카페 앱</strong>에서<br>참여하실 수 있습니다</p>';
        //     html += '<div class="pop-up-btl-layout">';
        //     html += '<a href="https://play.google.com/store/apps/details?id=kr.co.hongcafe.mobile" class="close-popup active">스토어로 이동</a>';
        //     html += '</div>';
    } else {
        html += '<p class="text-area"><strong>네트워크 오류로 인해 게임이 실행되지 않았습니다. <br />잠시 후 다시 시도해주세요.</strong></p>';
        html += '<div class="pop-up-btl-layout">';
        html += '<a href="javascript:;" class="close-popup">닫기</a>';
        html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    $('.roulette-container').append(html);
    setTimeout(function() {
        $('.pop-up-layout').addClass('show');
    }, 100);
};
Roulette.prototype.init = function() {
    var _this = this;
    try {
        _this.setting();
        _this.setEvent();
    } catch(e) {
        console.log(e)
    }
};
