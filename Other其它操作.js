class OtherFn {

    /**
     * [deepClone 深度克隆]
     * @param  {[type]} obj [克隆对象]
     * @return {[type]}     [返回深度克隆后的对象]
     */
    deepClone (obj) {
        if (obj === null || typeof obj !== 'object') return obj
        var isType = function(obj, type) {
            var flag,
                typeString = Object.prototype.toString.call(obj)
            switch(type) {
                case 'Array':
                    flag = typeString === '[object Array]'
                    break
                case 'Date':
                    flag = typeString === '[object Date]'
                    break
                case 'RegExp':
                    flag = typeString === '[object RegExp]'
                    break
                default:
                    flag = false
            }
            return flag
        }
        var getRegExp = function(re) {
            var flags = ''
            if (re.global) flags += 'g'
            if (re.ignoreCase) flags += 'i'
            if (re.multiline) flags += 'm'
            return flags
        }

        var _clone = function(parent) {
            var child, proto, parents = [], children = []
            if (isType(parent, 'Array')) {// 对数组做特殊处理
                child = [];
            } else if (isType(parent, 'RegExp')) {// 对正则做特殊处理
                child = new RegExp(parent.source, getRegExp(parent));
                if (parent.lastIndex) child.lastIndex = parent.lastIndex;
            } else if (isType(parent, 'Date')) {// 对Date做特殊处理
                child = new Date(parent.getTime());
            } else {
                // 处理对象原型
                proto = Object.getPrototypeOf(parent);
                // 利用Object.create切断原型链
                child = Object.create(proto);
            }
            // 处理循环引用
            var index = parents.indexOf(parent);

            if (index != -1) {
                // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
                return children[index];
            }
            parents.push(parent);
            children.push(child);

            for (var i in parent) {
                child[i] = _clone(parent[i]);
            }

            return child;
        }
        return _clone(obj)
    }

    /*获取网址参数*/
    getUrlParams(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if(r!=null) return  r[2]; return null;
    }

    /*获取全部url参数,并转换成json对象*/
    getUrlAllParams (url) {
        var url = url ? url : window.location.href;
        var _pa = url.substring(url.indexOf('?') + 1),
            _arrS = _pa.split('&'),
            _rs = {};
        for (var i = 0, _len = _arrS.length; i < _len; i++) {
            var pos = _arrS[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var name = _arrS[i].substring(0, pos),
                value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
            _rs[name] = value;
        }
        return _rs;
    }

    /*删除url指定参数，返回url*/
    delParamsUrl(url, name){
        var baseUrl = url.split('?')[0] + '?';
        var query = url.split('?')[1];
        if (query.indexOf(name)>-1) {
            var obj = {}
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
            return url
        }else{
            return url;
        }
    }

    /*获取十六进制随机颜色*/
    getRandomColor () {
        return '#' + (function(h) {
            return new Array(7 - h.length).join("0") + h;
        })((Math.random() * 0x1000000 << 0).toString(16));
    }

    /*图片加载*/
    imgLoadAll(arr,callback){
        var arrImg = []; 
        for (var i = 0; i < arr.length; i++) {
            var img = new Image();
            img.src = arr[i];
            img.onload = function(){
                arrImg.push(this);
                if (arrImg.length == arr.length) {
                    callback && callback();
                }
            }
        }
    }

    /*音频加载*/
    loadAudio(src, callback) {
        var audio = new Audio(src);
        audio.onloadedmetadata = callback;
        audio.src = src;
    }

    /*DOM转字符串*/
    domToStirng(htmlDOM){
        var div= document.createElement("div");
        div.appendChild(htmlDOM);
        return div.innerHTML
    }

    /*字符串转DOM*/
    stringToDom(htmlString){
        var div= document.createElement("div");
        div.innerHTML=htmlString;
        return div.children[0];
    }


    /**
     * 光标所在位置插入字符，并设置光标位置
     * 
     * @param {dom} 输入框
     * @param {val} 插入的值
     * @param {posLen} 光标位置处在 插入的值的哪个位置
     */
    setCursorPosition (dom,val,posLen) {
        var cursorPosition = 0;
        if(dom.selectionStart){
            cursorPosition = dom.selectionStart;
        }
        this.insertAtCursor(dom,val);
        dom.focus();
        console.log(posLen)
        dom.setSelectionRange(dom.value.length,cursorPosition + (posLen || val.length));
    }

    /*光标所在位置插入字符*/
    insertAtCursor(dom, val) {
        if (document.selection){
            dom.focus();
            sel = document.selection.createRange();
            sel.text = val;
            sel.select();
        }else if (dom.selectionStart || dom.selectionStart == '0'){
            let startPos = dom.selectionStart;
            let endPos = dom.selectionEnd;
            let restoreTop = dom.scrollTop;
            dom.value = dom.value.substring(0, startPos) + val + dom.value.substring(endPos, dom.value.length);
            if (restoreTop > 0){
                dom.scrollTop = restoreTop;
            }
            dom.focus();
            dom.selectionStart = startPos + val.length;
            dom.selectionEnd = startPos + val.length;
        } else {
            dom.value += val;
            dom.focus();
        }
    }
}
