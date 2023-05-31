import React, { useState, useEffect } from 'react';
import {
	List,
	ListItemIcon,
	ListItemText,
	Box,
	ListItemButton,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';

export interface Section {
	title: string;
	path: string;
	active: boolean;
	element: JSX.Element;
	icon: JSX.Element;
}
export interface VerticalNavProps {
	sections: Array<Section>;
	setSections: (sec: Array<Section>) => void;
	currentPath: any;
}

export const VerticalNav = ({
	sections,
	setSections,
	currentPath,
}: VerticalNavProps) => {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const handleListItemClick = (index: number) => {
		setSelectedIndex(index);
	};
	const location = useLocation();
	const path = location.pathname.split('/')[1];

	useEffect(() => {
		sections.map((sec, index) => {
			if (sec.path === path) {
				setSelectedIndex(index);
			}
		});
	}, [path]);

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 360,
				float: 'left',
				marginRight: '25.25vw',
				backgroundColor: 'background.default',
				height: '100vh',
			}}
		>
			<List component="nav" aria-label="main piattaforma-notifiche sender">
				{sections.map((section, index) => (
					<Link
						to={section.path}
						key={index}
						style={{ textDecoration: 'none' }}
					>
						<ListItemButton
							selected={selectedIndex === index}
							onClick={() => handleListItemClick(index)}
						>
							<ListItemIcon>{section.icon}</ListItemIcon>
							<ListItemText primary={section.title} />
						</ListItemButton>
					</Link>
				))}
			</List>
		</Box>
	);
};
