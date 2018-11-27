import React, { Component } from 'react';
import LoginModalContainer from 'containers/modal/LoginModalContainer';
import * as baseActions from 'store/modules/base';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Base extends Component {
	initialize = async () => {
		const { BaseActions } = this.props;
		if(localStorage.logged === "true"){
			BaseActions.tempLogin();
		}
		BaseActions.checkLogin();
	}

	componentDidMount() {
		this.initialize();
	}

	render() {
		return (
			<div>
				<LoginModalContainer/>
			{ /* 전역적으로 사용하기 위한 컴포넌트용 */ }
			</div>
		)
	}
}

export default connect(
	null,
	(dispatch) => ({
		BaseActions: bindActionCreators(baseActions, dispatch)
	})
)(Base);