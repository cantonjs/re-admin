
import { message } from 'antd';

export default function showError(...messages) {
	message.error(messages.join(' '));
}
