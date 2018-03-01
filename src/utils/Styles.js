export function extendable(style) {
	return (styleProps) => ({
		...style,
		...styleProps,
	});
}

export const flexCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};
