import React from 'react';
import { ThemeProvider } from "@mui/material";
import { HorizontalNavProps, theme } from "@pagopa/mui-italia";
import {
    List,
    ListItem,
    ListItemText,
    Box,
    ListItemButton,
    useTheme,
} from "@mui/material";
import { Link } from 'react-router-dom';

export interface Section {
    title: string;
    path: string;
}
export interface VerticalNavProps {
    sections: Array<Section>;
    setSections: (sec: Array<Section>) => void;
}


export const VerticalNav = ({ sections, setSections }: VerticalNavProps) => {
    const theme = useTheme();



    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%', maxWidth: 360, }}>
                <nav aria-label="main mailbox folders">
                    <List sx={{ paddingTop: "0px" }}>
                        {sections.map((section, index) => {
                            const bgColor = index === 0
                                ? theme.palette.primary.dark
                                : index === 1
                                    ? theme.palette.primary.main
                                    : theme.palette.primary.light;
                            return (
                                <Link to={section.path}>
                                    <ListItem disablePadding sx={{ bgcolor: bgColor, paddingTop: "0px" }} >
                                        <ListItemButton>
                                            <ListItemText primary={section.title} sx={{ color: "primary.contrastText" }} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            )
                        })}
                    </List>
                </nav>
            </Box>
        </ThemeProvider >
    )
};
