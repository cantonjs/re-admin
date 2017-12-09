
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
		const {
			_props: { name },
			_context: { modalStore },
			_isUpdater,
		} = this;
		if (_isUpdater) {
			const { select } = modalStore.state;
			if (!select) { return true; }
			else if (select.split(',').indexOf(name) < 0) { return false; }
		}
		return true;
	}

	@computed get value() {
		const {
			_props: { name, value },
			_context: { store, getParentValue, modalStore },
			_isUpdater,
			_isQuerier,
		} = this;

		if (!isUndefined(value) || !name) { return value; }

		const { query } = routerStore.location;

		if (_isQuerier) { return query[name]; }
		else if (_isUpdater) {
			const { keys } = modalStore.state;
			const selectedKeys = (keys || '').split(',');
			if (selectedKeys.length !== 1) { return ''; }
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
			modalStore: PropTypes.object,
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
