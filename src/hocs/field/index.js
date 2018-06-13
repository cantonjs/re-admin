import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { UPDATER, QUERIER } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import withModalStore from 'hocs/withModalStore';
import hoist, { extractRef } from 'hocs/hoist';

export default function field(WrappedComponent) {
	const defaultProps = {
		disabled: false,
		sortable: false,
		...WrappedComponent.defaultProps,
	};

	@hoist(WrappedComponent)
	@withStore()
	@withIssuer()
	@withModalStore()
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
			store: PropTypes.object,

			// provided by `withIssuer()`
			issuers: PropTypes.instanceOf(Set).isRequired,

			// provided by `withIssuer()`
			modalStore: PropTypes.object.isRequired,
		};

		static defaultProps = defaultProps;

		static contextTypes = {
			getParentValue: PropTypes.func,
		};

		constructor(props) {
			super(props);

			const { issuers } = props;
			this._isUpdater = issuers && issuers.has(UPDATER);
			this._isQuerier = issuers && issuers.has(QUERIER);
		}

		@computed
		get _shouldShow() {
			const { props: { name, modalStore }, _isUpdater } = this;
			if (_isUpdater) {
				if (!modalStore || !modalStore.parent) return false;
				const { select } = modalStore.parent.state;
				if (!select) return true;
				else if (select.split(',').indexOf(name) < 0) return false;
			}
			return true;
		}

		render() {
			if (!this._shouldShow) {
				return null;
			}

			const {
				props: {
					disabled,
					required,
					issuers,

					value,
					unique,
					sortable,
					modalStore,

					...other
				},
				_isQuerier,
			} = this;

			return (
				<WrappedComponent
					{...extractRef(other)}
					required={required && !_isQuerier}
					disabled={disabled && !_isQuerier}
				/>
			);
		}
	}

	// because schema component doesn't really render,
	// so HOCs won't able to setup default props from WrappedComponents
	WithField.defaultProps = defaultProps;

	return WithField;
}
