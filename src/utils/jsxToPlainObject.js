
export default function jsxToPlainObject(createSchema) {
	const schemaElement = createSchema();
	// console.log('schemaElement', schemaElement);
	return schemaElement.props.children.map(({ props, type }) => ({
		...props,
		component: type,
	}));
};
