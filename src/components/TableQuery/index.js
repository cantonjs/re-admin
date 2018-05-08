import styles from './styles';
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { QUERIER } from 'utils/Issuers';
import { Row, Col } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
import QueryItem from './QueryItem';
import localize from 'hoc/localize';
import withIssuer from 'hoc/withIssuer';
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
@localize()
@observer
export default class TableQuery extends Component {
	static propTypes = {
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
					{renderers.map(({ renderQuery }, index) => {
						const children = renderQuery(formStore);
						if (children) return <QueryItem key={index}>{children}</QueryItem>;
						return null;
					})}
				</Row>
			)
		);
	}

	render() {
		const { props: { header, footer, children, hidden, store }, locale } = this;
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
						<Submit type="primary">{locale.search}</Submit>
						<Reset>{locale.reset}</Reset>
					</FooterContainer>
				)}
			</Form>
		);
	}
}
