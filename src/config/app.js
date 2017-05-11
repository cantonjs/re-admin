
import React from 'react';
import { Fields } from 'Schemas';

export default (
	<Fields
		name="上帝的看板"
		api={{
			baseURL: 'http://localhost:3001/api',
			timeout: 15000,
		}}
		auth={{
			basePath: 'auth',
			loginPath: 'login',
			getUserPath: 'getUser'
		}}
		upload={{
			imagePath: '//jsonplaceholder.typicode.com/posts/',
			imageSizeLimit: 3072,
			filePath: 'upload/file',
			fileSizeLimit: 10240,
		}}
	/>
);
