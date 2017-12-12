
import { message } from 'antd';

export default function showError(title, error) {
	message.error([title, error.reason || error.message].join(': '));
}
