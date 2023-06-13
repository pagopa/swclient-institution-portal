import React, { useEffect, useState } from 'react';
import { theme } from "@pagopa/mui-italia";
import { Typography, Box, Stack, Paper, styled, Grid, Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';

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



export interface Terminals {
  "subscribers": [
    Terminal
  ]
}

export interface Terminal {
  "acquirerId": string,
  "channel": string,
  "merchantId": string,
  "terminalId": string,
  "paTaxCode": string,
  "subscriberId": string,
  "label": string,
  "subscriptionTimestamp": string,
  "lastUsageTimestamp": string
}


export const Dispositivi = () => {

  const [rows, setRows] = useState([]);
  const [paTaxCode, setPaTaxCode] = useState("15376371009");
  const [terminals, setTerminals] = useState<Terminals | { subscribers: [] }>({
    subscribers: []
  });
  const getTerminals = async () => {
    try {
      const data: any = await axios.get(process.env.REACT_APP_API_ADDRESS + '/terminals/' + paTaxCode, {
        headers: {
          "RequestId": process.env.REACT_APP_REQUEST_ID,
        },
      });
      setTerminals(data.data);
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    let r: any = [];
    terminals.subscribers.map((t, i) => {
      r.push({ id: i, terminalId: t.terminalId, label: t.label, lastOperation: new Date(t.lastUsageTimestamp), },
      )
    })

    console.log(r);
    setRows(r);
  }, [terminals])


  useEffect(() => {
    if (process.env.REACT_APP_IS_USING_MOCK === "true") {
      setTerminals({
        subscribers: [
          {
            "acquirerId": "4585625",
            "channel": "POS",
            "merchantId": "28405fHfk73x88D",
            "terminalId": "0aB9wXyZ",
            "paTaxCode": "15376371009",
            "subscriberId": "x46tr3",
            "label": "Reception POS",
            "subscriptionTimestamp": "2023-05-05T09:31:33",
            "lastUsageTimestamp": "2023-05-08T10:55:57"
          }
        ]
      })
    }
    else {
      getTerminals();
    }
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
          {rows.length > 0 ? <DataGrid
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
          /> : ''}    </Stack>
      </Box>
    </Container>

  );
}

export default Dispositivi;
