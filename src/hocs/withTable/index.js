import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import { withStoreProvider } from 'hocs/withStore';
import { observer } from 'mobx-react';

export default function withTable(options = {}) {
	const storePropName = options.prop || 'store';
	return function createWithTableComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withStoreProvider(options)
		@observer
		class WithTable extends Component {
			// DEPRECATED
			static childContextTypes = {
				store: PropTypes.object,
			};

			// DEPRECATED
			getChildContext() {
				return {
					store: this.props[storePropName],
				};
			}

			componentDidMount() {
				const store = this.props[storePropName];
				store.setupQuery();
			}

			render() {
				return <WrappedComponent {...extractRef(this.props)} />;
			}
		}

		return WithTable;
	};
}
