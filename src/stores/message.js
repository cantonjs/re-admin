
import { observable, autorun } from 'mobx';
import { message } from 'antd';

class Message {
	@observable _msg = { type: 'info', text: '' };

	constructor() {
		autorun(() => {
			const { text, type } = this._msg;
			if (text) { message[type](text); }
		});
	}

	push(text, type = 'info') {
		this._msg = { text, type, timestamp: Date.now() };
	}
}

export default new Message();

