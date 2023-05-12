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
import { Method } from '@testing-library/react';

export interface Section {
    title: string;
    active: boolean;
}
export interface VerticalNavProps {
    sections: Array<Section>;
    setSections: (sec: Array<Section>) => void;
}


export const VerticalNav = ({ sections, setSections }: VerticalNavProps) => {
    const theme = useTheme();

    const setActiveSection = (sectionIndex: number) => {
        let sec: Section[] = [];
        sections.map((element, index) => {
            if (sectionIndex === index) {
                element.active = true;
            }
            else {
                element.active = false;
            }
            sec.push(element);
        })
        setSections(sec);
    }

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
                                <ListItem disablePadding sx={{ bgcolor: bgColor, paddingTop: "0px" }} >
                                    <ListItemButton onClick={() => { setActiveSection(index) }} >
                                        <ListItemText primary={section.title} sx={{ color: "primary.contrastText" }} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </nav>
            </Box>
        </ThemeProvider >
    )
};
