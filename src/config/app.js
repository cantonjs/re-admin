
import React from 'react';
// import { Fields } from 'Schemas';
import Fields from 'components/Fields';
import sidebar from './sidebar';

export default (
	<Fields
		name="上帝的看板"
		sidebar={sidebar}
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
