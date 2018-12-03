import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import { observer } from 'mobx-react';
import TableStoreProvider from 'components/TableStoreProvider';

export default function withTable(options = {}) {
	const storePropName = options.prop || 'store';
	return function createWithTableComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class TableStoreComponent extends PureComponent {
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
				store && store.setupQuery();
			}

			render() {
				return <WrappedComponent {...extractRef(this.props)} />;
			}
		}

		const WithTable = function WithTable(props) {
			return (
				<TableStoreProvider {...options} {...props}>
					{({ store }) => {
						const extraStoreProp = { [storePropName]: store };
						return <TableStoreComponent {...props} {...extraStoreProp} />;
					}}
				</TableStoreProvider>
			);
		};

		return observer(WithTable);
	};
}
