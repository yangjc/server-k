/**
 * YJC <yangjiecong@live.com> @2017-08-12
 */

'use strict';

module.exports = function (templateContext) {

    return class MustacheData {

        constructor(data) {
            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    this[i] = data[i];
                }
            }
        }

        staticPath () {
            return function (text, render) {
                return templateContext.staticPath(render(text));
            };
        }

        // 设置 {mainContainer: ''} 可覆盖默认值
        mainContainer() {
            return `<div id="main"></div>`;
        }

        exportPageData() {
            return this.hasOwnProperty('pageData')
                ? `<script type="text/javascript">var pageData=${
                    JSON.stringify(this.pageData)
                        .replace(/\u2028/g, '\\u2028')
                        .replace(/\u2029/g, '\\u2029')
                        .replace(/<(\/?script)>/ig, '\\u003c$1>')
                    }</script>`
                : '';
        }

    };

};
