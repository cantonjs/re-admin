
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

// TODO: only for developing...
import stores from 'stores/testStore';

@observer
export default class Table extends Component {
	static propTypes = {
		route: PropTypes.shape({
			table: PropTypes.string.isRequired,
		}),
	};

	state = {
		// stores: getStore(this.props.route.table),
		stores,
	};

	componentWillMount() {
		console.log('table:', this.props.route.table);
	}

	// componentWillReceiveProps({ route: { table } }) {
	// 	if (this.props.route.table !== table) {
	// 		this.setState({ store: getStore(table) });
	// 	}
	// }

	componentDidMount() {
		this.state.stores.fetch();
	}

	render() {
		const { stores } = this.state;
		return (
			<div>
				<h1>Table</h1>
				{stores.collection.map(({ id, ...data }) =>
					<div key={id}>
						{console.log(Object.keys(data))}
						<p>name: {data.name}</p>
					</div>
				)}
			</div>
		);
	}
}
