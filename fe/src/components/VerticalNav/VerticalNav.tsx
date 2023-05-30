import React, { useState } from 'react';
import {
    List,
    ListItemIcon,
    ListItemText,
    Box,
    ListItemButton,
} from "@mui/material";
import { Link } from 'react-router-dom';


export interface Section {
    title: string;
    path: string;
    active: boolean
    element: JSX.Element
    icon: JSX.Element
}
export interface VerticalNavProps {
    sections: Array<Section>;
    setSections: (sec: Array<Section>) => void;
    currentPath: any;
}


export const VerticalNav = ({ sections, setSections, currentPath }: VerticalNavProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 360, float: 'left', marginRight: "10vw", backgroundColor: 'background.paper' }}>

            <List component="nav" aria-label="main piattaforma-notifiche sender">
                {
                    sections.map((section, index) => (
                        <Link to={section.path} key={index} style={{ textDecoration: 'none' }}>
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={() => handleListItemClick(index)}
                            >
                                <ListItemIcon>

                                    {section.icon}
                                </ListItemIcon>
                                <ListItemText primary={section.title} />
                            </ListItemButton>
                        </Link>))
                }

            </List>
        </Box>
    );
}


