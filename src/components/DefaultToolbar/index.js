
import React from 'react';
import Toolbar from 'components/Toolbar';
import RemoveButton from 'components/RemoveButton';
import UpdateButton from 'components/UpdateButton';
import CreateButton from 'components/CreateButton';
import TableQuerySwitch from 'components/TableQuerySwitch';
import { Button } from 'antd';

const { Group } = Button;

export default function DefaultToolbar() {
	return (
		<Toolbar
			left={
				<Group>
					<CreateButton />
					<UpdateButton />
					<RemoveButton />
				</Group>
			}
			right={
				<TableQuerySwitch />
			}
		/>
	);
}
