import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { observable, computed, action } from 'mobx';
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

	@observable cursors = [null];
	@observable cursorIndex = 0;

	@computed
	get cursor() {
		return this.cursors[this.cursorIndex];
	}

	@computed
	get prevCursor() {
		return this.cursors[this.cursorIndex - 1];
	}

	_handleClickPrev = () => {
		const { props: { onChange, store: { isFetching } }, prevCursor } = this;
		if (!isFetching && prevCursor !== undefined && onChange) {
			this.cursorIndex--;
			this.cursors.pop();
			onChange(prevCursor);
		}
	};

	@action
	_handleClickNext = () => {
		const { props: { onChange, store: { nextCursor, isFetching } } } = this;
		if (!isFetching && nextCursor && onChange) {
			this.cursorIndex++;
			this.cursors.push(nextCursor);
			onChange(nextCursor);
		}
	};

	render() {
		const {
			props: { style, className, store: { nextCursor, isFetching } },
			prevCursor,
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
