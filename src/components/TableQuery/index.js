import styles from './styles';
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { propTypes as MobxPropTypes } from 'mobx-react';
import { observable } from 'mobx';
import { omit } from 'lodash';
import { QUERIER } from 'constants/Issuers';
import { Form as AntdForm, Row, Col, Button } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
import FormItemWrapper from 'components/FormItemWrapper';

const { Item } = AntdForm;

class FormState {
	@observable data = {};
}

const FooterContainer = ({ children }) => (
	<Row>
		<Col span={24} style={styles.footer}>
			{children}
		</Col>
	</Row>
);

FooterContainer.propTypes = {
	children: PropTypes.node,
};

export default class TableQuery extends Component {
	static propTypes = {
		store: PropTypes.object,
		children: PropTypes.node,
		header: PropTypes.node,
		footer: PropTypes.node,
	};

	static defaultProps = {
		store: {},
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
		issuer: PropTypes.instanceOf(Set),
	};

	static childContextTypes = {
		issuer: PropTypes.instanceOf(Set),
		formState: PropTypes.object,
	};

	getChildContext() {
		const issuer = this.context.issuer || new Set();
		issuer.add(QUERIER);
		return {
			issuer,
			formState: this._formState,
		};
	}

	componentWillMount() {
		this._formState = new FormState();
	}

	componentWillUnmount() {
		const { issuer } = this.context;
		if (issuer) {
			issuer.delete(QUERIER);
		}
	}

	_handleSearch = (query) => {
		this.props.store.setState(query);
	};

	_handleReset = () => {
		this.props.store.setState({});
	};

	_handleResetSort = () => {
		const { sortKey, orderKey } = this.context.appConfig.api;
		const { store } = this.props;
		const query = omit(store.query, [sortKey, orderKey]);
		store.setQuery(query);
	};

	_handleChange = (data) => {
		this._formState.data = data;
	};

	_renderBody() {
		const { children, store: { queryRenderers } } = this.props;
		if (children) {
			return children;
		}
		return (
			queryRenderers.length > 0 && (
				<Row style={styles.main}>
					{queryRenderers.map((renderOptions, index) => (
						<FormItemWrapper renderOptions={renderOptions} key={index} />
					))}
				</Row>
			)
		);
	}

	render() {
		const {
			children,
			header,
			footer,
			store: { hasSortableField, hasQueryField, sortedOrder, sortedKey },
		} = this.props;

		const hasChildren = !!Children.count(children) || hasQueryField;

		if (!hasChildren && !hasSortableField) {
			return null;
		}

		return (
			<Form
				ref={this._saveForm}
				style={styles.container}
				onSubmit={this._handleSearch}
				onReset={this._handleReset}
				onChange={this._handleChange}
				layout="inline"
			>
				{!!header && header}

				{this._renderBody()}

				{!!footer && <FooterContainer>{footer}</FooterContainer>}

				{!footer && (
					<FooterContainer>
						{hasChildren && <Submit type="primary">查询</Submit>}
						{hasChildren && <Reset>重置</Reset>}
						{hasSortableField && (
							<Item>
								<Button
									onClick={this._handleResetSort}
									disabled={!sortedOrder && !sortedKey}
								>
									默认排序
								</Button>
							</Item>
						)}
					</FooterContainer>
				)}
			</Form>
		);
	}
}
