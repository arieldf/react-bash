(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactBash"] = factory(require("react"));
	else
		root["ReactBash"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.BashUtil = exports.BashConst = undefined;

	var _component = __webpack_require__(5);

	var _component2 = _interopRequireDefault(_component);

	var _util = __webpack_require__(2);

	var BashUtil = _interopRequireWildcard(_util);

	var _const = __webpack_require__(1);

	var BashConst = _interopRequireWildcard(_const);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _component2.default;
	exports.BashConst = BashConst;
	exports.BashUtil = BashUtil;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var IS_SERVER = exports.IS_SERVER = typeof window === 'undefined';

	var BACK_REGEX = exports.BACK_REGEX = /\/?\.?[\w-_]+\/\.\./;

	var Errors = exports.Errors = {
	    COMMAND_NOT_FOUND: '-bash: $1: command not found',
	    FILE_EXISTS: 'mkdir: $1: File exists',
	    NO_SUCH_FILE: '-bash: cd: $1: No such file or directory',
	    NOT_A_DIRECTORY: '-bash: cd: $1: Not a directory',
	    IS_A_DIRECTORY: 'cat: $1: Is a directory'
	};

	var EnvVariables = exports.EnvVariables = {
	    TERM_PROGRAM: 'ReactBash.app',
	    TERM: 'reactbash-256color',
	    TERM_PROGRAM_VERSION: '1.4.3',
	    TERM_SESSION_ID: 'w0t0p1:37842145-87D9-4768-BEC3-3684BAF3A964',
	    USER: function USER(state) {
	        return state.settings.user.username;
	    },
	    PATH: '/',
	    PWD: function PWD(state) {
	        return '/' + state.cwd;
	    },
	    LANG: function LANG() {
	        return !IS_SERVER ? navigator.language.replace('-', '_') + '.UTF-8' : 'en_US.UTF-8';
	    },
	    HOME: '/',
	    LOGNAME: function LOGNAME(state) {
	        return state.settings.user.username;
	    },
	    OLDPWD: '/'
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.trim = trim;
	exports.appendError = appendError;
	exports.extractPath = extractPath;
	exports.getDirectoryByPath = getDirectoryByPath;
	exports.getEnvVariables = getEnvVariables;
	exports.isFile = isFile;

	var _const = __webpack_require__(1);

	/*
	 * This is a utility method for trimming the beginning
	 * and ending of a string of any given char.
	 *
	 * @param {string} str - the string the trim
	 * @param {string} char - the char to remove
	 * @returns {string} the trimmed string
	 */
	function trim(str, char) {
	    if (str[0] === char) {
	        str = str.substr(1);
	    }
	    if (str[str.length - 1] === char) {
	        str = str.substr(0, str.length - 1);
	    }
	    return str;
	}

	/*
	 * This is a utility method for appending an error
	 * message to the current state.
	 *
	 * @param {Object} state - the terminal state
	 * @param {string} error - the error to interpolate
	 * @param {string} command - the string to insert
	 * @returns {Object} the new terminal state
	 */
	function appendError(state, error, command) {
	    return Object.assign({}, state, {
	        error: true,
	        history: state.history.concat({
	            value: error.replace('$1', command)
	        })
	    });
	}

	/*
	 * This is a utility method for appending a relative path
	 * to a root path. Handles trimming and backtracking.
	 *
	 * @param {string} relativePath
	 * @param {string} rootPath
	 * @returns {string} the combined path
	 */
	function extractPath(relativePath, rootPath) {
	    // Short circuit for relative path
	    if (relativePath === '') return rootPath;

	    // Strip trailing slash
	    relativePath = trim(relativePath, '/');

	    // Create raw path
	    var path = '' + (rootPath ? rootPath + '/' : '') + relativePath;

	    // Strip ../ references
	    while (path.match(_const.BACK_REGEX)) {
	        path = path.replace(_const.BACK_REGEX, '');
	    }
	    return trim(path, '/');
	}

	/*
	 * This is a utility method for traversing the structure
	 * down the relative path.
	 *
	 * @param {Object} structure - the terminal file structure
	 * @param {string} relativePath - the path of the directory
	 * @returns {Object} the directory or error
	 */
	function getDirectoryByPath(structure, relativePath) {
	    var path = relativePath.split('/');

	    // Short circuit for empty root path
	    if (!path[0]) return { dir: structure };

	    var dir = structure;
	    var i = 0;
	    while (i < path.length) {
	        var key = path[i];
	        var child = dir[key];
	        if (child && (typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
	            if (child.hasOwnProperty('content')) {
	                return { err: _const.Errors.NOT_A_DIRECTORY.replace('$1', relativePath) };
	            } else {
	                dir = child;
	            }
	        } else {
	            return { err: _const.Errors.NO_SUCH_FILE.replace('$1', relativePath) };
	        }
	        i++;
	    }
	    return { dir: dir };
	}

	/*
	 * This is a utility method for getting the environment
	 * variables with the dynamic values updated with state.
	 *
	 * @param {Object} state - the terminal state
	 * @returns {Object} the updated env variables
	 */
	function getEnvVariables(state) {
	    return Object.keys(_const.EnvVariables).reduce(function (envVars, key) {
	        var value = _const.EnvVariables[key];
	        envVars[key] = typeof value === 'function' ? value(state) : value;
	        return envVars;
	    }, {});
	}

	/*
	 * This is a utility method for determining if a given filesystem entry is a
	 * file or directoy.
	 *
	 * @param {Object} entry - the filesystem entry
	 * @returns {Boolean} whether the entry is a file
	 */
	function isFile(entry) {
	    return entry.content !== undefined;
	}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.sleep = exports.rm = exports.whoami = exports.printenv = exports.echo = exports.pwd = exports.cd = exports.mkdir = exports.cat = exports.ls = exports.clear = exports.help = undefined;

	var _util = __webpack_require__(2);

	var Util = _interopRequireWildcard(_util);

	var _const = __webpack_require__(1);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var helpCommands = ['clear', 'ls', 'cat', 'mkdir', 'cd', 'pwd', 'echo', 'printenv', 'whoami', 'rm', 'sleep'];

	var help = exports.help = {
	    exec: function exec(state) {
	        var _state$history;

	        return Object.assign({}, state, {
	            history: (_state$history = state.history).concat.apply(_state$history, [{ value: 'React-bash:' }, { value: 'These shell commands are defined internally.  Type \'help\' to see this list.' }].concat(_toConsumableArray(helpCommands.map(function (value) {
	                return { value: value };
	            }))))
	        });
	    }
	};

	var clear = exports.clear = {
	    exec: function exec(state) {
	        return Object.assign({}, state, { history: [] });
	    }
	};

	var ls = exports.ls = {
	    exec: function exec(state, _ref) {
	        var flags = _ref.flags,
	            args = _ref.args;

	        var path = args[0] || '';
	        var fullPath = Util.extractPath(path, state.cwd);

	        var _Util$getDirectoryByP = Util.getDirectoryByPath(state.structure, fullPath),
	            err = _Util$getDirectoryByP.err,
	            dir = _Util$getDirectoryByP.dir;

	        if (err) {
	            return Util.appendError(state, err, path);
	        } else {
	            var content = Object.keys(dir);
	            if (!flags.a) {
	                content = content.filter(function (name) {
	                    return name[0] !== '.';
	                });
	            }
	            if (flags.l) {
	                return Object.assign({}, state, {
	                    history: state.history.concat(content.map(function (value) {
	                        return { value: value };
	                    }))
	                });
	            } else {
	                return Object.assign({}, state, {
	                    history: state.history.concat({ value: content.join(' ') })
	                });
	            }
	        }
	    }
	};

	var cat = exports.cat = {
	    exec: function exec(state, _ref2) {
	        var args = _ref2.args;

	        var path = args[0];
	        var relativePath = path.split('/');
	        var fileName = relativePath.pop();
	        var fullPath = Util.extractPath(relativePath.join('/'), state.cwd);

	        var _Util$getDirectoryByP2 = Util.getDirectoryByPath(state.structure, fullPath),
	            err = _Util$getDirectoryByP2.err,
	            dir = _Util$getDirectoryByP2.dir;

	        if (err) {
	            return Util.appendError(state, err, path);
	        } else if (!dir[fileName]) {
	            return Util.appendError(state, _const.Errors.NO_SUCH_FILE, path);
	        } else if (!dir[fileName].hasOwnProperty('content')) {
	            return Util.appendError(state, _const.Errors.IS_A_DIRECTORY, path);
	        } else {
	            return Object.assign({}, state, {
	                history: state.history.concat({
	                    value: dir[fileName].content
	                })
	            });
	        }
	    }
	};

	var mkdir = exports.mkdir = {
	    exec: function exec(state, _ref3) {
	        var args = _ref3.args;

	        var path = args[0];
	        var relativePath = path.split('/');
	        var newDirectory = relativePath.pop();
	        var fullPath = Util.extractPath(relativePath.join('/'), state.cwd);
	        var deepCopy = JSON.parse(JSON.stringify(state.structure));

	        var _Util$getDirectoryByP3 = Util.getDirectoryByPath(deepCopy, fullPath),
	            dir = _Util$getDirectoryByP3.dir;

	        if (dir[newDirectory]) {
	            return Util.appendError(state, _const.Errors.FILE_EXISTS, path);
	        } else {
	            dir[newDirectory] = {};
	            return Object.assign({}, state, { structure: deepCopy });
	        }
	    }
	};

	var cd = exports.cd = {
	    exec: function exec(state, _ref4) {
	        var args = _ref4.args;

	        var path = args[0];
	        if (!path || path === '/') {
	            return Object.assign({}, state, { cwd: '' });
	        }

	        var fullPath = Util.extractPath(path, state.cwd);

	        var _Util$getDirectoryByP4 = Util.getDirectoryByPath(state.structure, fullPath),
	            err = _Util$getDirectoryByP4.err;

	        if (err) {
	            return Util.appendError(state, err, path);
	        } else {
	            return Object.assign({}, state, { cwd: fullPath });
	        }
	    }
	};

	var pwd = exports.pwd = {
	    exec: function exec(state) {
	        var directory = '/' + state.cwd;
	        return Object.assign({}, state, {
	            history: state.history.concat({ value: directory })
	        });
	    }
	};

	var echo = exports.echo = {
	    exec: function exec(state, _ref5) {
	        var input = _ref5.input;

	        var ECHO_LENGTH = 'echo '.length;
	        var envVariables = Util.getEnvVariables(state);
	        var value = input.slice(ECHO_LENGTH).replace(/(\$\w+)/g, function (key) {
	            return envVariables[key.slice(1)] || '';
	        });
	        return Object.assign({}, state, {
	            history: state.history.concat({ value: value })
	        });
	    }
	};

	var printenv = exports.printenv = {
	    exec: function exec(state) {
	        var envVariables = Util.getEnvVariables(state);
	        var values = Object.keys(envVariables).map(function (key) {
	            return { value: key + '=' + envVariables[key] };
	        });
	        return Object.assign({}, state, {
	            history: state.history.concat(values)
	        });
	    }
	};

	var whoami = exports.whoami = {
	    exec: function exec(state) {
	        var value = state.settings.user.username;
	        return Object.assign({}, state, {
	            history: state.history.concat({ value: value })
	        });
	    }
	};

	var rm = exports.rm = {
	    exec: function exec(state, _ref6) {
	        var flags = _ref6.flags,
	            args = _ref6.args;

	        var path = args[0];
	        var relativePath = path.split('/');
	        var file = relativePath.pop();
	        var fullPath = Util.extractPath(relativePath.join('/'), state.cwd);
	        var deepCopy = JSON.parse(JSON.stringify(state.structure));

	        var _Util$getDirectoryByP5 = Util.getDirectoryByPath(deepCopy, fullPath),
	            dir = _Util$getDirectoryByP5.dir;

	        if (dir[file]) {
	            // folder deletion requires the recursive flags `-r` or `-R`
	            if (!Util.isFile(dir[file]) && !(flags.r || flags.R)) {
	                return Util.appendError(state, _const.Errors.IS_A_DIRECTORY, path);
	            }
	            delete dir[file];
	            return Object.assign({}, state, { structure: deepCopy });
	        } else {
	            return Util.appendError(state, _const.Errors.NO_SUCH_FILE, path);
	        }
	    }
	};

	var sleep = exports.sleep = {
	    exec: function exec(state, _ref7) {
	        var args = _ref7.args;

	        var duration = parseFloat(args[0]);
	        if (isNaN(duration)) {
	            duration = 0;
	        }
	        return new Promise(function (resolve) {
	            return setTimeout(function () {
	                return resolve(state);
	            }, duration * 1000);
	        });
	    }
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _util = __webpack_require__(2);

	var Util = _interopRequireWildcard(_util);

	var _const = __webpack_require__(1);

	var _commands = __webpack_require__(3);

	var BaseCommands = _interopRequireWildcard(_commands);

	var _parser = __webpack_require__(6);

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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(8);

	var _react2 = _interopRequireDefault(_react);

	var _commands = __webpack_require__(3);

	var BaseCommands = _interopRequireWildcard(_commands);

	var _bash = __webpack_require__(4);

	var _bash2 = _interopRequireDefault(_bash);

	var _styles = __webpack_require__(7);

	var _styles2 = _interopRequireDefault(_styles);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CTRL_CHAR_CODE = 17;
	var L_CHAR_CODE = 76;
	var C_CHAR_CODE = 67;
	var UP_CHAR_CODE = 38;
	var DOWN_CHAR_CODE = 40;
	var TAB_CHAR_CODE = 9;
	var noop = function noop() {};

	var Terminal = function (_Component) {
	    _inherits(Terminal, _Component);

	    function Terminal(_ref) {
	        var history = _ref.history,
	            structure = _ref.structure,
	            extensions = _ref.extensions,
	            prefix = _ref.prefix;

	        _classCallCheck(this, Terminal);

	        var _this = _possibleConstructorReturn(this, (Terminal.__proto__ || Object.getPrototypeOf(Terminal)).call(this));

	        _this.Bash = new _bash2.default(extensions);
	        _this.ctrlPressed = false;
	        _this.state = {
	            settings: { user: { username: prefix.split('@')[1] } },
	            history: history.slice(),
	            structure: Object.assign({}, structure),
	            cwd: '',
	            isBusy: false,
	            bashExecutionsObserver: null
	        };
	        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	        _this.handleKeyUp = _this.handleKeyUp.bind(_this);
	        return _this;
	    }

	    _createClass(Terminal, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.refs.input.focus();
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(_ref2) {
	            var extensions = _ref2.extensions,
	                structure = _ref2.structure,
	                history = _ref2.history;

	            var updatedState = {};
	            if (structure) {
	                updatedState.structure = Object.assign({}, structure);
	            }
	            if (history) {
	                updatedState.history = history.slice();
	            }
	            if (extensions) {
	                this.Bash.commands = Object.assign({}, extensions, BaseCommands);
	            }
	            this.setState(updatedState);
	        }

	        /*
	         * Utilize immutability
	         */

	    }, {
	        key: 'shouldComponentUpdate',
	        value: function shouldComponentUpdate(nextProps, nextState) {
	            return this.state !== nextState || this.props !== nextProps;
	        }

	        /*
	         * Keep input in view on change
	         */

	    }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate() {
	            this.refs.input.scrollIntoView();
	        }

	        /*
	         * Forward the input along to the Bash autocompleter. If it works,
	         * update the input.
	         */

	    }, {
	        key: 'attemptAutocomplete',
	        value: function attemptAutocomplete() {
	            var input = this.refs.input.value;
	            var suggestion = this.Bash.autocomplete(input, this.state);
	            if (suggestion) {
	                this.refs.input.value = suggestion;
	            }
	        }

	        /*
	         * Handle keydown for special hot keys. The tab key
	         * has to be handled on key down to prevent default.
	         * @param {Event} evt - the DOM event
	         */

	    }, {
	        key: 'handleKeyDown',
	        value: function handleKeyDown(evt) {
	            if (evt.which === CTRL_CHAR_CODE) {
	                this.ctrlPressed = true;
	            } else if (evt.which === TAB_CHAR_CODE) {
	                // Tab must be on keydown to prevent default
	                this.attemptAutocomplete();
	                evt.preventDefault();
	            }
	        }

	        /*
	         * Handle keyup for special hot keys.
	         * @param {Event} evt - the DOM event
	         *
	         * -- Supported hot keys --
	         * ctrl + l : clear
	         * ctrl + c : cancel current command
	         * up - prev command from history
	         * down - next command from history
	         * tab - autocomplete
	         */

	    }, {
	        key: 'handleKeyUp',
	        value: function handleKeyUp(evt) {
	            var _this2 = this;

	            if (evt.which === L_CHAR_CODE) {
	                if (this.ctrlPressed) {
	                    var observer = this.Bash.execute('clear', this.state).then(function (nextState) {
	                        return new Promise(function (resolve) {
	                            _this2.setState(nextState, resolve);
	                        });
	                    });

	                    // Test instrumentation
	                    if (this.props.observeBashExecutions) {
	                        this.setState({ bashExecutionsObserver: observer });
	                    }
	                }
	            } else if (evt.which === C_CHAR_CODE) {
	                if (this.ctrlPressed) {
	                    this.refs.input.value = '';
	                }
	            } else if (evt.which === UP_CHAR_CODE) {
	                if (this.Bash.hasPrevCommand()) {
	                    this.refs.input.value = this.Bash.getPrevCommand();
	                }
	            } else if (evt.which === DOWN_CHAR_CODE) {
	                if (this.Bash.hasNextCommand()) {
	                    this.refs.input.value = this.Bash.getNextCommand();
	                } else {
	                    this.refs.input.value = '';
	                }
	            } else if (evt.which === CTRL_CHAR_CODE) {
	                this.ctrlPressed = false;
	            }
	        }
	    }, {
	        key: 'handleSubmit',
	        value: function handleSubmit(evt) {
	            var _this3 = this;

	            evt.preventDefault();

	            var input = evt.target[0].value;

	            this.setState(Object.assign({}, this.Bash.pushInput(input, this.state), { isBusy: true }), function () {
	                _this3.refs.input.value = '';

	                // Execute command
	                var observer = _this3.Bash.execute(input, _this3.state, function (nextState) {
	                    return new Promise(function (resolve) {
	                        _this3.setState(nextState, resolve);
	                    });
	                }).then(function (nextState) {
	                    return new Promise(function (resolve) {
	                        _this3.setState(Object.assign({}, nextState, { isBusy: false }), resolve);
	                    });
	                });

	                // Test instrumentation
	                if (_this3.props.observeBashExecutions) {
	                    _this3.setState({ bashExecutionsObserver: observer });
	                }
	            });
	        }
	    }, {
	        key: 'renderHistoryItem',
	        value: function renderHistoryItem(style) {
	            var _this4 = this;

	            return function (item, key) {
	                var prefix = item.hasOwnProperty('cwd') ? _react2.default.createElement(
	                    'span',
	                    { style: style.prefix },
	                    _this4.props.prefix + ' ~' + item.cwd + ' $'
	                ) : undefined;
	                return _react2.default.createElement(
	                    'div',
	                    { 'data-test-id': 'history-' + key, key: key },
	                    prefix,
	                    item.value
	                );
	            };
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this5 = this;

	            var _props = this.props,
	                onClose = _props.onClose,
	                onExpand = _props.onExpand,
	                onMinimize = _props.onMinimize,
	                prefix = _props.prefix,
	                theme = _props.theme;
	            var _state = this.state,
	                history = _state.history,
	                cwd = _state.cwd;

	            var style = _styles2.default[theme] || _styles2.default.light;

	            // Hide the prompt while the terminal is busy
	            var formStyle = Object.assign({}, style.form);
	            if (this.state.isBusy) {
	                formStyle.display = 'none';
	            }

	            return _react2.default.createElement(
	                'div',
	                { className: 'ReactBash', style: style.ReactBash },
	                _react2.default.createElement(
	                    'div',
	                    { style: style.header },
	                    _react2.default.createElement('span', { style: style.redCircle, onClick: onClose }),
	                    _react2.default.createElement('span', { style: style.yellowCircle, onClick: onMinimize }),
	                    _react2.default.createElement('span', { style: style.greenCircle, onClick: onExpand })
	                ),
	                _react2.default.createElement(
	                    'div',
	                    { style: style.body, onClick: function onClick() {
	                            return _this5.refs.input.focus();
	                        } },
	                    history.map(this.renderHistoryItem(style)),
	                    _react2.default.createElement(
	                        'form',
	                        { onSubmit: function onSubmit(evt) {
	                                return _this5.handleSubmit(evt);
	                            }, style: formStyle },
	                        _react2.default.createElement(
	                            'span',
	                            { style: style.prefix },
	                            prefix + ' ~' + cwd + ' $'
	                        ),
	                        _react2.default.createElement('input', {
	                            autoComplete: 'off',
	                            onKeyDown: this.handleKeyDown,
	                            onKeyUp: this.handleKeyUp,
	                            ref: 'input',
	                            style: style.input
	                        })
	                    )
	                )
	            );
	        }
	    }]);

	    return Terminal;
	}(_react.Component);

	exports.default = Terminal;


	Terminal.Themes = {
	    LIGHT: 'light',
	    DARK: 'dark'
	};

	Terminal.propTypes = {
	    extensions: _react.PropTypes.object,
	    history: _react.PropTypes.array,
	    onClose: _react.PropTypes.func,
	    onExpand: _react.PropTypes.func,
	    onMinimize: _react.PropTypes.func,
	    prefix: _react.PropTypes.string,
	    structure: _react.PropTypes.object,
	    theme: _react.PropTypes.string,

	    // This property serves to enable the instrumentation of the component, so
	    // that asynchronous updates of its state can be observed during testing.
	    observeBashExecutions: _react.PropTypes.bool
	};

	Terminal.defaultProps = {
	    extensions: {},
	    history: [],
	    onClose: noop,
	    onExpand: noop,
	    onMinimize: noop,
	    prefix: 'hacker@default',
	    structure: {},
	    theme: Terminal.Themes.LIGHT,
	    observeBashExecutions: false
	};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parseInput = parseInput;
	exports.parse = parse;
	/*
	 * This method parses a single command + args. It handles
	 * the tokenization and processing of flags, anonymous args,
	 * and named args.
	 *
	 * @param {string} input - the user input to parse
	 * @returns {Object} the parsed command/arg dataf84t56y78ju7y6f
	 */
	function parseInput(input) {
	    var tokens = input.split(/ +/);
	    var name = tokens.shift();
	    var flags = {};
	    var args = {};
	    var anonArgPos = 0;

	    while (tokens.length > 0) {
	        var token = tokens.shift();
	        if (token[0] === '-') {
	            if (token[1] === '-') {
	                var next = tokens.shift();
	                args[token.slice(2)] = next;
	            } else {
	                token.slice(1).split('').forEach(function (flag) {
	                    flags[flag] = true;
	                });
	            }
	        } else {
	            args[anonArgPos++] = token;
	        }
	    }
	    return { name: name, flags: flags, input: input, args: args };
	}

	/*
	 * This function splits the input by `&&`` creating a
	 * dependency chain. The chain consists of a list of
	 * other commands to be run.
	 *
	 * @param {string} input - the user input
	 * @returns {Array} a list of lists of command/arg pairs
	 *
	 * Example: `cd dir1; cat file.txt && pwd`
	 * In this example `pwd` should only be run if dir/file.txt
	 * is a readable file. The corresponding response would look
	 * like this, where the outer list is the dependent lists..
	 *
	 * [
	 *   [
	 *     { command: 'cd', args: { 0: 'dir1'} },
	 *     { command: 'cat', args: { 0: 'file.txt'} }
	 *   ],
	 *   [
	 *     { command: 'pwd' }
	 *   ]
	 * ]
	 */
	function parse(inputs) {
	    return inputs.trim().split(/ *&& */).map(function (deps) {
	        return deps.split(/ *; */).map(parseInput);
	    });
	}

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var BaseStyles = {};

	BaseStyles.ReactBash = {
	    borderRadius: '5px',
	    display: 'flex',
	    flexDirection: 'column',
	    fontFamily: '\'Inconsolata\', monospace',
	    fontSize: '13px',
	    fontWeight: '400',
	    height: '100%',
	    overflow: 'hidden',
	    textAlign: 'left'
	};

	BaseStyles.header = {
	    padding: '5px 10px 0'
	};

	var circle = {
	    borderRadius: '50%',
	    display: 'inline-block',
	    height: '15px',
	    marginRight: '5px',
	    width: '15px'
	};

	BaseStyles.redCircle = Object.assign({}, circle, {
	    backgroundColor: '#bf616a'
	});

	BaseStyles.yellowCircle = Object.assign({}, circle, {
	    backgroundColor: '#ebcb8b'
	});

	BaseStyles.greenCircle = Object.assign({}, circle, {
	    backgroundColor: '#a3be8c'
	});

	BaseStyles.body = {
	    flexGrow: 1,
	    overflowY: 'scroll',
	    padding: '10px'
	};

	BaseStyles.form = {
	    display: 'flex'
	};

	BaseStyles.input = {
	    background: 'none',
	    border: 'none',
	    color: 'inherit',
	    flexGrow: '1',
	    fontFamily: 'inherit',
	    fontSize: 'inherit',
	    outline: 'none !important',
	    padding: 0
	};

	BaseStyles.prefix = {
	    marginRight: '5px'
	};

	exports.default = {
	    light: Object.assign({}, BaseStyles, {
	        body: Object.assign({}, BaseStyles.body, {
	            backgroundColor: '#fff',
	            color: '#5D5D5D'
	        }),
	        header: Object.assign({}, BaseStyles.header, {
	            backgroundColor: '#eee'
	        }),
	        prefix: Object.assign({}, BaseStyles.prefix, {
	            color: '#bd081c'
	        })
	    }),
	    dark: Object.assign({}, BaseStyles, {
	        body: Object.assign({}, BaseStyles.body, {
	            backgroundColor: '#000',
	            color: '#d0d0d0'
	        }),
	        header: Object.assign({}, BaseStyles.header, {
	            backgroundColor: '#dcdbdb'
	        }),
	        prefix: Object.assign({}, BaseStyles.prefix, {
	            color: '#5b65fb'
	        })
	    })
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ })
/******/ ])
});
;