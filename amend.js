/*!
 * amend.js
 *
 * Copyright (c) 2014 Scott Doxey
 * Released under the MIT license
 */

(function () {

    'use strict';

    var defaultEvents = [];

    defaultEvents.push({
        // Tab, with selection
        type: 'keydown',
        keyCode: [9],
        selection: true,
        metaKey: false,
        shiftKey: false,
        expand: true,
        method: function (e, value, selection) {

            var selectedValue = selection.value.replace(/^/mg, '\t');

            e.preventDefault();

            value = this.insert(selectedValue, value, {
                start: selection.start,
                end: selection.end
            });

            selection.end = selection.end + (selectedValue.length - selection.value.length);

            return value;

        }
    });

    defaultEvents.push({
        // Tab + shift, with selection
        type: 'keydown',
        keyCode: [9],
        selection: true,
        metaKey: false,
        shiftKey: true,
        expand: true,
        method: function (e, value, selection) {

            var selectedValue = selection.value.replace(/^\t/mg, '');

            e.preventDefault();

            value = this.insert(selectedValue, value, {
                start: selection.start,
                end: selection.end
            });

            selection.end = selection.end - (selection.value.length - selectedValue.length);

            return value;

        }
    });

    defaultEvents.push({
        // Tab, with no selection
        type: 'keydown',
        keyCode: [9],
        selection: false,
        metaKey: false,
        shiftKey: false,
        expand: false,
        method: function (e, value, selection) {

            e.preventDefault();

            value = this.insert('\t', value, selection);

            selection.start = selection.start + 1;
            selection.end = selection.end + 1;

            return value;

        }
    });

    defaultEvents.push({
        // Tab + shift, with no selection
        type: 'keydown',
        keyCode: [9],
        selection: false,
        metaKey: false,
        shiftKey: true,
        expand: true,
        method: function (e, value, selection) {

            var selectedValue = selection.value.replace(/^\t/mg, '');

            e.preventDefault();

            value = this.insert(selectedValue, value, {
                start: selection.start,
                end: selection.end
            });

            selection.end = selection.end - (selection.value.length - selectedValue.length);

            return value;

        }
    });

    /**
     * Creates a new amend object.
     *
     *     var editor = new amend(document.querySelector('textarea'));
     *
     * @property {Object} element Reference to the textarea element.
     * @property {Object} events List of events fired on either keydown or keyup.
     * @param {Object} element Reference to an HTML textarea element.
     * @return {Object} New amend object.
     * @public
     */

    function Amend(element) {

        if (!(this instanceof Amend)) {

            return new Amend(element);

        }

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

                selection = this.selection(this.events[i].expand);

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
     *     editor.selection(true);
     *
     * @param {Object} extend Automatically extend to select the entirety of the line(s) selected.
     * @return {Object} Object containing both the value and start/end position of cursor selection.
     * @public
     */

    Amend.prototype.selection = function (extend) {

        var selection = {
                start: Math.min(this.element.selectionStart, this.element.selectionEnd),
                end: Math.max(this.element.selectionStart, this.element.selectionEnd),
                value: null
            },
            matches;

        if (extend) {

            matches = this.element.value.substr(0, selection.start).match(/^([\s\S]+)\n/);

            if (matches) {

                selection.start = matches[0].length;

            }

            matches = this.element.value.substr(selection.end).match(/([\S]*)\n/);

            if (matches) {

                selection.end = selection.end + (matches[0].length - 1);

            }

        }

        selection.value = this.element.value.substr(selection.start, selection.end - selection.start);

        return selection;

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
