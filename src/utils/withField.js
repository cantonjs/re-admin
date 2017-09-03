
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UPDATER, QUERIER } from 'constants/Issuers';
import routerStore from 'stores/routerStore';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { isUndefined } from 'lodash';
import hoistNonReactStatics from 'hoist-non-react-statics';

const styles = {
	container: {
		marginBottom: 12,
	},
};

class State {
	@computed get shouldShow() {
		const { _names } = routerStore.location.query;
		const { name } = this._props;

		if (this._isUpdater && _names) {
			const names = _names.split(',');
			if (names.length && names.indexOf(name) < 0) { return false; }
		}

		return true;
	}

	@computed get value() {
		const {
			_props: { name, value },
			_context: { store, getParentValue },
			_isUpdater,
			_isQuerier,
		} = this;

		if (!isUndefined(value) || !name) { return value; }

		const { query } = routerStore.location;
		const selectedKeys = (query._keys || '').split(',');

		if (_isQuerier) { return query[name]; }

		else if (selectedKeys.length === 1 && _isUpdater) {
			const item = getParentValue ?
				getParentValue() : store.findItemByKey(selectedKeys[0])
			;
			return item ? item[name] : undefined;
		}

		return '';
	}

	constructor(props, context) {
		this._props = props;
		this._context = context;
		this._isUpdater = context.issuer === UPDATER;
		this._isQuerier = context.issuer === QUERIER;
	}
}

export default function withField(WrappedComponent) {

	@observer
	class WithField extends Component {
		static propTypes = {
			name: PropTypes.string,
			value: PropTypes.any,
			defaultValue: PropTypes.any,
			label: PropTypes.string,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			required: PropTypes.bool,
			unique: PropTypes.bool,
			disabled: PropTypes.bool,
			validations: PropTypes.array,
			sortable: PropTypes.bool,
		};

		static defaultProps = {
			disabled: false,
			sortable: false,
			...WrappedComponent.defaultProps,
		};

		static contextTypes = {
			store: PropTypes.object,
			issuer: PropTypes.string,
			getParentValue: PropTypes.func,
		};

		componentWillMount() {
			this._state = new State(this.props, this.context);
		}

		getValue = () => {
			return this._state.value;
		};

		render() {
			if (!this._state.shouldShow) { return null; }

			const {
				props: {
					disabled,
					required,

					value,
					defaultValue,
					unique,
					sortable,

					...other,
				},
				context: {
					issuer,
				},
			} = this;

			const isInQuery = issuer === QUERIER;

			return (
				<WrappedComponent
					wrapperStyle={styles.container}
					{...other}
					required={required && !isInQuery}
					disabled={disabled && !isInQuery}
					getValue={this.getValue}
				/>
			);
		}
	}

	return hoistNonReactStatics(WithField, WrappedComponent);
}
