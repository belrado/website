var AppCsrfAjax = function() {
    this.url            = '';
    this.csrfType       = 'header';
    this.tokenUse       = false;
    this.ajaxCheck      = false;
    this.customLoading  = false;
    this.customLoadingRemove = false;
};
AppCsrfAjax.prototype = {
    generateCsrfToken: function() {
        function generateRandomString(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        return btoa(generateRandomString(32));
    },
    getCsrfToken: function(setCookie) {
        var csrfToken = this.generateCsrfToken();
        if (setCookie) {
            this.setCsrfCookie('CSRF_TOKEN', encodeURIComponent(csrfToken));
        }
        return csrfToken;
    },
    setCsrfCookie: function (cname, cvalue, exp) {
        if (exp) {
            document.cookie = cname + "=" + cvalue + ";expires="+exp+";path=/";
        } else {
            document.cookie = cname + "=" + cvalue + ";path=/";
        }
    },
    getCsrfCookie: function(name){
        name = new RegExp(name + '=([^;]*)');
        return name.test(document.cookie) ? unescape(RegExp.$1) : '';
    },
    loadingEvent: function() {
        if (typeof this.customLoading === 'function' && typeof this.customLoadingRemove === 'function') {
            this.customLoading();
        } else {
            var html = "<div class='full-loading-wrap' id='full-loading-wrap'><img src='/assets/image/default/loading36.gif' alt='로딩중 잠시만 기다려 주세요.' /><div class='backbg'></div></div>";
            $('body').prepend(html);
        }
    },
    defaultLoadingRemove: function() {
        if (typeof this.customLoading === 'function' && typeof this.customLoadingRemove === 'function') {
            this.customLoadingRemove();
        } else {
            $('#full-loading-wrap').addClass('hide');
            setTimeout(function() {
                $('#full-loading-wrap').remove();
            }, 400);
        }
    },
    sendAjax: function(opt, callBack, errCallback) {
        var _this       = this;
        var loading     = opt['loading'] || false;
        var dataType    = opt['dataType'] || 'JSON';
        var type        = opt['type'] || 'POST';
        var processData  = (typeof opt['processData'] == 'boolean') ? opt['processData'] : true;
        var contentType  = (typeof opt['contentType'] == 'boolean') ? opt['processData'] : "application/x-www-form-urlencoded";

        if (!_this.ajaxCheck) {
            _this.ajaxCheck = true;

            $.ajax({
                url: _this.url,
                data: opt['sendData'],
                headers: {},
                type: type,
                dataType: dataType,
                processData: processData,
                contentType: contentType,
                beforeSend: function(xhr, settings) {
                    if (loading) {
                        _this.loadingEvent();
                    }
                    /* ci4 헤더셋팅 */
                    xhr.setRequestHeader("X-Requested-Wit", 'XMLHttpRequest');
                    /* csrf 토큰 헤더로 전송 및 쿠키 저장 */
                    if (_this.tokenUse) {
                        if (_this.csrfType === 'header') {
                            var csrfToken = _this.getCsrfToken(true);
                            xhr.setRequestHeader("Authorization", csrfToken);

                        } else if (_this.csrfType === 'post') {
                            if ( $('#app_csrf_token').length<1) {
                                settings.data += ('&app_csrf_token'+_this.getCsrfToken(true));

                            } else {
                                //$('#app_csrf_token').val(_this.getCsrfToken(true));
                                var formToken = $('#app_csrf_token').val();
                                _this.setCsrfCookie('CSRF_TOKEN', encodeURIComponent(formToken));
                            }
                        }
                    }
                },
                success: function(data) {
                    _this.ajaxCheck = false;
                    _this.defaultLoadingRemove();
                    if(typeof callBack === 'function') {
                        callBack(data);
                    }
                },
                error: function(e) {
                    _this.ajaxCheck = false;
                    _this.defaultLoadingRemove();
                    if(typeof errCallback === 'function') {
                        errCallback(e);
                    }
                    console.log('err',e);
                }
            });
        }
    }
};

