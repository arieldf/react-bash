import chai from 'chai';
import sinon from 'sinon';
import { stateFactory } from './factories';
import Bash from '../src/bash';
import { Errors } from '../src/const';

describe('bash class', () => {

    describe('with extensions', () => {

        it('should add extensions to commands', () => {
            const bash = new Bash();
            chai.assert.isDefined(bash.prevCommands);
            chai.assert.strictEqual(bash.prevCommands.length, 0);
            chai.assert.isDefined(bash.prevCommandsIndex);
            chai.assert.strictEqual(bash.prevCommandsIndex, 0);
        });

        it('should add extensions to commands', () => {
            const noop = () => {};
            const bash = new Bash({ test: noop });
            chai.assert.isFunction(bash.commands.test);
            chai.assert.strictEqual(bash.commands.test, noop);
        });

    });

});

describe('bash class methods', () => {
    const mockState = stateFactory();
    let bash;

    beforeEach(() => {
        bash = new Bash();
    });

    describe('pushInput', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.pushInput);
        });

        it('should append command to prevCommands', () => {
            bash.pushInput('test', mockState);
            chai.assert.strictEqual(bash.prevCommands.length, 1);
            chai.assert.strictEqual(bash.prevCommands[0], 'test');
        });

        it('should increase prevCommandsIndex', () => {
            bash.pushInput('test', mockState);
            chai.assert.strictEqual(bash.prevCommandsIndex, 1);
        });

        it('should add input to history', () => {
            const { history } = bash.pushInput('ls', mockState);
            chai.assert.strictEqual(history.length, 1);
            chai.assert.strictEqual(history[0].value, 'ls');
            chai.assert.strictEqual(history[0].cwd, '');
        });

        it('should add a blank line on empty input', () => {
            const { history } = bash.pushInput('', mockState);
            chai.assert.strictEqual(history.length, 1);
            chai.assert.strictEqual(history[0].value, '');
        });

    });

    describe('execute', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.execute);
        });

        it('should handle fulfilled promises', () => {
            bash = new Bash({
                test: { exec: () => Promise.resolve('foo') },
            });

            const testCase = bash.execute('test', {});
            return testCase.then((newState) => {
                chai.assert.strictEqual(newState, 'foo');
            });
        });

        it('should handle rejected promises', () => {
            bash = new Bash({
                test: { exec: () => Promise.reject(new Error('foo')) },
            });

            const testCase = bash.execute('test', mockState);
            return testCase.then((newState) => {
                const { history } = newState;
                chai.assert.strictEqual(history.length, 1);
                chai.assert.strictEqual(history[0].value, 'foo');
            });
        });

        it('should handle generator commands', () => {
            bash = new Bash({
                test: {
                    exec: () => {
                        return (function* () { for (const i of [1, 2, 3]) { yield i; } }());
                    },
                },
            });

            const testCase = bash.execute('test', {});
            return testCase.then((newState) => {
                chai.assert.strictEqual(newState, 3);
            });
        });

        // Full command testing is in tests/command.js
        const commands = [
            { command: 'help' },
            { command: 'clear' },
            { command: 'ls', args: 'dir1' },
            { command: 'cat', args: 'file1' },
            { command: 'mkdir', args: 'testDir' },
            { command: 'cd', args: 'dir1' },
            { command: 'sleep', args: 0.1 },
        ];

        commands.forEach(data => {
            it(`should handle the ${data.command} command`, () => {
                const stub = sinon.stub(bash.commands[data.command], 'exec');
                const testCase = bash.execute(`${data.command} ${data.args}`, mockState);
                return testCase.then(
                    () => {
                        chai.assert.strictEqual(stub.called, true);
                        stub.restore();
                    },
                    (error) => {
                        chai.assert.fail(error);
                        stub.restore();
                    });
            });
        });

        it('should handle unknown commands', () => {
            const expected = Errors.COMMAND_NOT_FOUND.replace('$1', 'commandDoesNotExist');
            const testCase = bash.execute('commandDoesNotExist', mockState);
            return testCase.then((newState) => {
                const { history } = newState;
                chai.assert.strictEqual(history.length, 1);
                chai.assert.strictEqual(history[0].value, expected);
            });
        });

        it('should only print the unknown command in error', () => {
            const expected = Errors.COMMAND_NOT_FOUND.replace('$1', 'commandDoesNotExist');
            const testCase = bash.execute('commandDoesNotExist -la test/file.txt', mockState);
            return testCase.then((newState) => {
                const { history } = newState;
                chai.assert.strictEqual(history[0].value, expected);
            });
        });

        it('should handle multiple commands with ;', () => {
            const testCase = bash.execute('cd dir1; pwd', mockState);
            return testCase.then((newState) => {
                const { history } = newState;
                chai.assert.strictEqual(history.length, 1);
                chai.assert.strictEqual(history[0].value, '/dir1');
            });
        });

        it('should handle multiple commands with successful &&', () => {
            const testCase = bash.execute('cd dir1 && pwd', mockState);
            return testCase.then((newState) => {
                const { history } = newState;
                chai.assert.strictEqual(history.length, 1);
                chai.assert.strictEqual(history[0].value, '/dir1');
            });
        });

        it('should handle multiple commands with unsuccessful &&', () => {
            const input = 'cd doesNotExist && pwd';
            const expected1 = Errors.NO_SUCH_FILE.replace('$1', 'doesNotExist');
            const testCase = bash.execute(input, mockState);
            return testCase.then((newState) => {
                const { history } = newState;
                chai.assert.strictEqual(history.length, 1);
                chai.assert.strictEqual(history[0].value, expected1);
            });
        });

        describe('with a progress observer', () => {

            it('should call the observer for each command separated by ;', () => {
                let i = 0;
                const testCase = bash.execute('cd dir1; pwd', mockState, () => { ++i; });
                return testCase.then(() => {
                    chai.assert.strictEqual(i, 2);
                });
            });

            it('should call the progress observer for each command separated by &&', () => {
                let i = 0;
                const testCase = bash.execute('cd dir1 && pwd', mockState, () => { ++i; });
                return testCase.then(() => {
                    chai.assert.strictEqual(i, 2);
                });
            });

            it('should call the observer for generator commands', () => {
                bash = new Bash({
                    test: {
                        exec: () => {
                            return (function* () { for (const i of [1, 2, 3]) { yield i; } }());
                        },
                    },
                });

                let i = 1;
                return bash.execute('test', {}, (newState) => {
                    chai.assert.strictEqual(newState, i++);
                });
            });

        });

    });

    describe('getPrevCommand', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.getPrevCommand);
        });

        it('should return previous command', () => {
            bash.prevCommandsIndex = 2;
            bash.prevCommands = [0, 1, 2];
            chai.assert.strictEqual(bash.getPrevCommand(), 1);
        });

    });

    describe('getNextCommand', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.getNextCommand);
        });

        it('should return next command', () => {
            bash.prevCommandsIndex = 1;
            bash.prevCommands = [0, 1, 2];
            chai.assert.strictEqual(bash.getNextCommand(), 2);
        });

    });

    describe('hasPrevCommand', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.hasPrevCommand);
        });

        it('should return false if index is 0', () => {
            bash.prevCommandsIndex = 0;
            chai.assert.strictEqual(bash.hasPrevCommand(), false);
        });

        it('should return true if index is not 0', () => {
            bash.prevCommandsIndex = 1;
            chai.assert.strictEqual(bash.hasPrevCommand(), true);
        });

    });

    describe('hasNextCommand', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.hasNextCommand);
        });

        it('should return false if at last index', () => {
            bash.prevCommands = [];
            bash.prevCommandsIndex = 0;
            chai.assert.strictEqual(bash.hasNextCommand(), true);
        });

        it('should return true if not at last index', () => {
            bash.prevCommands = [null, null];
            bash.prevCommandsIndex = 0;
            chai.assert.strictEqual(bash.hasNextCommand(), true);
        });

    });

    describe('autocomplete', () => {

        it('should exist', () => {
            chai.assert.isFunction(bash.autocomplete);
        });

        it('should autocomplete a command', () => {
            const expected = 'help';
            const actual = bash.autocomplete('he', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should not autocomplete a path if input has only one token', () => {
            const expected = null;
            const actual = bash.autocomplete('dir', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should not autocomplete a command if input has more than one token', () => {
            const expected = null;
            const actual = bash.autocomplete('ls he', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should autocomplete a directory name', () => {
            const expected = 'ls dir1';
            const actual = bash.autocomplete('ls di', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should autocomplete a file name', () => {
            const expected = 'ls file1';
            const actual = bash.autocomplete('ls fil', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should autocomplete a path', () => {
            const expected = 'ls dir1/childDir';
            const actual = bash.autocomplete('ls dir1/chi', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should not autocomplete commands on paths', () => {
            const expected = null;
            const actual = bash.autocomplete('ls dir1/clea', mockState);
            chai.assert.strictEqual(expected, actual);
        });

        it('should autocomplete a path with .. in it', () => {
            const expected = 'ls ../../dir1';
            const state = Object.assign({}, mockState, { cwd: 'dir1/childDir' });
            const actual = bash.autocomplete('ls ../../dir', state);
            chai.assert.strictEqual(expected, actual);
        });

    });

});
