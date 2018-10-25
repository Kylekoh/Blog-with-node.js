import React, { Component } from 'react';
import PostInfo from 'components/post/PostInfo';
import PostBody from 'components/post/PostBody';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as postActions from 'store/modules/post';

class Post extends Component {

	initialize = async () => {
		const { PostActions, id } = this.props;
		try {
			await PostActions.getPost(id);
		} catch(e) {
			console.log(e);
		}
	}

	componentDidMount() {
		this.initialize();
	}

	render() {
		const { loading, post } = this.props;

		if(loading) return null; //로딩 중일 때는 아무것도 보여 주지 않음

		const { title, body, publishedDate, tags } = post.toJS(); 

		return (
			<div>
				<PostInfo title={title} publishedDate={publishedDate} tags={tags}/>
				<PostBody body={body}/>
			</div>
		)
	}
}

export default connect(
	(state) => ({
		post: state.post.get('post'),
		loading: state.pender.pending['post/GET_POST']
	}),
	(dispatch) => ({
		PostActions: bindActionCreators(postActions, dispatch)
	})
)(Post)