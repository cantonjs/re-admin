
import React from 'react';
import Toolbar from 'components/Toolbar';
import ToolbarRemoveButton from 'components/ToolbarRemoveButton';
import ToolbarUpdateButton from 'components/ToolbarUpdateButton';
import ToolbarCreateButton from 'components/ToolbarCreateButton';
import ToolbarQuerySwitch from 'components/ToolbarQuerySwitch';
import { Button } from 'antd';

const { Group } = Button;

export default function DefaultToolbar() {
	return (
		<Toolbar
			left={
				<Group>
					<ToolbarCreateButton />
					<ToolbarUpdateButton />
					<ToolbarRemoveButton />
				</Group>
			}
			right={
				<ToolbarQuerySwitch />
			}
		/>
	);
}
