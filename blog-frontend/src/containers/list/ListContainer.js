import React, { Component } from 'react';
import PostList from 'components/list/PostList';
import Pagination from 'components/list/Pagination';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as listActions from 'store/modules/list';

class ListContainer extends Component {

	getPostList = () => {
		//페이지와 태그 값을 부모에게서 받아 옵니다.
		const { tag, page, ListActions } = this.props;
		ListActions.getPostList({
			page,
			tag
		})
	}

	componentDidMount() {
		this.getPostList();
	}

	componentDidUpdate(prevProps, prevState) {
		// 페이지 패그가 바뀔 때 리스트를 다시 불러옵니다.
		if(prevProps.page !== this.props.page || prevProps.tag !== this.props.tag) {
			this.getPostList();
			//스크롤바를 맨 위로 올립니다.
			document.documentElement.scrollTop = 0;
		}
	}

	render() {
		const { loading, posts, page, lastPage, tag } = this.props;
		if(loading) return null; //로딩 중일 때는 아무것도 보여 주지 않음
		return (
			<div>
				<PostList posts={posts}/>
				<Pagination page={page} lastPage={lastPage} tag={tag}/>
			</div>
		)
	}
}

export default connect(
	(state) => ({
		lastPage: state.list.get('lastPage'),
		posts: state.list.get('posts'),
		loading: state.pender.pending['list/GET_POST_LIST']
	}),
	(dispatch) => ({
		ListActions: bindActionCreators(listActions, dispatch)
	})
)(ListContainer)