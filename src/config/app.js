
import React from 'react';
import { Fields } from 'Schemas';

export default (
	<Fields
		name="上帝的看板"
		api={{
			baseURL: '//localhost:3001/api',
		}}
		auth={{
			basePath: 'auth',
			loginPath: 'login',
			getUserPath: 'getUser'
		}}
		upload={{
			imagePath: '//jsonplaceholder.typicode.com/posts/',
			filePath: 'upload/file',
		}}
	/>
);
