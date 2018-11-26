import { observable, action } from 'mobx';

export default class ModalPropsStore {
	@observable props = {};

	@action
	set(props) {
		this.props = props;
	}
}
