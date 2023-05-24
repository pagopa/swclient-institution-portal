import React, { ChangeEventHandler, useEffect, useState } from 'react';

import { Typography, FormHelperText, Box, Stack, Paper, styled, TextField, Grid, InputLabel, Select, MenuItem, FormControl, Container, Button, SelectChangeEvent } from '@mui/material';


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
  const [terminalError, setTerminalError] = useState(false);
  const [terminalErrorHelper, setTerminalErrorHelper] = useState("");

  const validateTaxCode = new RegExp("[0-9]{11}");

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

    const reg = new RegExp("[0-9]");
    if (!reg.test(value)) {
      return;
    }

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
        else if (value.length !== 11) {
          setTaxCodeError(true);
          setTaxCodeErrorHelper("Inserire 11 cifre");
        }
        else if (!validateTaxCode.test(value)) {
          setTaxCodeError(true);
          setTaxCodeErrorHelper("Codice ente errato")
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
  const activatePayment = () => {

    console.log(validateTaxCode.test(taxCode));
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
    else if (taxCode.length !== 11) {
      setTaxCodeError(true);
      setTaxCodeErrorHelper("Inserire 11cifre")
    }

    if (selectedTerminal === "-") {
      setTerminalError(true);
      setTerminalErrorHelper("Campo obbligatorio")
    }

    if (terminalError || taxCodeError || paymentNoticeNumberError) {
      return;
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
            type="number"
            sx={{ width: "30vw" }}
            id="taxCode"
            name="taxCode"
            label="Codice ente"
            variant="outlined"
            onChange={onChange}
            value={taxCode}
            error={taxCodeError}
            helperText={taxCodeHelper}
            required />
          <FormControl sx={{ width: "30vw" }}>
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
              <MenuItem disabled value={"-"}>Scegli un terminale...</MenuItem>
              {
                terminals.map((term, index) => {
                  return (
                    <MenuItem value={term.terminalId}>{term.terminalLabel}</MenuItem>
                  )
                })
              }
            </Select>
            <FormHelperText error>{terminalErrorHelper}</FormHelperText>
          </FormControl>
          <Button variant="contained" onClick={activatePayment} sx={{ width: "30vw" }}>Attiva pagamento </Button>
        </Stack>
      </Box>
    </Container>

  );
}

export default Paga;
