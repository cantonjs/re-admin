import styles from './styles';
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { QUERIER } from 'utils/Issuers';
import { Row, Col } from 'antd';
import { Form, Submit, Reset } from 'components/Nested';
import QueryItem from './QueryItem';
import localize from 'hoc/localize';
import withIssuer from 'hoc/withIssuer';

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
		issuer: PropTypes.instanceOf(Set),
	};

	static childContextTypes = {
		issuer: PropTypes.instanceOf(Set),
		formState: PropTypes.object,
	};

	getChildContext() {
		return { formState: this._formState };
	}

	componentWillMount() {
		this._formState = new FormState();
	}

	_handleSearch = (query) => {
		this.props.store.setQuery(query);
	};

	_handleReset = () => {
		this.props.store.setQuery({});
	};

	_handleChange = (data) => {
		this._formState.data = data;
	};

	_renderBody() {
		const { children, store: { renderers } } = this.props;
		if (children) {
			return Children.map(children, (child, index) => (
				<QueryItem key={index}>{child}</QueryItem>
			));
		}
		return (
			renderers.length > 0 && (
				<Row style={styles.main}>
					{renderers.map(({ render, props, options }, index) => {
						const children = render(props, options);
						if (children) return <QueryItem key={index}>{children}</QueryItem>;
						return null;
					})}
				</Row>
			)
		);
	}

	render() {
		const { props: { header, footer, hidden, store }, locale } = this;
		return (
			<Form
				style={styles.container(hidden ? styles.hidden : {})}
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
