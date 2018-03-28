'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var Util = _interopRequireWildcard(_util);

var _const = require('./const');

var _commands = require('./commands');

var BaseCommands = _interopRequireWildcard(_commands);

var _parser = require('./parser');

var BashParser = _interopRequireWildcard(_parser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bash = function () {
    function Bash() {
        var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Bash);

        this.commands = Object.assign(extensions, BaseCommands);
        this.prevCommands = [];
        this.prevCommandsIndex = 0;
    }

    /*
     * This adds the given <input> into the terminal history
     *
     * @param {string} input - the user input
     * @param {Object} state - the current terminal state
     * @returns {Object} the new terminal state
     */


    _createClass(Bash, [{
        key: 'pushInput',
        value: function pushInput(input, currentState) {
            this.prevCommands.push(input);
            this.prevCommandsIndex = this.prevCommands.length;

            // Append input to history
            return Object.assign({}, currentState, {
                history: currentState.history.concat({
                    cwd: currentState.cwd,
                    value: input
                })
            });
        }

        /*
         * This parses and executes the given <input> and returns an updated
         * state object.
         *
         * @param {string} input - the user input
         * @param {Object} state - the current terminal state
         * @param {function} state - a state progress observer callback
         * @returns {Object} a promise that resolves to the new terminal state
         */

    }, {
        key: 'execute',
        value: function execute(input, currentState) {
            var progressObserver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

            var commandList = BashParser.parse(input);
            return this.runCommands(commandList, currentState, progressObserver);
        }

        /*
         * This function executes a list of command lists. The outer list
         * is a dependency list parsed from the `&&` operator. The inner lists
         * are groups of commands parsed from the `;` operator. If any given
         * command fails, the outer list will stop executing.
         *
         * @param {Array} commands - the commands to run
         * @param {Object} state - the terminal state
         * @param {function} state - a state progress observer callback
         * @returns {Object} a promise that resolves to the new terminal state
         */

    }, {
        key: 'runCommands',
        value: function runCommands(commands, state) {
            var progressObserver = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

            var errorOccurred = false;
            var newState = Object.assign({}, state);

            var emitNextState = function emitNextState(p, command) {
                return p.catch(function (error) {
                    errorOccurred = true;
                    var message = error && error.message ? error.message : 'command ' + command.name + ' failed';
                    return Util.appendError(newState, '$1', message);
                }).then(function (nextState) {
                    errorOccurred = errorOccurred || nextState && nextState.error;
                    newState = nextState;
                    return nextState;
                });
            };

            var self = this;
            var stream = /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dependentCommands, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, command, result, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, partial;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 3;
                                _iterator = commands[Symbol.iterator]();

                            case 5:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 78;
                                    break;
                                }

                                dependentCommands = _step.value;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context.prev = 10;
                                _iterator2 = dependentCommands[Symbol.iterator]();

                            case 12:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context.next = 61;
                                    break;
                                }

                                command = _step2.value;

                                if (!errorOccurred) {
                                    _context.next = 16;
                                    break;
                                }

                                return _context.abrupt('break', 61);

                            case 16:
                                if (!(command.name === '')) {
                                    _context.next = 20;
                                    break;
                                }

                                _context.next = 19;
                                return Promise.resolve(newState);

                            case 19:
                                return _context.abrupt('continue', 58);

                            case 20:
                                if (self.commands[command.name]) {
                                    _context.next = 26;
                                    break;
                                }

                                errorOccurred = true;
                                newState = Util.appendError(newState, _const.Errors.COMMAND_NOT_FOUND, command.name);
                                _context.next = 25;
                                return Promise.resolve(newState);

                            case 25:
                                return _context.abrupt('continue', 58);

                            case 26:
                                result = self.commands[command.name].exec(newState, command);

                                if (!(result && typeof result[Symbol.iterator] === 'function')) {
                                    _context.next = 56;
                                    break;
                                }

                                // If the result of the command is an iterable, yield
                                // its successive procuded states.
                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context.prev = 31;
                                _iterator3 = result[Symbol.iterator]();

                            case 33:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context.next = 40;
                                    break;
                                }

                                partial = _step3.value;
                                _context.next = 37;
                                return emitNextState(Promise.resolve(partial), command);

                            case 37:
                                _iteratorNormalCompletion3 = true;
                                _context.next = 33;
                                break;

                            case 40:
                                _context.next = 46;
                                break;

                            case 42:
                                _context.prev = 42;
                                _context.t0 = _context['catch'](31);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context.t0;

                            case 46:
                                _context.prev = 46;
                                _context.prev = 47;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 49:
                                _context.prev = 49;

                                if (!_didIteratorError3) {
                                    _context.next = 52;
                                    break;
                                }

                                throw _iteratorError3;

                            case 52:
                                return _context.finish(49);

                            case 53:
                                return _context.finish(46);

                            case 54:
                                _context.next = 58;
                                break;

                            case 56:
                                _context.next = 58;
                                return emitNextState(Promise.resolve(result), command);

                            case 58:
                                _iteratorNormalCompletion2 = true;
                                _context.next = 12;
                                break;

                            case 61:
                                _context.next = 67;
                                break;

                            case 63:
                                _context.prev = 63;
                                _context.t1 = _context['catch'](10);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context.t1;

                            case 67:
                                _context.prev = 67;
                                _context.prev = 68;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 70:
                                _context.prev = 70;

                                if (!_didIteratorError2) {
                                    _context.next = 73;
                                    break;
                                }

                                throw _iteratorError2;

                            case 73:
                                return _context.finish(70);

                            case 74:
                                return _context.finish(67);

                            case 75:
                                _iteratorNormalCompletion = true;
                                _context.next = 5;
                                break;

                            case 78:
                                _context.next = 84;
                                break;

                            case 80:
                                _context.prev = 80;
                                _context.t2 = _context['catch'](3);
                                _didIteratorError = true;
                                _iteratorError = _context.t2;

                            case 84:
                                _context.prev = 84;
                                _context.prev = 85;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 87:
                                _context.prev = 87;

                                if (!_didIteratorError) {
                                    _context.next = 90;
                                    break;
                                }

                                throw _iteratorError;

                            case 90:
                                return _context.finish(87);

                            case 91:
                                return _context.finish(84);

                            case 92:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 80, 84, 92], [10, 63, 67, 75], [31, 42, 46, 54], [47,, 49, 53], [68,, 70, 74], [85,, 87, 91]]);
            })();

            var consumeStream = function consumeStream() {
                var _stream$next = stream.next(),
                    value = _stream$next.value,
                    done = _stream$next.done;

                if (!done) {
                    return value.then(function (nextState) {
                        return progressObserver(nextState);
                    }).then(function () {
                        return consumeStream(stream);
                    });
                }
                return Promise.resolve(newState);
            };

            return consumeStream();
        }

        /*
         * This is a very naive autocomplete method that works for both
         * commands and directories. If the input contains only one token it
         * should only suggest commands.
         *
         * @param {string} input - the user input
         * @param {Object} state - the terminal state
         * @param {Object} state.structure - the file structure
         * @param {string} state.cwd - the current working directory
         * @returns {?string} a suggested autocomplete for the <input>
         */

    }, {
        key: 'autocomplete',
        value: function autocomplete(input, _ref) {
            var structure = _ref.structure,
                cwd = _ref.cwd;

            var tokens = input.split(/ +/);
            var token = tokens.pop();
            var filter = function filter(item) {
                return item.indexOf(token) === 0;
            };
            var result = function result(str) {
                return tokens.concat(str).join(' ');
            };

            if (tokens.length === 0) {
                var suggestions = Object.keys(this.commands).filter(filter);
                return suggestions.length === 1 ? result(suggestions[0]) : null;
            } else {
                var pathList = token.split('/');
                token = pathList.pop();
                var partialPath = pathList.join('/');
                var path = Util.extractPath(partialPath, cwd);

                var _Util$getDirectoryByP = Util.getDirectoryByPath(structure, path),
                    err = _Util$getDirectoryByP.err,
                    dir = _Util$getDirectoryByP.dir;

                if (err) return null;
                var _suggestions = Object.keys(dir).filter(filter);
                var prefix = partialPath ? partialPath + '/' : '';
                return _suggestions.length === 1 ? result('' + prefix + _suggestions[0]) : null;
            }
        }
    }, {
        key: 'getPrevCommand',
        value: function getPrevCommand() {
            return this.prevCommands[--this.prevCommandsIndex];
        }
    }, {
        key: 'getNextCommand',
        value: function getNextCommand() {
            return this.prevCommands[++this.prevCommandsIndex];
        }
    }, {
        key: 'hasPrevCommand',
        value: function hasPrevCommand() {
            return this.prevCommandsIndex !== 0;
        }
    }, {
        key: 'hasNextCommand',
        value: function hasNextCommand() {
            return this.prevCommandsIndex !== this.prevCommands.length - 1;
        }
    }]);

    return Bash;
}();

exports.default = Bash;