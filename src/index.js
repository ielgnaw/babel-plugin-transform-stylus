/**
 * @file babel-plugin-transform-stylus
 * @author ielgnaw(wuji0223@gmail.com)
 */

import {dirname, isAbsolute, resolve} from 'path';
import {readFileSync} from 'fs';
import parser from 'css-parse';
import camelize from 'to-camel-case';
import stylus from 'stylus';

/**
 * 样式常量
 *
 * @type {Object}
 */
const styleSheetConstants = {
    'hairline-width': 'require(\'react-native\').StyleSheet.hairlineWidth'
};

/**
 * 将 - 分割的属性名转换为 camelize 的属性名
 *
 * @param {string} property 要转换的属性名
 * @param {string} value 要转换的属性名对应的属性值
 *
 * @return {Object} 转换好后的属性键值对象
 */
const normalizeValue = (property, value) => {
    const normalizeProps = [
        'flex',
        'width',
        'height',
        'top',
        'right',
        'bottom',
        'left',
        'font-size',
        'line-height',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'padding-vertical',
        'padding-horizontal',
        'border-top-width',
        'border-right-width',
        'border-bottom-width',
        'border-left-width',
        'border-radius',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-left-radius',
        'border-bottom-right-radius',
        'border-width',
        'shadow-opacity',
        'shadow-radius',
        'elevation'
    ];

    if (normalizeProps.indexOf(property) > -1) {
        const camelizedPropName = camelize(property);

        if (styleSheetConstants[value]) {
            return {
                [camelizedPropName]: value
            };
        }

        const v = Number(value);

        if (isNaN(v)) {
            throw new Error(`Unexpected string value ${value} for ${property}.`);
        }

        return {
            [camelizedPropName]: v
        };
    }

    return {};
};

/**
 * 展开属性
 *
 * @param {string} property 需要展开的属性名称
 * @param {string} value 需要展开的属性值
 *
 * @return {Object} 展开后的属性键值对象
 */
const expandProperty = (property, value) => {
    const expandProps = ['margin', 'padding', 'shadow-offset'];

    if (expandProps.indexOf(property) > -1) {
        const shorthandValues = value.split(' ').map(n => parseInt(n, 10));
        const [v1, v2, v3, v4] = shorthandValues;
        const len = shorthandValues.length;

        if (property === 'shadow-offset') {
            return {
                shadowOffset: {
                    width: v1,
                    height: v2
                }
            };
        }

        if (len === 1) {
            return {
                [`${property}`]: v1
            };
        }

        const shorthand = {
            [`${property}`]: 0,
            [`${property}Top`]: v1,
            [`${property}Right`]: v2
        };

        if (len === 2) {
            return {
                ...shorthand,
                [`${property}Bottom`]: v1,
                [`${property}Left`]: v2
            };
        }

        if (len === 3) {
            return {
                ...shorthand,
                [`${property}Bottom`]: v3,
                [`${property}Left`]: v2
            };
        }

        if (len === 4) {
            return {
                ...shorthand,
                [`${property}Bottom`]: v3,
                [`${property}Left`]: v4
            };
        }
    }

    return {};
};

/**
 * 编译 stylus
 *
 * @param {string} styleData stylus 内容
 * @param {string} from 当前 stylus 文件的文件夹路径
 * @param {string} filePath 当前 stylus 文件相对路径
 *
 * @return {string} css 内容
 */
const compileStylus = (styleData, from, filePath) =>
    stylus(styleData)
        .include(dirname(resolve(from, filePath)))
        .include(dirname(filePath))
        .include('.')
        .render();

/**
 * 生成 RN 支持的样式
 *
 * @param {string} styleData css 样式内容
 *
 * @return {string} RN 支持的样式内容
 */
const toStyleSheet = styleData => {
    const {stylesheet: {rules}} = parser(styleData);
    const result = {};

    for (const {type: ruleType, selectors, declarations} of rules) {
        if (ruleType !== 'rule') {
            continue;
        }

        for (const selector of selectors) {
            // const s = selector.replace(/\.|#/g, '');
            let s = selector.replace(/\.|#/g, '');
            s = s.replace(/\s/g, '_');
            result[s] = result[s] || {};

            for (const {type: declarationType, value, property} of declarations) {
                if (declarationType !== 'declaration') {
                    continue;
                }

                const propertyName = ['-ios-', '-android-'].reduce((m, v) => m.replace(v, ''), property);
                const camelizedPropName = camelize(propertyName);

                if (value) {
                    result[s] = {
                        ...result[s],
                        ...{
                            [camelizedPropName]: value
                        },
                        ...normalizeValue(propertyName, value),
                        ...expandProperty(propertyName, value)
                    };
                }
            }
        }
    }

    let output = JSON.stringify(result);

    for (const key of Object.keys(styleSheetConstants)) {
        output = output.replace(`"${key}"`, styleSheetConstants[key]);
    }

    return output;
};

/**
 * 获取当前 stylus 文件的目录
 *
* @param {string} filename stylus 文件路径
 *
 * @return {string} stylus 文件的目录路径
 */
const resolveModulePath = filename => {
    const dir = dirname(filename);
    if (isAbsolute(dir)) {
        return dir;
    }
    if (process.env.PWD) {
        return resolve(process.env.PWD, dir);
    }
    return resolve(dir);
};

export default ({types: t}) => {
    return {
        visitor: {
            CallExpression(path, {file, opts}) {
                const currentConfig = {...opts};

                currentConfig.extensions = currentConfig.extensions || [];

                const {callee: {name: calleeName}, arguments: args} = path.node;

                if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
                    return;
                }

                if (currentConfig.extensions.find(ext => args[0].value.endsWith(ext))) {
                    const [{value: filePath}] = args;

                    if (!t.isVariableDeclarator(path.parent)) {
                        throw new Error(`Found empty import from ${filePath}.`);
                    }

                    const from = resolveModulePath(file.opts.filename);
                    const data = readFileSync(resolve(from, filePath), 'utf8');
                    const cssData = compileStylus(data, from, filePath);
                    const p = toStyleSheet(cssData);
                    path.replaceWithSourceString(`require('react-native').StyleSheet.create(${p})`);
                }
            }
        }
    };
};
