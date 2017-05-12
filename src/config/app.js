
import React from 'react';
import { Fields } from 'Schemas';

export default (
	<Fields
		name="上帝的看板"
		api={{
			baseURL: '//localhost:3001/api',
			count: 5,
		}}
		auth={{
			basePath: 'auth',
			loginPath: 'login',
			getUserPath: 'getUser'
		}}
		upload={{
			imagePath: '//localhost:3001/api/upload/image',
			filePath: 'upload/file',
		}}
	/>
);
