'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _commands = require('./commands');

var BaseCommands = _interopRequireWildcard(_commands);

var _bash = require('./bash');

var _bash2 = _interopRequireDefault(_bash);

var _styles = require('./styles');

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