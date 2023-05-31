import React, { ChangeEventHandler, useEffect, useState } from 'react';

import { Typography, Button, FormHelperText, Box, Stack, Paper, styled, Grid, InputLabel, Select, MenuItem, FormControl, Container, TableHead, TableRow, TableCell, SelectChangeEvent, TableContainer, Table, TableBody } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';


export interface Terminal {
  terminalId: string;
  terminalLabel: string;
}

export interface Row {
  id: string | number,
  transactionId: string,
  noticeNumber: string,
  statusTimestamp: Date,
  amount: string | number,
  status: string,
  paTaxCode: string,
  description: string,
  company: string,
  office: string,
  fee: number,
  totalAmount: number

}

export const StatusChip = ({ status }: { status: string | undefined }) => {
  let statusLabel;
  switch (status) {
    case 'PRE_CLOSE':
      statusLabel = "Operazione in sospeso";
      return <Chip label={statusLabel || ""} color={"info"} />
      break;
    case 'PENDING':
      statusLabel = "Operazione in sospeso";
      return <Chip label={statusLabel || ""} color={"info"} />
      break;
    case 'ERROR_ON_CLOSE':
      statusLabel = "Operazione da rimborsare";
      return <Chip label={statusLabel || ""} color={"error"} />
      break;
    case 'ERROR_ON_RESULT':
      statusLabel = "Operazione da rimborsare";
      return <Chip label={statusLabel || ""} color={"error"} />
      break;
    case 'ERROR_ON_PAYMENT':
      statusLabel = "Operazione fallita";
      return <Chip label={statusLabel || ""} color={"error"} />
      break;
    case 'CLOSED':
      statusLabel = "Eseguita";
      return <Chip label={statusLabel || ""} color={"success"} />

      break;
    default:
      return <></>
      break;
  }

}

export const Storico = () => {

  const [selectedTerminal, setSelectedTerminal] = useState("-");
  const [selectedTransaction, setSelectedTransaction] = useState<Row>();
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [terminalError, setTerminalError] = useState(false);
  const [terminalErrorHelper, setTerminalErrorHelper] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (row: Row) => {
    setModalOpen(true);
    setSelectedTransaction(row)
  }



  const [rows, setRows] = useState([{}]);



  const apiData = [{
    "operationType": "PAYMENT_NOTICE",
    "paTaxCode": "15376371009",
    "subscriberId": "x46tr3",
    "noticeTaxCode": "15376371009",
    "noticeNumber": "485564829563528563",
    "presetId": "d0d654e6-97da-4848-b568-99fedccb642b",
    "creationTimestamp": "2023-05-05T16:35:30",
    "status": "EXECUTED",
    "statusTimestamp": "2023-05-05T16:36:30",
    "statusDetails": {
      "transactionId": "517a4216840E461fB011036A0fd134E1",
      "acquirerId": "4585625",
      "channel": "POS",
      "merchantId": "28405fHfk73x88D",
      "terminalId": "0aB9wXyZ",
      "insertTimestamp": "2023-04-11T16:20:34",
      "notices": [
        {
          "paymentToken": "648fhg36s95jfg7DS",
          "paTaxCode": "15376371009",
          "noticeNumber": "485564829563528563",
          "amount": 12345,
          "description": "Health ticket for chest x-ray",
          "company": "ASL Roma",
          "office": "Ufficio di Roma"
        }
      ],
      "totalAmount": 12395,
      "fee": 50,
      "status": "PRE_CLOSE"
    }
  }, {
    "operationType": "PAYMENT_NOTICE",
    "paTaxCode": "15376371009",
    "subscriberId": "x46tr3",
    "noticeTaxCode": "15376371009",
    "noticeNumber": "485564829563528563",
    "presetId": "d0d654e6-97da-4848-b568-99fedccb642b",
    "creationTimestamp": "2023-05-05T16:35:30",
    "status": "EXECUTED",
    "statusTimestamp": "2023-05-05T16:36:30",
    "statusDetails": {
      "transactionId": "517a4216840E461fB011036A0fd134E1",
      "acquirerId": "4585625",
      "channel": "POS",
      "merchantId": "28405fHfk73x88D",
      "terminalId": "0aB9wXyZ",
      "insertTimestamp": "2023-04-11T16:20:34",
      "notices": [
        {
          "paymentToken": "648fhg36s95jfg7DS",
          "paTaxCode": "15376371009",
          "noticeNumber": "485564829563528563",
          "amount": 12345,
          "description": "Health ticket for chest x-ray",
          "company": "ASL Roma",
          "office": "Ufficio di Roma"
        }
      ],
      "totalAmount": 12395,
      "fee": 50,
      "status": "PRE_CLOSE"
    }
  }];

  useEffect(() => {
    let row: Row[] = [];
    apiData.map((element, index) => {
      row.push({
        id: index,
        transactionId: element.statusDetails.transactionId,
        noticeNumber: element.noticeNumber,
        statusTimestamp: new Date(element.statusTimestamp),
        amount: element.statusDetails.notices[0].amount,
        status: element.statusDetails.status,
        paTaxCode: element.paTaxCode,
        description: element.statusDetails.notices[0].description,
        company: element.statusDetails.notices[0].company,
        office: element.statusDetails.notices[0].office,
        fee: element.statusDetails.fee,
        totalAmount: element.statusDetails.totalAmount
      })
    })

    setRows(row);
  }, [apiData])


  const columns: GridColDef[] = [
    { field: 'transactionId', headerName: 'Numero transazione', type: 'string', width: 150, sortable: true },
    { field: 'noticeNumber', headerName: 'Codice  avviso', type: 'number', width: 200, sortable: true },
    { field: 'statusTimestamp', headerName: 'Data', width: 130, sortable: true, type: 'date' },
    { field: 'amount', headerName: 'Ammontare', width: 130 },
    {
      field: 'status',
      headerName: 'Stato',
      width: 90,
      sortable: true,
    },
    {
      field: 'details',
      headerName: 'Dettagli',
      width: 100,
      renderCell: ({ row }) => {
        return <Button variant="outlined" onClick={() => { openModal(row) }} sx={{ width: "75%", height: "50%" }}>Dettagli </Button>
      }
    }
  ];

  useEffect(() => { }, [selectedTerminal]) //TODO: Compplete when the API is ready

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


  const onChangeSelect = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setSelectedTerminal(value);
    if (value === "-") {
      setTerminalError(true);
      setTerminalErrorHelper("Campo obbligatorio")
    }
    else {
      setTerminalError(false);
      setTerminalErrorHelper("");
    }
  }


  return (
    <Container>

      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        {modalOpen ?
          <Modal
            open={modalOpen}
            onClose={() => { setModalOpen(false) }}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              borderRadius: "1%",
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Dettagli transazione
              </Typography>
              <Stack>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Data: </b> {selectedTransaction?.statusTimestamp?.getDay() + " " + selectedTransaction?.statusTimestamp?.toLocaleString('default', { month: 'long' })
                    + " " + selectedTransaction?.statusTimestamp?.getFullYear() + ", " +
                    selectedTransaction?.statusTimestamp?.getHours() + ":" +
                    selectedTransaction?.statusTimestamp?.getMinutes()}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Id transazione: </b> {selectedTransaction?.transactionId}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Codice avviso: </b>
                  {selectedTransaction?.noticeNumber.slice(0, 4)
                    + " " + selectedTransaction?.noticeNumber.slice(4, 8)
                    + " " + selectedTransaction?.noticeNumber.slice(8, 12)
                    + " " + selectedTransaction?.noticeNumber.slice(12, 16)
                    + " " + selectedTransaction?.noticeNumber.slice(16, 18)}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Descrizione: </b> {selectedTransaction?.description}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Ente: </b> {selectedTransaction?.company}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Ufficio: </b> {selectedTransaction?.office}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Commissione: </b> {selectedTransaction?.fee.toFixed(2)} €
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Ammontare totale: </b> {selectedTransaction?.totalAmount.toFixed(2)} €
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <b>Stato: </b> {<StatusChip status={selectedTransaction?.status} />}
                </Typography>
              </Stack>
            </Box>
          </Modal>
          : ''}
        <Grid>
          <Item sx={{ textAlign: 'left' }}>
            <Typography variant="h4">Storico</Typography>
          </Item>
        </Grid>
        <Stack spacing={6} style={{ marginTop: "2vh" }} >
          <FormControl sx={{ width: "30vw", marginBottom: "2.5vh" }}>
            <InputLabel id="terminal" error={terminalError}>Terminale</InputLabel>
            <Select
              labelId="terminal"
              id="terminal"
              name="terminal"
              value={selectedTerminal}
              label="Terminale"
              onChange={onChangeSelect}
              error={terminalError}
            >
              <MenuItem disabled value={"-"}>Scegli un terminale</MenuItem>
              {
                terminals.map((term, index) => {
                  return (
                    <MenuItem value={term.terminalId} key={index}>{term.terminalLabel}</MenuItem>
                  )
                })
              }
            </Select>
            <FormHelperText error>{terminalErrorHelper}</FormHelperText>
          </FormControl>
          {selectedTerminal !== "-" ?
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              sx={{
                borderColor: 'divider',
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },
                marginLeft: '-8.75vw !important',
                width: "60vw"
              }}
              pageSizeOptions={[5, 10]}
            />
            : ''}
        </Stack>
      </Box>
    </Container>

  );
}

export default Storico;
