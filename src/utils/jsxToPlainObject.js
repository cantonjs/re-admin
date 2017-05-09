
export default function jsxToPlainObject(Schema) {
	const schemaElement = new Schema();
	console.log('schemaElement', schemaElement);
	return schemaElement.props.children.map(({ props, type }) => ({
		...props,
		component: type,
	}));
};
