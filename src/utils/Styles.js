export function extendable(style) {
	return (...styles) => Object.assign({}, style, ...styles);
}

export const flexCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};
