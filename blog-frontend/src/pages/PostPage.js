import React from 'react';
import PageTemplate from 'components/common/PageTemplate';
import Post from 'containers/post/Post';
import AskRemoveModal from 'components/modal/AskRemoveModal'
import AskRemoveModalContainer from 'containers/modal/AskRemoveModalContainer'

const PostPage = ({match}) => {
	const { id } = match.params;
	return (
		<PageTemplate>
			<Post id={id}/>
			<AskRemoveModalContainer/>
		</PageTemplate>
	)
}

export default PostPage;