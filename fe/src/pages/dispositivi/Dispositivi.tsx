import React, { useEffect, useState } from 'react';

import { Typography, Box, Stack, Paper, styled, Grid, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteForever';

const columns: GridColDef[] = [
  { field: 'noticeNumber', headerName: 'Numero avviso', type: 'number', width: 200, sortable: true },
  { field: 'date', headerName: 'Data', width: 130, sortable: true, type: 'date' },
  { field: 'amount', headerName: 'Ammontare', width: 130 },
  {
    field: 'status',
    headerName: 'Stato',
    width: 90,
    sortable: true,
  },
  {
    field: 'action',
    headerName: 'Azioni',
    width: 90,
    renderCell: () => { return (<DeleteIcon sx={{ cursor: "pointer" }} />) }
  }
];

const d = new Date(2021, 11, 11);
const rows = [
  { id: 1, noticeNumber: '12345', date: d, amount: "35", status: "ok" },
  { id: 2, noticeNumber: '23456', date: d, amount: "36", status: "ok" },
  { id: 3, noticeNumber: '34567', date: d, amount: "38", status: "ok" },
  { id: 4, noticeNumber: '45678', date: d, amount: "45", status: "ok" },
  { id: 5, noticeNumber: '56789', date: d, amount: "500", status: "ok" },
  { id: 6, noticeNumber: '67890', date: d, amount: "35", status: "ok" },
  { id: 7, noticeNumber: '78901', date: d, amount: "37", status: "ok" },
  { id: 8, noticeNumber: '89012', date: d, amount: "39", status: "ok" },
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
          />        </Stack>
      </Box>
    </Container>

  );
}

export default Dispositivi;
