/**
 * jQuery.gpHatebuCounter 1.1
 * https://ginpen.com/jquery/gphatebucounter/
 * https://github.com/ginpei/jQuery.gpHatebuCounter
 *
 * Copyright (c) 2011 Takanashi Ginpei
 * https://ginpen.com
 *
 * Released under the MIT License.
 * https://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    try {
        if (window.com.ginpen.gpHatebuCounter) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }

    var gpHatebuCounter = com.ginpen.gpHatebuCounter = {
        /**
         * The version of this applycation.
         * @type String
         */
        VERSION: '1.0',

        /**
         * Default settings.
         * @type Object
         */
        DEFAULT: {
            before: false,
            outside: false,
            link: true,
            size: ''
        },

        /**
         * @param {Object} settings
         * @returns {Object}
         */
        mergeSettings: function(settings) {
            return $.extend({}, this.DEFAULT, settings);
        },

        /**
         * Set nice position.
         * @param {HtmlElement} $el The target.
         * @param {Object} settings
         */
        exec: function($el, settings) {
            if (!this._isTarget($el)) {
                return null;
            }

            var $hatebu = this.build($el, settings);

            if (this._isBeOutside(settings)) {
                if (this._isBeBefore(settings)) {
                    $el.before($hatebu);
                }
                else {
                    $el.after($hatebu);
                }
            }
            else {
                if (this._isBeBefore(settings)) {
                    $el.prepend($hatebu);
                }
                else {
                    $el.append($hatebu);
                }
            }

            return $hatebu;
        },

        /**
         * Return true if it is a available link.
         * @param {HtmlElement} $el
         * @returns {Boolean}
         */
        _isTarget: function($el) {
            return (
                $el.prop('tagName')
                && $el.prop('tagName').toLowerCase() == 'a'
                && !!$el.prop('href')
                && !$el.hasClass('gphatebucounter-ignore')
                );
        },

        /**
         * Return link target.
         * @param {HtmlElement} $el
         * @returns {String}
         */
        _getTargetUrl: function($el) {
            return $el.prop('href').replace(/#/g, '%23');
        },

        /**
         * Return size setting.
         * @param {Object} settings
         * @returns {String}
         */
        _getSize: function(settings) {
            var size = (settings || {}).size;
            if (size == 'large' || size == 'small') {
                return size;
            }
            else {
                return '';
            }
        },

        /**
         * Return true if it should be a link.
         * @param {Object} settings
         * @returns {Boolean}
         */
        _isBeLinked: function(settings) {
            settings = settings || {};
            if (!('link' in settings)) {
                settings.link = gpHatebuCounter.DEFAULT.link;
            }

            return !!settings.link;
        },

        /**
         * Return true if it should be put outside.
         * @param {Object} settings
         * @returns {Boolean}
         */
        _isBeOutside: function(settings) {
            // high priority
            if (this._isBeLinked(settings)) {
                return true;
            }

            settings = settings || {};
            if (!('outside' in settings)) {
                settings.outside = gpHatebuCounter.DEFAULT.outside;
            }

            return !!settings.outside;
        },

        /**
         * Return true if it should be located before target.
         * @param {Object} settings
         * @returns {Boolean}
         */
        _isBeBefore: function(settings) {
            settings = settings || {};
            if (!('before' in settings)) {
                settings.before = gpHatebuCounter.DEFAULT.before;
            }

            return !!settings.before;
        },

        /**
         * Build an element to be inserted.
         * @param {HtmlElement} $el
         * @param {Object} settings
         * @returns {HtmlElement}
         */
        build: function($el, settings) {
            var $img = this._buildImg($el, settings);

            var $hatebu;
            if (this._isBeLinked(settings)) {
                var $link = this._buildLink($el, settings);
                $hatebu = $link.append($img);
            }
            else {
                $hatebu = $img;
            }

            $hatebu.addClass('gphatebucounter');

            return $hatebu;
        },

        /**
         * Build img element.
         * @param {HtmlElement} $el
         * @param {Object} settings
         * @returns {HtmlElement}
         */
        _buildImg: function($el, settings) {
            var url = this._getImageUrl($el, settings);
            return $('<img />')
                .attr('src', url)
                .css('border-width', '0px');
        },

        /**
         * Return img url.
         * @param {HtmlElement} $el
         * @returns {String}
         */
        _getImageUrl: function($el, settings) {
            var size = this._getSize(settings);
            var targetUrl = this._getTargetUrl($el);

            return [
                'https://b.hatena.ne.jp/entry/image/',
                (size ? size + '/' : ''),
                targetUrl
            ].join('');
        },

        /**
         * Build a element.
         * ("a" means tag name.)
         * @param {HtmlElement} $el
         * @param {Object} settings
         * @returns {HtmlElement}
         */
        _buildLink: function($el, settings) {
            var url = this._getLinkUrl($el, settings);
            return $('<a />').attr('href', url);
        },

        /**
         * Return url for bookmark page.
         * @param {HtmlElement} $el
         * @returns {String}
         */
        _getLinkUrl: function($el, settings) {
            var targetUrl = this._getTargetUrl($el);

            return 'https://b.hatena.ne.jp/entry/' + targetUrl;
        },

        banpei: null
    };

    // jQuery method interface
    $.fn.gpHatebuCounter = function(settings) {
        settings = gpHatebuCounter.mergeSettings(settings);
        return this.each(function(i, el) {
            gpHatebuCounter.exec($(el), settings);
        });
    };
}(jQuery));
