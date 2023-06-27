import React, { ChangeEventHandler, useEffect, useState } from 'react';
import Snackbar from '../../components/Snackbar';
import {
	Typography,
	FormHelperText,
	Box,
	Stack,
	Paper,
	styled,
	TextField,
	Grid,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
	Container,
	Button,
	SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import utils from '../../utils';
export interface Terminals {
	subscribers: [Terminal];
}

export interface Terminal {
	acquirerId: string;
	channel: string;
	merchantId: string;
	terminalId: string;
	paTaxCode: string;
	subscriberId: string;
	label: string;
	subscriptionTimestamp: string;
	lastUsageTimestamp: string;
}

export const Paga = () => {
	const [selectedTerminal, setSelectedTerminal] = useState('-');
	const [terminals, setTerminals] = useState<Terminals | { subscribers: [] }>({
		subscribers: [],
	});
	const [paymentNoticeNumber, setPaymentNoticeNumber] = useState('');
	const [noticeTaxCode, setNoticeTaxCode] = useState('');
	const [paTaxCode, setPaTaxCode] = useState('00139860050');
	const [paymentNoticeNumberError, setPaymentNoticeNumberError] =
		useState(false);
	const [paymentNoticeNumberHelper, setPaymentNoticeNumberHelper] =
		useState('');
	const [taxCodeError, setTaxCodeError] = useState(false);
	const [taxCodeHelper, setTaxCodeErrorHelper] = useState('');
	const [terminalError, setTerminalError] = useState(false);
	const [terminalErrorHelper, setTerminalErrorHelper] = useState('');
	const [toastActive, setToastActive] = useState(false);
	const [toastStatus, setToastStatus] = useState('');
	const [toastMessage, setToastMessage] = useState('');
	const validateTaxCode = new RegExp('[0-9]{11}');
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (process.env.REACT_APP_IS_USING_MOCK === 'true') {
			setTerminals({
				subscribers: [
					{
						acquirerId: '4585625',
						channel: 'POS',
						merchantId: '28405fHfk73x88D',
						terminalId: '0aB9wXyZ',
						paTaxCode: '00139860050',
						subscriberId: 'x46tr3',
						label: 'Reception POS',
						subscriptionTimestamp: '2023-05-05T09:31:33',
						lastUsageTimestamp: '2023-05-08T10:55:57',
					},
				],
			});
		} else {
			getTerminals();
		}
	}, []);

	const getTerminals = async () => {
		await utils.checkTokenValidity();

		if (sessionStorage.getItem('access_token') === null) {
			setIsFetching(true);
			await axios
				.post(
					'https://mil-d-apim.azure-api.net/mil-auth/token',
					{
						grant_type: 'client_credentials',
						client_id: 'b9d189ec-fc47-4792-8018-db914057d964',
						client_secret: '3674f0e7-d717-44cc-a3bc-5f8f41771fea',
					},
					{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
				)
				.then((res) => {
					sessionStorage.setItem('access_token', res.data.access_token);
				})
				.catch((e) => {
					console.log(e);
				});
			setIsFetching(false);
		} else {
			setIsFetching(false);
		}
		try {
			setIsFetching(true);
			const data: any = await axios.get(
				process.env.REACT_APP_API_ADDRESS + '/terminals/' + paTaxCode,
				{
					headers: {
						Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
						RequestId: process.env.REACT_APP_REQUEST_ID,
					},
				}
			);
			setTerminals(data.data);
		} catch (e) {
			setToastActive(true);
			setToastStatus('error');
			setToastMessage('Errore!  ' + e);
		}
		setTimeout(() => {
			setIsFetching(false);
		}, 500);
	};
	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const name = e.target.name;
		const value = e.target.value;
		let reg;
		switch (name) {
			case 'noticeNumber':
				reg = new RegExp('(^[0-9]{0,18}$|^$)');
				if (!reg.test(value)) {
					return;
				}
				setPaymentNoticeNumber(value);
				if (value === '') {
					setPaymentNoticeNumberError(true);
					setPaymentNoticeNumberHelper('Campo obbligatorio');
				} else if (value.length !== 18) {
					setPaymentNoticeNumberError(true);
					setPaymentNoticeNumberHelper('Inserire 18 cifre');
				} else {
					setPaymentNoticeNumberError(false);
					setPaymentNoticeNumberHelper('');
				}
				break;
			case 'taxCode':
				reg = new RegExp('(^[0-9]{0,11}$|^$)');
				if (!reg.test(value)) {
					return;
				}
				setNoticeTaxCode(value);
				if (value === '') {
					setTaxCodeError(true);
					setTaxCodeErrorHelper('Campo obbligatorio');
				} else if (value.length !== 11) {
					setTaxCodeError(true);
					setTaxCodeErrorHelper('Inserire 11 cifre');
				} else if (!validateTaxCode.test(value)) {
					setTaxCodeError(true);
					setTaxCodeErrorHelper('Codice ente errato');
				} else {
					setTaxCodeError(false);
					setTaxCodeErrorHelper('');
				}
				break;
			default:
				break;
		}
	};

	const onChangeSelect = (e: SelectChangeEvent<string>) => {
		const value = e.target.value;
		setSelectedTerminal(value);
		if (value === '-') {
			setTerminalError(true);
			setTerminalErrorHelper('Campo obbligatorio');
		} else {
			setTerminalError(false);
			setTerminalErrorHelper('');
		}
	};
	const activatePayment = async () => {

		if (paymentNoticeNumber === '') {
			setPaymentNoticeNumberError(true);
			setPaymentNoticeNumberHelper('Campo obbligatorio');
		} else if (paymentNoticeNumber.length !== 18) {
			setPaymentNoticeNumberError(true);
			setPaymentNoticeNumberHelper('Inserire 18 cifre');
		}

		if (noticeTaxCode === '') {
			setTaxCodeError(true);
			setTaxCodeErrorHelper('Campo obbligatorio');
		} else if (noticeTaxCode.length !== 11) {
			setTaxCodeError(true);
			setTaxCodeErrorHelper('Inserire 11 cifre');
		}

		if (selectedTerminal === '-') {
			setTerminalError(true);
			setTerminalErrorHelper('Campo obbligatorio');
			return;
		}

		if (terminalError || taxCodeError || paymentNoticeNumberError) {
			return;
		} else {
			const selectedTerminalObject: Terminal[] = terminals.subscribers.filter(
				(term) => term.terminalId === selectedTerminal
			);

			try {
				await utils.checkTokenValidity();
				setIsFetching(true);
				const res = await axios.post(
					process.env.REACT_APP_API_ADDRESS + '/presets',
					{
						operationType: 'PAYMENT_NOTICE',
						paTaxCode: paTaxCode,
						subscriberId: selectedTerminalObject[0]?.subscriberId,
						noticeTaxCode: noticeTaxCode,
						noticeNumber: paymentNoticeNumber,
					},
					{
						headers: {
							Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
							RequestId: process.env.REACT_APP_REQUEST_ID,
						},
					}
				);
				if (res.status === 200 || res.status === 201) {
					setSelectedTerminal('-');
					setNoticeTaxCode('');
					setPaymentNoticeNumber('');
					setToastActive(true);
					setToastStatus('success');
					setToastMessage('Pagamento attivato!');
				} else {
					setToastActive(true);
					setToastStatus('error');
					setToastMessage('Pagamento non riuscito!');
				}
			} catch (e) {
				setToastActive(true);
				setToastStatus('error');
				setToastMessage('Pagamento non riuscito!');
			}
			setTimeout(() => {
				setIsFetching(false);
			}, 500);
		}
	};

	return (
		<>
			{isFetching ? <LoadingSpinner /> : ''}
			<Container>
				{toastStatus === 'success' ? (
					<Snackbar
						status={'success'}
						message={toastMessage}
						open={toastActive}
						setOpen={setToastActive}
					/>
				) : (
					''
				)}
				{toastStatus === 'error' ? (
					<Snackbar
						status={'error'}
						message={toastMessage}
						open={toastActive}
						setOpen={setToastActive}
					/>
				) : (
					''
				)}
				<Box sx={{ width: '100%', maxWidth: 1000 }}>
					<Grid>
						<Item sx={{ textAlign: 'left' }}>
							<Typography variant="h4">Paga</Typography>
						</Item>
						<Item sx={{ textAlign: 'left' }}>
							<Typography variant="overline">
								Inserisci i dati di pagamento
							</Typography>
						</Item>
					</Grid>
					<Stack spacing={6}>
						<TextField
							type="text"
							sx={{ width: '40vw' }}
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
							type="text"
							sx={{ width: '40vw' }}
							id="taxCode"
							name="taxCode"
							label="Codice ente"
							variant="outlined"
							onChange={onChange}
							value={noticeTaxCode}
							error={taxCodeError}
							helperText={taxCodeHelper}
							required
						/>
						<FormControl sx={{ width: '40vw' }}>
							<InputLabel id="terminal" error={terminalError}>
								Terminale
							</InputLabel>
							<Select
								labelId="terminal"
								id="terminal"
								name="terminal"
								value={selectedTerminal}
								label="Terminale"
								onChange={onChangeSelect}
								error={terminalError}
							>
								<MenuItem disabled value={'-'}>
									Scegli un terminale...
								</MenuItem>
								{terminals.subscribers?.map((term: Terminal, index: number) => {
									return (
										<MenuItem value={term.terminalId}>{term.label}</MenuItem>
									);
								})}
							</Select>
							<FormHelperText error>{terminalErrorHelper}</FormHelperText>
						</FormControl>
						<Button
							variant="contained"
							onClick={activatePayment}
							sx={{ width: '40vw' }}
						>
							Attiva pagamento{' '}
						</Button>
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default Paga;
