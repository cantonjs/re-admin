import React from 'react';
import {
	Table,
	Text,
	Select,
	Option,
	Image,
	Slider,
	Uploader,
	Checkbox,
	RangePicker,
	DatePicker,
	Ref,
	ArrayOf,
	ObjectOf,
	Actions,
	CreateButton,
	RemoveButton,
	UpdateButton,
	RefButton,
	Toolbar,
} from '../../src';

export default (
	<Table name="test">
		<Text name="id" label="ID" placeholder="ID" disabled unique inQuery />

		<Text
			name="name"
			label="Username"
			placeholder="username"
			maxLength={10}
			required
			inQuery
			inTable
			inForm
		/>

		<Ref
			name="ref"
			table="bar"
			placeholder="reference"
			label="Reference"
			noQuery
			save="customMethod"
			inForm
			inQuery
		/>

		<Ref
			name="refImage"
			table="bar"
			placeholder="Ref Image"
			label="Reference Image"
			save="getAvatar"
			noQuery
			toolbar={<Toolbar left={<CreateButton />} />}
			render={(src) => (
				<img
					src={src || Image.BLANK_IMAGE}
					style={{ width: 104, height: 104, border: '1px solid #f4f4f4' }}
				/>
			)}
			inForm
		/>

		<DatePicker
			name="createdAt"
			format="date"
			label="Date Created"
			disabled
			inQuery={(props) => <RangePicker {...props} />}
			inTable
			inForm
		/>

		<Image name="avatar" label="Avatar" inTable inForm />

		<Text
			name="desc"
			label="Description"
			placeholder="description"
			inTable
			inForm
		/>

		<ObjectOf name="pet" label="Pets" inForm>
			<Text name="name" label="Pet Name" placeholder="pet name" />
			<Text name="type" label="Pet Kind" placeholder="pet kind" />
			<ArrayOf name="languages" label="Language">
				<ObjectOf>
					<Text name="name" label="Language Name" placeholder="language name" />
					<Text
						name="score"
						label="Language Score"
						placeholder="language score"
					/>
				</ObjectOf>
			</ArrayOf>
		</ObjectOf>

		<ArrayOf name="tags" label="Tags" inTable inForm>
			<Text placeholder="tags" />
		</ArrayOf>

		<Text
			name="fee"
			label="Fee"
			required
			inputFilter={(value) =>
				/^\$/.test(value) ? value : '$' + (value / 100).toFixed(2)
			}
			outputFilter={(value) => value.slice(1) * 100}
			inTable
			inForm
		/>

		<Text
			name="num"
			label="Number"
			format="integer"
			value={32}
			sortable
			inTable
			inForm
		/>

		<Uploader name="file" label="File" inForm />

		<Select name="fav" label="Favs" inForm value="2">
			<Option value="1">Eating</Option>
			<Option value="2">Sleeping</Option>
		</Select>

		<Slider
			name="gpa"
			label="GPA"
			format="integer"
			inForm={(props, { Component, record }) =>
				record.fav > 1 ? <Component {...props} /> : null
			}
		/>
		<Text name="birthday" label="Birthday" format="date" inForm />

		<Checkbox
			name="check"
			label="Checked"
			value
			inQuery={(props, { record, Component }) =>
				record.name === 'checkbox' ? <Component {...props} /> : null
			}
			inTable
			inForm
		/>

		<Actions>
			<CreateButton table="bar" label="Create Bar" />
			<RemoveButton />
			<UpdateButton names={['name', 'avatar']} />
			<RefButton table="bar" noQuery save="customMethod" toolbar />
		</Actions>
	</Table>
);
