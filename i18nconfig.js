module.exports = {
	pattern: '%lang.js',
	lang: [
		{ input: 'ar', output: 'ar_EG' },
		{ input: 'bg', output: 'bg_BG' },
		{ input: 'ca', output: 'ca_ES' },
		{ input: 'cs', output: 'cs_CZ' },
		{ input: 'de', output: 'de_DE' },
		{ input: 'cs', output: 'el_GR' },
		{ input: 'el', output: 'el_GR' },
		{ input: 'en', output: ['en_GB', 'en_US'] },
		{ input: 'es', output: 'es_ES' },
		{ input: 'et', output: 'et_EE' },
		{ input: 'fa', output: 'fa_IR' },
		{ input: 'fi', output: 'fi_FI' },
		{ input: 'fr', output: ['fr_BE', 'fr_FR'] },
		{ input: 'it', output: 'it_IT' },
		{ input: 'is', output: 'is_IS' },
		{ input: 'ja', output: 'ja_JP' },
		{ input: 'ko', output: 'ko_KR' },
		{ input: 'no', output: 'nb_NO' },
		{ input: 'nl', output: ['nl_BE', 'nl_NL'] },
		{ input: 'pl', output: 'pl_PL' },
		{ input: 'pt', output: 'pt_BR' },
		{ input: 'sk', output: 'sk_SK' },
		{ input: 'sr', output: 'sr_RS' },
		{ input: 'sl', output: 'sl_SI' },
		{ input: 'sv', output: 'sv_SE' },
		{ input: 'th', output: 'th_TH' },
		{ input: 'tr', output: 'tr_TR' },
		{ input: 'ru', output: 'ru_RU' },
		{ input: 'uk', output: 'uk_UA' },
		{ input: 'vi', output: 'vi_VN' },
		{ input: 'zh-cn', output: 'zh_CN' },
		{ input: 'zh-tw', output: 'zh_TW' },
	],
	transformOutput(output, { langOutput }) {
		const outputStr = JSON.stringify(output);
		return `/* eslint-disable */
import antd from 'antd/lib/locale-provider/${langOutput}';
const locale = ${outputStr};
export default { language: ${langOutput}, ...locale, antd };
`;
	},
};
