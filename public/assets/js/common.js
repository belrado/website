function js_strip_tags(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1){
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

// 다중 돔로드 js
function addLoadEvent(func) {
    var oldonLoad = window.onload
    if (typeof window.onload != 'function') {
        window.onload = func
    } else {
        window.onload = function() {
            oldonLoad()
            func()
        }
    }
}

// 한글자씩 나오게
var showCharMessagae = function(str, elem, speed) {
    var len = str.length
    var check = 0
    var message = ''
    var speed = speed || 100
    var innerFnc = function() {
        setTimeout(function() {
            if (check < len - 1) {
                message += str[check] + '_'
            } else {
                message += str[check]
            }
            elem.text(message)
            message = message.replace(new RegExp('_', 'gi'), '')
            if (check < len - 1) innerFnc()
            check++
        }, speed)
    }
    innerFnc()
}

/* 글자수 체크 / 제한 */
function check_content_byte(in_texts, text_max, check_cnt_elem) {
    var ls_str = in_texts.value
    var li_str_len = ls_str.length
    var li_max = text_max
    var i = 0
    var li_byte = 0
    var li_len = 0
    var ls_one_char = ''
    var ls_str2 = ''
    for (i = 0; i < li_str_len; i++) {
        ls_one_char = ls_str.charAt(i)
        if (escape(ls_one_char).length > 4) {
            li_byte++ //+= 2;
        } else {
            li_byte++
        }
        if (li_byte <= li_max) {
            li_len = i + 1
        }
    }
    if (li_byte > li_max) {
        alert(li_max + '글자를 초과하여 입력할수 업습니다.')
        ls_str2 = ls_str.substr(0, li_len)
        in_texts.value = ls_str2
        li_byte = li_max
    }
    try {
        $(check_cnt_elem).text(li_byte + '/' + text_max)
    } catch (e) {}
}

/**
 * 숫자에 3자리에 콤마를 찍음
 * @param {} num
 */
function addComma(num) {
    var regexp = /\B(?=(\d{3})+(?!\d))/g
    return num.toString().replace(regexp, ',')
}
