
import React from 'react';
import { Fields } from 'Schemas';

export default (
	<Fields
		name="上帝的看板"
		api={{
			baseURL: '/api',
			count: 5,
		}}
		auth={{
			basePath: 'auth',
			loginPath: 'login',
			getUserPath: 'getUser'
		}}
		upload={{
			imagePath: '/api/upload/image',
			filePath: 'upload/file',
		}}
	/>
);
