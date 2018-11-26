import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { UPDATER, QUERIER } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import hoist, { extractRef } from 'hocs/hoist';
import ModalControllerContext from 'components/Modal/ModalControllerContext';

export default function field(WrappedComponent) {
	const defaultProps = {
		disabled: false,
		sortable: false,
		...WrappedComponent.defaultProps,
	};

	@hoist(WrappedComponent)
	@withStore()
	@withIssuer()
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
		};

		static defaultProps = defaultProps;

		constructor(props) {
			super(props);

			const { issuers } = props;
			this._isUpdater = issuers && issuers.has(UPDATER);
			this._isQuerier = issuers && issuers.has(QUERIER);
		}

		@computed
		get _shouldShow() {
			const { props: { name }, _isUpdater, modalController } = this;
			if (_isUpdater) {
				if (!modalController || !modalController.parent) return true;
				const { names } = modalController.parent.state;
				if (!names || !names.length) return true;
				else if (names.indexOf(name) < 0) return false;
			}
			return true;
		}

		render() {
			if (!this._shouldShow) return null;

			const {
				props: {
					disabled,
					required,
					issuers,

					value,
					unique,
					sortable,

					...other
				},
				_isQuerier,
			} = this;

			return (
				<ModalControllerContext>
					{(modalController) => {
						this.modalController = modalController;
						return (
							<WrappedComponent
								{...extractRef(other)}
								required={required && !_isQuerier}
								disabled={disabled && !_isQuerier}
							/>
						);
					}}
				</ModalControllerContext>
			);
		}
	}

	// because schema component doesn't really render,
	// so HOCs won't able to setup default props from WrappedComponents
	WithField.defaultProps = defaultProps;

	return WithField;
}
