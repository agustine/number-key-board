/**
 * Created by Ronnie on 15/12/21.
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
            confirmed: noop,
            canceled: noop
        };
        var maskLayer;
        var body = document.getElementsByTagName('body')[0];
        options = extend(defaults, options);
        function openKeyBoard() {
            maskLayer = createElement('div', 'number-board-mask'); //ocument.createElement('div');
            var box = createElement('div', options.className, null, maskLayer); //document.createElement('div');
            var title, resultLine, buttonsWrapper, indexOfButtons,
                result = elem.value, buttonCount, button, li, a;
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
            buttonCount = buttons.length;

            if (options.title) {
                title = createElement('div', 'number-title', null, box);
                title.innerHTML = options.title;
            }
            resultLine = createElement('div', 'number-result', null, box);
            resultLine.innerText = result || '0';


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
                a.addEventListener('click', buttonHandler, false);
            }

            function buttonHandler(e){
                var command = e.currentTarget.attributes.getNamedItem('data-command').nodeValue;
                var value = e.currentTarget.attributes.getNamedItem('data-value').nodeValue;
                switch (command){
                    case 'dot':
                        if(result.indexOf('.') > -1){
                            return;
                        }
                        if(options.integer){
                            return;
                        }
                        result += '.';
                        resultLine.innerText = result;
                        break;
                    case 'number':
                        if(result === '0'){
                            result = value;
                        } else {
                            result += value;
                        }
                        resultLine.innerText = result;
                        break;
                    case 'clear':
                        result = '0';
                        resultLine.innerText = result;
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
                        resultLine.innerText = result;
                        break;
                    case 'confirm':
                        elem.value = Number(result);
                        if(options.confirmed) options.confirmed(Number(result));
                        closeKeyboard();
                        break;
                    default:
                        break;
                }

                resultLine.innerText = result || '0';
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