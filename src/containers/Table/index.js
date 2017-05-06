
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getStore from 'utils/getStore';

@observer
export default class Table extends Component {
	static propTypes = {
		route: PropTypes.shape({
			table: PropTypes.string.isRequired,
		}),
	};

	state = {
		stores: getStore(this.props.route.table),
	};

	componentWillMount() {
		console.log('table:', this.props.route.table);
	}

	componentWillReceiveProps({ route: { table } }) {
		if (this.props.route.table !== table) {
			console.log('table:', table);
			this.setState({ store: getStore(table) });
		}
	}

	componentDidMount() {
		this.state.stores.fetch();
	}

	render() {
		const { stores } = this.state;
		return (
			<div>
				<h1>Table</h1>
				{stores.collection.map(({ id, ...data }) =>
					<div key={id.value}>
						{console.log(Object.keys(data))}
						<p>{data.name.name}: {data.name.value}</p>
					</div>
				)}
			</div>
		);
	}
}
