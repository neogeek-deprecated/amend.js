/*!
 * amend.js
 *
 * Copyright (c) 2014 Scott Doxey
 * Released under the MIT license
 */

(function () {

    'use strict';

    var defaultEvents = [];

    /**
     * Creates a new amend object.
     *
     *     var editor = new amend(document.querySelector('textarea'));
     *
     * @property {Object} element Reference to the textarea element.
     * @property {Object} events List of events fired on either keydown or keyup.
     * @param {Object} canvas Reference to an HTML textarea element.
     * @return {Object} New amend object.
     * @public
     */

    function Amend(element) {

        this.element = element;
        this.events = [].concat(defaultEvents);

        this.element.addEventListener('keydown', this._handleEvent.bind(this));
        this.element.addEventListener('keyup', this._handleEvent.bind(this));

    }

    /**
     * Handles all key down/up events.
     *
     *     this.element.addEventListener('keydown', this._handleEvent.bind(this));
     *     this.element.addEventListener('keyup', this._handleEvent.bind(this));
     *
     * @return {void}
     * @private
     */

    Amend.prototype._handleEvent = function (e) {

        var i,
            length,
            value = this.element.value,
            selection = this.selection();

        for (i = 0, length = this.events.length; i < length; i += 1) {

            if (this.events[i].type === e.type &&
                    this.events[i].keyCode.indexOf(e.keyCode) !== -1 &&
                    this.events[i].selection !== (selection.start === selection.end) &&
                    this.events[i].metaKey === e.metaKey &&
                    this.events[i].shiftKey === e.shiftKey) {

                value = this.events[i].method.call(this, e, value, selection);

                this.element.value = value;

                this.element.setSelectionRange(selection.start, selection.end);

            }

        }

    };

    /**
     * Returns the current cursor selection.
     *
     *     editor.selection();
     *
     * @return {Object} Object containing both start and end position of cursor selection.
     * @public
     */

    Amend.prototype.selection = function () {

        return {
            start: Math.min(this.element.selectionStart, this.element.selectionEnd),
            end: Math.max(this.element.selectionStart, this.element.selectionEnd)
        };

    };

    /**
     * Inserts text inside the current selection.
     *
     *     editor.selection("\t", { start: 0, end: 0 });
     *
     * @property {String} text Text to insert inside current selection.
     * @property {Object} selection Current selection of the textarea.
     * @return {String} Returns updated value of the textarea.
     * @public
     */

    Amend.prototype.insert = function (text, value, selection) {

        value = value.substr(0, selection.start) + text + value.substr(selection.end);

        return value;

    };

    /*!
     * AMD Support
     */

    if (typeof define === 'function' && define.amd !== undefined) {

        define([], function () { return Amend; });

    } else if (typeof module === 'object' && module.exports !== undefined) {

        module.exports = Amend;

    } else {

        window.Amend = Amend;

    }

}());
