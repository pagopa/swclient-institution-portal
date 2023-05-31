import React, { useEffect, useState } from 'react';
import { theme } from "@pagopa/mui-italia";
import { Typography, Box, Stack, Paper, styled, Grid, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteForever';

const columns: GridColDef[] = [
  { field: 'terminalId', headerName: 'POS', type: 'string', width: 200, sortable: true },
  { field: 'label', headerName: 'Descrizione', width: 130, sortable: true, type: 'string' },
  { field: 'lastOperation', headerName: 'Data ultima operazione', width: 130, type: 'date' },
  {
    field: 'action',
    headerName: 'Azioni',
    width: 90,
    renderCell: () => { return (<DeleteIcon sx={{ cursor: "pointer" }} />) }
  }
];

const d = new Date(2021, 11, 11);
const rows = [
  { id: 1, terminalId: 'DXA', label: "Term1", lastOperation: d, },
  { id: 2, terminalId: 'DXB', label: "Term3", lastOperation: d, },
  { id: 3, terminalId: 'DXC', label: "Term4", lastOperation: d, },
];


export interface Terminal {
  terminalId: string;
  terminalLabel: string;
}

export const Dispositivi = () => {

  const [terminals, setTerminals] = useState<Terminal[]>([]);


  useEffect(() => {
    setTerminals([{ terminalLabel: "Reception POS", terminalId: "DXA0132" },
    { terminalLabel: "Room A POS", terminalId: "DXB0132" },
    { terminalLabel: "Room B POS", terminalId: "DXC0132" }])
  }, [])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Container>
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <Grid>
          <Item sx={{ textAlign: 'left' }}>
            <Typography variant="h4">Dispositivi</Typography>
          </Item>
        </Grid>
        <Stack spacing={6} style={{ marginTop: "2vh" }} >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            sx={{
              borderColor: 'divider',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              }
            }}
          />        </Stack>
      </Box>
    </Container>

  );
}

export default Dispositivi;
