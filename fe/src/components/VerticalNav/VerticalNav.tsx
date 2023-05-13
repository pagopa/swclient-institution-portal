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
    active: boolean
    element: JSX.Element
}
export interface VerticalNavProps {
    sections: Array<Section>;
    setSections: (sec: Array<Section>) => void;
}


export const VerticalNav = ({ sections, setSections }: VerticalNavProps) => {
    const theme = useTheme();


    const setActiveSection = (sectionIndex: number) => {
        let sectionArray: Section[] = [];

        sections.map((sec, index) => {
            if (index === sectionIndex) {
                sec.active = true;
            }
            else {
                sec.active = false;
            }
            sectionArray.push(sec);

        })

        setSections(sectionArray);
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%', maxWidth: 360, float: 'left' }}>
                <nav aria-label="main mailbox folders">
                    <List sx={{ paddingTop: "0px" }}>
                        {sections.map((section, index) => {
                            const bgColor = section.active ? theme.palette.primary.light : theme.palette.primary.dark;
                            return (
                                <Link to={section.path} onClick={() => { setActiveSection(index) }} key={index}>
                                    <ListItem disablePadding sx={{ bgcolor: bgColor, paddingTop: "0px" }} >
                                        <ListItemButton>
                                            <ListItemText primary={section.title} sx={{ color: "primary.contrastText", textAlign: 'center' }} />
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
