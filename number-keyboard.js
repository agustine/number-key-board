/**
 * Created by Ronnie(agustine103@gmail.com) on 15/12/21.
 *
 *                            _ooOoo_
 *                           o8888888o
 *                           88" . "88
 *                           (| -_- |)
 *                            O\ = /O
 *                        ____/`---'\____
 *                      .   ' \\| |// `.
 *                       / \\||| : |||// \
 *                     / _||||| -:- |||||- \
 *                       | | \\\ - /// | |
 *                     | \_| ''\---/'' | |
 *                      \ .-\__ `-` ___/-. /
 *                   ___`. .' /--.--\ `. . __
 *                ."" '< `.___\_<|>_/___.' >'"".
 *               | | : `- \`.;`\ _ /`;.`/ - ` : | |
 *                 \ \ `-. \_ __\ /__ _/ .-` / /
 *         ======`-.____`-.___\_____/___.-`____.-'======
 *                            `=---='
 *
 *         .............................................
 *                  佛祖保佑             永无BUG
 *          佛曰:
 *                  写字楼里写字间，写字间里程序员；
 *                  程序人员写程序，又拿程序换酒钱。
 *                  酒醒只在网上坐，酒醉还来网下眠；
 *                  酒醉酒醒日复日，网上网下年复年。
 *                  但愿老死电脑间，不愿鞠躬老板前；
 *                  奔驰宝马贵者趣，公交自行程序员。
 *                  别人笑我忒疯癫，我笑自己命太贱；
 *                  不见满街漂亮妹，哪个归得程序员？
 *
 *
 * Number keyboard for mobile, <input type="number" > not support on mobile browser
 *
 */
var NumberInput = (function () {
    'use strict';

    var noop = function(){
    };

    function extend(target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }

        return target;
    }

    function createElement(tagName, className, attributes, parentNode){
        var elem = document.createElement(tagName);
        var key;
        if(className){
            setAttribute(elem, 'class', className);
        }
        if(attributes){
            for(key in attributes){
                setAttribute(elem, key, attributes[key]);
            }
        }
        if(parentNode){
            parentNode.appendChild(elem);
        }
        return elem;
    }

    function setAttribute(elem, name, value) {
        var attrNode = document.createAttribute(name);
        attrNode.nodeValue = value;
        elem.attributes.setNamedItem(attrNode);
    }

    function thisClass(elem, options) {
        var defaults = {
            title: '',
            className: 'number-board',
            integer: false,
            unitName: '',
            round: 0,
            confirmed: noop,
            canceled: noop
        };
        var maskLayer;
        var body = document.getElementsByTagName('body')[0];
        var isInput = elem.tagName.toLowerCase() === 'input';
        options = extend(defaults, options);

        function getOriginValue(){
            var result = isInput ? elem.value : elem.innerHTML;
            result = result || '0';
            return result
        }

        function setNewValue(value){
            if(isInput){
                elem.value = value;
            } else {
                elem.innerText = value;
            }
        }

        function openKeyBoard() {
            maskLayer = createElement('div', 'number-board-mask'); //ocument.createElement('div');
            var box = createElement('div', options.className, null, maskLayer); //document.createElement('div');
            var title, resultLine, resultSpan, unit, buttonsWrapper, indexOfButtons,
                result = getOriginValue(), buttonCount, button, li, a;
            var buttons = [
                {text: '取消', command: 'cancel', value: ''},
                {text: '清空', command: 'clear', value: ''},
                {text: '<<<', command: 'back', value: ''},
                {text: '1', command: 'number', value: '1'},
                {text: '2', command: 'number', value: '2'},
                {text: '3', command: 'number', value: '3'},
                {text: '4', command: 'number', value: '4'},
                {text: '5', command: 'number', value: '5'},
                {text: '6', command: 'number', value: '6'},
                {text: '7', command: 'number', value: '7'},
                {text: '8', command: 'number', value: '8'},
                {text: '9', command: 'number', value: '9'},
                {text: '.', command: 'dot', value: '.'},
                {text: '0', command: 'number', value: '0'},
                {text: '确定', command: 'confirm', value: ''}
            ];

            //if(options.nullable && !result){
            //
            //}

            buttonCount = buttons.length;

            if (options.title) {
                title = createElement('div', 'number-title', null, box);
                title.innerHTML = options.title;
            }
            resultLine = createElement('div', 'number-result', null, box);

            resultSpan = createElement('span', '', null, resultLine);
            resultSpan.innerText = result || '0';

            if(options.unitName){
                unit = createElement('span', 'number-result-unit', null, resultLine);
                unit.innerText = options.unitName;
            }

            buttonsWrapper = createElement('ul', options.integer ? 'number-buttons integer': 'number-buttons', null, box);

            for(indexOfButtons = 0; indexOfButtons < buttonCount; indexOfButtons++){
                button = buttons[indexOfButtons];
                li = createElement('li', null, null, buttonsWrapper);
                a = createElement('a', 'key-' + button.command, {
                    'href': 'javascript:void(0)',
                    'data-command': button.command,
                    'data-value': button.value
                }, li);
                a.innerText = button.text;
                a.addEventListener('touchstart', buttonHandler, false);
            }

            function buttonHandler(e){
                var command = e.currentTarget.attributes.getNamedItem('data-command').nodeValue;
                var value = e.currentTarget.attributes.getNamedItem('data-value').nodeValue;
                var splitedNumber;
                switch (command){
                    case 'dot':
                        if(result.indexOf('.') > -1){
                            return;
                        }
                        if(options.integer){
                            return;
                        }
                        result += '.';
                        resultSpan.innerText = result;
                        break;
                    case 'number':
                        if(!options.integer && options.round){
                            splitedNumber = result.split('.');
                            if(splitedNumber[1] && splitedNumber[1].length >= options.round){
                                break;
                            }
                        }
                        if(result === '0'){
                            result = value;
                        } else {
                            result += value;
                        }
                        resultSpan.innerText = result;
                        break;
                    case 'clear':
                        result = '0';
                        resultSpan.innerText = result;
                        break;
                    case 'cancel':
                        if(options.canceled) options.canceled(result);
                        closeKeyboard();
                        break;
                    case 'back':
                        if(result.length === 1){
                            result = '0';
                        } else {
                            result = result.substring(0, result.length - 1);
                        }
                        resultSpan.innerText = result;
                        break;
                    case 'confirm':
                        setNewValue(Number(result));
                        //if(elem.value){
                        //    elem.value = Number(result);
                        //} else {
                        //    elem.innerHTML = Number(result);
                        //}

                        if(options.confirmed) options.confirmed(Number(result));
                        closeKeyboard();
                        break;
                    default:
                        break;
                }

                resultSpan.innerText = result || '0';
            }

            body.appendChild(maskLayer);
            maskLayer.addEventListener('click', maskClickHandler, false);
        }

        function closeKeyboard(){
            if(maskLayer){
                maskLayer.parentNode.removeChild(maskLayer);
            }
        }

        function maskClickHandler(e){
            if(e.target === e.currentTarget){
                if(options.canceled) options.canceled();
                closeKeyboard();
            }
        }


        elem.addEventListener('click', openKeyBoard, false);
    }


    return thisClass;
})();