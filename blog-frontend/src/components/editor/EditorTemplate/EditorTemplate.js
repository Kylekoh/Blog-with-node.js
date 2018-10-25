import React, { Component } from 'react';
import styles from './EditorTemplate.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles);

class EditorTemplate extends Component {
	state = {
		leftPercentage: 0.5
	}

	// separator 클릭 후 마우스를 움직이면 그에 따라 leftPercentage 업데이트
	handleMouseMove = (e) => {
		this.setState({
			leftPercentage: e.clientX / window.innderWidth
		});
	}

	handleMouseUp = (e) => {
		document.body.removeEventListener('mousemove', this.handleMouseMove);
		window.removeEventListener('mouseup', this.handleMouseUp);
	}

	render() {
		const { header, editor, preview } = this.props;
		return (
			<div className={cx('editor-template')}>
				{header}
				<div className={cx('panes')}>
					<div className={cx('pane', 'editor')}>
						{editor}
					</div>
					<div className={cx('pane', 'preview')}>
						{preview}
					</div>
				</div>
			</div>
		)
	}
}

export default EditorTemplate;