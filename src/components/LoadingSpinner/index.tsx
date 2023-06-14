import { CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
const Index = () => {
	return (
		<div
			style={{
				position: 'absolute',
				width: '100%',
				top: '0',
				height: '100vh',
				background: 'rgba(0, 0, 0, 0.5)',
				paddingTop: '30vh',
				zIndex: '1',
			}}
		>
			<CircularProgress />
		</div>
	);
};

export default Index;
