import React, { ChangeEventHandler, useEffect, useState } from 'react';

import { Typography, Box, Stack, Paper, styled, TextField, Grid, InputLabel, Select, MenuItem, FormControl, Container, Button } from '@mui/material';
import { theme } from "@pagopa/mui-italia";


export interface Terminal {
  terminalId: string;
  terminalLabel: string;
}

export const Paga = () => {

  const [selectedTerminal, setSelectedTerminal] = useState("-");
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [paymentNoticeNumber, setPaymentNoticeNumber] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [paymentNoticeNumberError, setPaymentNoticeNumberError] = useState(false);
  const [paymentNoticeNumberHelper, setPaymentNoticeNumberHelper] = useState("");
  const [taxCodeError, setTaxCodeError] = useState(false);
  const [taxCodeHelper, setTaxCodeErrorHelper] = useState("");


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

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "noticeNumber":
        setPaymentNoticeNumber(value);
        if (value === "") {
          setPaymentNoticeNumberError(true);
          setPaymentNoticeNumberHelper("Campo obbligatorio")

        }
        else if (value.length !== 18) {
          setPaymentNoticeNumberError(true);
          setPaymentNoticeNumberHelper("Inserire 18 cifre");
        }
        else {
          setPaymentNoticeNumberError(false);
          setPaymentNoticeNumberHelper("");
        }
        break;
      case "taxCode":
        setTaxCode(value);
        if (value === "") {
          setTaxCodeError(true);
          setTaxCodeErrorHelper("Campo obbligatorio")

        }
        else if (value.length !== 16) {
          setTaxCodeError(true);
          setTaxCodeErrorHelper("Inserire 16 cifre");
        }
        else {
          setTaxCodeError(false);
          setTaxCodeErrorHelper("");
        }
        break;
      default:
        break;
    }
  }
  const activatePayment = () => {

    if (paymentNoticeNumber === "") {
      setPaymentNoticeNumberError(true);
      setPaymentNoticeNumberHelper("Campo obbligatorio")
    } else if (paymentNoticeNumber.length !== 18) {
      setPaymentNoticeNumberError(true);
      setPaymentNoticeNumberHelper("Inserire 18 cifre");
    }

    if (taxCode === "") {
      setTaxCodeError(true);
      setTaxCodeErrorHelper("Campo obbligatorio")
    }
    else if (taxCode.length !== 16) {
      setTaxCodeError(true);
      setTaxCodeErrorHelper("Inserire 16 cifre")
    }
  }


  return (
    <Container>
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        <Grid>
          <Item sx={{ textAlign: 'left' }}>
            <Typography variant="h4">Paga</Typography>
          </Item>
          <Item sx={{ textAlign: 'left' }}>
            <Typography variant="overline">Inserisci i dati di pagamento</Typography>
          </Item>
        </Grid>
        <Stack spacing={6} >
          <TextField
            type='number'
            sx={{ width: "30vw" }}
            id="noticeNumber"
            name="noticeNumber"
            label="Numero avviso"
            variant="outlined"
            value={paymentNoticeNumber}
            onChange={onChange}
            error={paymentNoticeNumberError}
            helperText={paymentNoticeNumberHelper}
            required
          />
          <TextField
            sx={{ width: "30vw" }}
            id="taxCode"
            name="taxCode"
            label="Codice fiscale"
            variant="outlined"
            onChange={onChange}
            value={taxCode}
            error={taxCodeError}
            helperText={taxCodeHelper}
            required />
          <FormControl sx={{ width: "30vw" }}>
            <InputLabel id="terminal">Terminale</InputLabel>
            <Select
              labelId="terminal"
              id="terminal"
              name="terminal"
              value={selectedTerminal}
              label="Terminale"
              onChange={(e) => { setSelectedTerminal(e.target.value) }}
            >
              <MenuItem value={"-"}>-</MenuItem>
              {
                terminals.map((term, index) => {
                  return (
                    <MenuItem value={term.terminalId}>{term.terminalLabel}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
          <Button variant="contained" onClick={activatePayment} sx={{ width: "30vw" }}>Attiva pagamento </Button>
        </Stack>
      </Box>
    </Container>

  );
}

export default Paga;
