import styles from './styles';
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { QUERIER } from 'utils/Issuers';
import { Row, Col } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
import QueryItem from './QueryItem';
import localize from 'hocs/localize';
import withIssuer from 'hocs/withIssuer';
import FormStore from 'stores/FormStore';

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

@withIssuer({ issuer: QUERIER })
@localize('TableQuery')
@observer
export default class TableQuery extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		store: PropTypes.object,
		children: PropTypes.node,
		header: PropTypes.node,
		footer: PropTypes.node,
		hidden: PropTypes.bool,
	};

	static defaultProps = {
		store: {},
		hidden: false,
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
	};

	formStore = new FormStore();

	_handleSearch = (query) => {
		this.props.store.setQuery(query);
	};

	_handleReset = () => {
		this.props.store.setQuery({});
	};

	_handleChange = (state) => {
		this.formStore.setState(state);
	};

	_renderBody() {
		const { props: { children, store: { renderers } }, formStore } = this;
		if (children) {
			return Children.map(children, (child, index) => (
				<QueryItem key={index}>{child}</QueryItem>
			));
		}
		return (
			renderers.length > 0 && (
				<Row style={styles.main}>
					{renderers.map(({ renderQuery }, key) =>
						renderQuery(formStore, {
							key,
							children: (render) => {
								if (!render) return null;
								const children = render();
								return children && <QueryItem>{children}</QueryItem>;
							},
						})
					)}
				</Row>
			)
		);
	}

	render() {
		const {
			props: { header, footer, children, hidden, store, localeStore },
		} = this;
		const shouldHide =
			hidden ||
			((!children || !Children.count(children)) &&
				(!store || !store.renderers.length || !store.queryFieldsCount));
		return (
			<Form
				style={styles.container(shouldHide && styles.hidden)}
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
						<Submit type="primary">{localeStore.search}</Submit>
						<Reset>{localeStore.reset}</Reset>
					</FooterContainer>
				)}
			</Form>
		);
	}
}
