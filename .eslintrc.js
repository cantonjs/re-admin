
const path = require('path');

module.exports = {
	'parser': 'babel-eslint',
	'extends': [
		'prettier',
		'standard',
		'plugin:react/recommended',
		'plugin:promise/recommended',
		'plugin:import/recommended',
	],
	'plugins': [
		'react',
	],
	'env': {
		'browser': true,
		'node': true,
		'es6': true,
		'mocha': true,
		'jest': true,
	},
	'rules': {
		'import/no-absolute-path': 2,
		'import/no-extraneous-dependencies': 2,
		'import/no-mutable-exports': 2,
		'import/newline-after-import': 1,
		'import/unambiguous': 0,

		'promise/avoid-new': 0,
		'promise/no-callback-in-promise': 0,
		'promise/always-return': 0,

		'semi': [1, 'always'],
		'no-tabs': 0,
		'comma-dangle': [1, 'always-multiline'],
		'indent': [2, 'tab', {
			'SwitchCase': 1
		}],
		'padded-blocks': 0,
		'quotes': [1, 'single'],
		'space-before-function-paren': [1, {
			'anonymous': 'always',
			'named': 'never',
		}],
		'max-len': [1, {
			'code': 80,
			'tabWidth': 2,
			'ignoreComments': true,
			'ignoreStrings': true,
			'ignoreUrls': true,
			'ignoreRegExpLiterals': true,
		}],
		'brace-style': 0,
		'operator-linebreak': [1, 'after'],
		'camelcase': 0,
		'no-multiple-empty-lines': [1, {
			'max': 2,
		}],
		'no-unused-vars': [1, {
			'vars': 'all',
			'args': 'after-used',
			'caughtErrors': 'none',
			'ignoreRestSiblings': true,
		}],
		'spaced-comment': 0,
		'arrow-parens': [1, 'always'],
	},
	'globals': {
		'__DEV__': true,
		'__LIB_NAME__': true,
	},
	'settings': {
		'import/resolver': {
			'webpack': {
				'config': path.join(__dirname, 'webpack.config.babel.js'),
			}
		}
	}
};
