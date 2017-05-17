
import React from 'react';

export default function SidebarSchema() {
	return (<noscript />);
}

SidebarSchema.setConfig = ({ children }, sidebar) => {
	sidebar.push(...children);
};
SidebarSchema.schemaName = 'sidebar';
SidebarSchema.DataType = Array;
