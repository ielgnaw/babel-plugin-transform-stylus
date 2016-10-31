/**
 * @file index 的测试用例
 * @author ielgnaw(wuji0223@gmail.com)
 */

import chai from 'chai';
import path from 'path';
import {transformFileSync} from 'babel-core';

'use strict';

const expect = chai.expect;

describe('Transform Stylus', function () {

    const transform = (filename, config = {}) =>
        transformFileSync(path.resolve(__dirname, filename), {
            babelrc: false,
            presets: ['es2015'],
            plugins: [
                ['../../../src/index.js', config],
            ]
        }
    );

    it('replace import export statements', () => {
        expect(transform('../fixture/import-export-stylus.js', {
            extensions: ['stylus', 'styl']
        }).code).to.be.equal(
            [
                '\'use strict\';',
                '',
                'Object.defineProperty(exports, "__esModule", {',
                '  value: true',
                '});',
                'exports.styles = undefined;',
                '',
                'var _test = require(\'react-native\').StyleSheet.create({',
                '  "container": {',
                '    "color": "#4e515e",',
                '    "flex": 1,',
                '    "justifyContent": "center",',
                '    "alignItems": "center",',
                '    "backgroundColor": "#f5fcff",',
                '    "margin": 0,',
                '    "marginTop": 10,',
                '    "marginRight": 5,',
                '    "marginBottom": 10,',
                '    "marginLeft": 5,',
                '    "borderBottomWidth": require(\'react-native\').StyleSheet.hairlineWidth,',
                '    "shadowOpacity": 4,',
                '    "shadowOffset": {',
                '      "width": 2,',
                '      "height": 4',
                '    },',
                '    "elevation": 1,',
                '    "padding": 0,',
                '    "paddingTop": 1,',
                '    "paddingRight": 2,',
                '    "paddingBottom": 3,',
                '    "paddingLeft": 4,',
                '    "width": 30',
                '  },',
                '  "container_x": {',
                '    "padding": 0,',
                '    "paddingTop": 3,',
                '    "paddingRight": 3,',
                '    "paddingBottom": 4,',
                '    "paddingLeft": 3',
                '  },',
                '  "container_y": {',
                '    "padding": 1',
                '  },',
                '  "container_foo": {',
                '    "flex": 1,',
                '    "position": "relative"',
                '  },',
                '  "container_foo:after": {',
                '    "content": "\'\'",',
                '    "position": "absolute",',
                '    "top": 0,',
                '    "left": 0,',
                '    "borderWidth": 1,',
                '    "borderStyle": "solid",',
                '    "borderColor": "#4e515e",',
                '    "boxSizing": "border-box",',
                '    "size": "200%",',
                '    "zIndex": "-1",',
                '    "transform": "scale(0.5)",',
                '    "transformOrigin": "left top",',
                '    "borderRadius": 6',
                '  },',
                '  "container_foo:after_bar": {',
                '    "height": 30',
                '  }',
                '});',
                '',
                'var _test2 = _interopRequireDefault(_test);',
                '',
                'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }',
                '',
                'exports.styles = _test2.default;'
            ].join('\n')
        );
    });

    it('replace import statements', () => {
        expect(transform('../fixture/import-stylus.js', {
            extensions: ['stylus', 'styl']
        }).code).to.be.equal(
            [
                '\'use strict\';',
                '',
                'var _test = require(\'react-native\').StyleSheet.create({',
                '  "container": {',
                '    "color": "#4e515e",',
                '    "flex": 1,',
                '    "justifyContent": "center",',
                '    "alignItems": "center",',
                '    "backgroundColor": "#f5fcff",',
                '    "margin": 0,',
                '    "marginTop": 10,',
                '    "marginRight": 5,',
                '    "marginBottom": 10,',
                '    "marginLeft": 5,',
                '    "borderBottomWidth": require(\'react-native\').StyleSheet.hairlineWidth,',
                '    "shadowOpacity": 4,',
                '    "shadowOffset": {',
                '      "width": 2,',
                '      "height": 4',
                '    },',
                '    "elevation": 1,',
                '    "padding": 0,',
                '    "paddingTop": 1,',
                '    "paddingRight": 2,',
                '    "paddingBottom": 3,',
                '    "paddingLeft": 4,',
                '    "width": 30',
                '  },',
                '  "container_x": {',
                '    "padding": 0,',
                '    "paddingTop": 3,',
                '    "paddingRight": 3,',
                '    "paddingBottom": 4,',
                '    "paddingLeft": 3',
                '  },',
                '  "container_y": {',
                '    "padding": 1',
                '  },',
                '  "container_foo": {',
                '    "flex": 1,',
                '    "position": "relative"',
                '  },',
                '  "container_foo:after": {',
                '    "content": "\'\'",',
                '    "position": "absolute",',
                '    "top": 0,',
                '    "left": 0,',
                '    "borderWidth": 1,',
                '    "borderStyle": "solid",',
                '    "borderColor": "#4e515e",',
                '    "boxSizing": "border-box",',
                '    "size": "200%",',
                '    "zIndex": "-1",',
                '    "transform": "scale(0.5)",',
                '    "transformOrigin": "left top",',
                '    "borderRadius": 6',
                '  },',
                '  "container_foo:after_bar": {',
                '    "height": 30',
                '  }',
                '});',
                '',
                'var _test2 = _interopRequireDefault(_test);',
                '',
                'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }'
            ].join('\n')
        );
    });

    it('replace require statements', () => {
        expect(transform('../fixture/require-stylus.js', {
            extensions: ['stylus', 'styl'],
        }).code).to.be.equal(
            [
                '\'use strict\';',
                '',
                'var styles = require(\'react-native\').StyleSheet.create({',
                '  "container": {',
                '    "color": "#4e515e",',
                '    "flex": 1,',
                '    "justifyContent": "center",',
                '    "alignItems": "center",',
                '    "backgroundColor": "#f5fcff",',
                '    "margin": 0,',
                '    "marginTop": 10,',
                '    "marginRight": 5,',
                '    "marginBottom": 10,',
                '    "marginLeft": 5,',
                '    "borderBottomWidth": require(\'react-native\').StyleSheet.hairlineWidth,',
                '    "shadowOpacity": 4,',
                '    "shadowOffset": {',
                '      "width": 2,',
                '      "height": 4',
                '    },',
                '    "elevation": 1,',
                '    "padding": 0,',
                '    "paddingTop": 1,',
                '    "paddingRight": 2,',
                '    "paddingBottom": 3,',
                '    "paddingLeft": 4,',
                '    "width": 30',
                '  },',
                '  "container_x": {',
                '    "padding": 0,',
                '    "paddingTop": 3,',
                '    "paddingRight": 3,',
                '    "paddingBottom": 4,',
                '    "paddingLeft": 3',
                '  },',
                '  "container_y": {',
                '    "padding": 1',
                '  },',
                '  "container_foo": {',
                '    "flex": 1,',
                '    "position": "relative"',
                '  },',
                '  "container_foo:after": {',
                '    "content": "\'\'",',
                '    "position": "absolute",',
                '    "top": 0,',
                '    "left": 0,',
                '    "borderWidth": 1,',
                '    "borderStyle": "solid",',
                '    "borderColor": "#4e515e",',
                '    "boxSizing": "border-box",',
                '    "size": "200%",',
                '    "zIndex": "-1",',
                '    "transform": "scale(0.5)",',
                '    "transformOrigin": "left top",',
                '    "borderRadius": 6',
                '  },',
                '  "container_foo:after_bar": {',
                '    "height": 30',
                '  }',
                '});'
            ].join('\n')
        );
    });

    it('not replace because no extensions config', () => {
        expect(transform('../fixture/require-stylus.js', {
        }).code).to.be.equal(
            [
                '\'use strict\';',
                '',
                'var styles = require(\'./test.styl\');'
            ].join('\n')
        );
    });

    it('throw error when import/require statements are empty', () => {
        expect(() => transform('../fixture/empty-require.js', {
            extensions: ['stylus', 'styl']
        })).to.throw(/^.+: Found empty import from .+\.$/);

        expect(() => transform('../fixture/empty-import.js', {
            extensions: ['stylus', 'styl']
        })).to.throw(/^.+: Found empty import from .+\.$/);
    });

    it('throw error when value is string', () => {
        expect(() => transform('../fixture/error-value.js', {
            extensions: ['stylus', 'styl']
        })).to.throw(/^.+: Unexpected string value \'.+\' for .+\.$/);
    });

    // it('returns the name', () => {
    //     expect(person.name).to.equal('yato');
    // });

    // it('name can be changed', () => {
    //     person.name = 'yato1';
    //     expect(person.name).to.equal('yato1');
    // });

    // it('set error name', () => {
    //     try {
    //         person.name = {};
    //     }
    //     catch (e) {
    //         expect(e.toString()).to.equal('Error: "name" must be a string.');
    //     }
    // });

    // describe('#age', () => {
    //     it('returns the age', () => {
    //         expect(person.age).to.equal(11);
    //     });

    //     it('age can be changed', () => {
    //         person.age = 33;
    //         expect(person.age).to.equal(33);
    //     });

    //     it('set error age', () => {
    //         try {
    //             person.age = 'aa';
    //         }
    //         catch (e) {
    //             expect(e.toString()).to.equal('Error: "age" must be a number.');
    //         }
    //     });
    // });

    // describe('#promise', () => {
    //     it('returns the right result', () => {
    //         return person.promiseVal(5).then(ret => {
    //             expect(ret).to.equal(6);
    //         });
    //     });
    // });
});
