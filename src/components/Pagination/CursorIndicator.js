import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';

@observer
export default class CursorIndicator extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		className: PropTypes.string,
		style: PropTypes.object,
		store: PropTypes.object.isRequired,
	};

	static defaultProps = {
		className: '',
	};

	_handleClickPrev = () => {
		const { props: { onChange, store } } = this;
		const { isFetching, prevCursor } = store;
		if (!isFetching && prevCursor !== undefined && onChange) {
			onChange(prevCursor);
			store.decreaseCursorIndex();
		}
	};

	_handleClickNext = () => {
		const { props: { onChange, store } } = this;
		const { isFetching, nextCursor } = store;
		if (!isFetching && nextCursor && onChange) {
			onChange(nextCursor);
			store.increaseCursorIndex();
		}
	};

	render() {
		const {
			props: {
				style,
				className,
				store: { prevCursor, nextCursor, isFetching },
			},
		} = this;
		const prevClassName =
			prevCursor !== undefined && !isFetching ? '' : 'ant-pagination-disabled';
		const nextClassName =
			nextCursor && !isFetching ? '' : 'ant-pagination-disabled';
		return (
			<ul style={style} className={`ant-pagination ${className}`}>
				<li className={`ant-pagination-prev ${prevClassName}`}>
					<a
						className={'ant-pagination-item-link'}
						onClick={this._handleClickPrev}
					/>
				</li>
				<li className={`ant-pagination-next ${nextClassName}`}>
					<a
						className={'ant-pagination-item-link'}
						onClick={this._handleClickNext}
					/>
				</li>
			</ul>
		);
	}
}
