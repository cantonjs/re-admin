import { computed, observable, action, observe, keys } from 'mobx';
import Emitter from 'emit-lite';

export default class ModalStore extends Emitter {
	@observable state = {};
	@observable modalProps = {};

	@computed
	get name() {
		return this.state.name;
	}

	@computed
	get visible() {
		return !!this.name;
	}

	constructor(parent) {
		super();

		this.parent = parent;
		this._observeDisposer = observe(this, ({ name, newValue }) => {
			if (name === 'state' && !keys(newValue).length) {
				this.emit('close');
			}
		});
	}

	@action
	destroy() {
		this._observeDisposer();
		this.state = {};
	}

	@action
	close() {
		this.state = {};
	}

	@action
	open(state) {
		this.state = state;
	}

	@action
	setModalProps(props) {
		this.modalProps = props;
	}
}
