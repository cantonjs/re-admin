
import NavigatarModal from 'components/NavigatorModal';
import Form from 'modals/Form';

export default function registerBuiltInModels() {
	const { registerModal } = NavigatarModal;
	registerModal('create', '创建', Form.createRenderer('create'));
	registerModal('update', '更新', Form.createRenderer('update'));
}
