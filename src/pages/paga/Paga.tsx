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
import utils from '../../utils/utils';
import { useInterval } from '../../utils/useInterval';
import TransactionModal from '../../components/TransactionModal';
import { Await } from 'react-router-dom';
export interface Terminals {
	subscribers: [Terminal];
}

export interface Row {
	id: number;
	transactionId: string;
	noticeNumber: string;
	statusTimestamp: Date;
	amount: string | number;
	status: string;
	paTaxCode: string;
	description: string;
	company: string;
	office: string;
	fee: string;
	totalAmount: string;
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
	const [modalOpen, setModalOpen] = useState(false);
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
	const [isPolling, setIsPolling] = useState(false);
	const [pollingCounter, setPollingCounter] = useState(0);
	const [latestTransaction, setLatestTransaction] = useState<Row>({
		id: 0,
		transactionId: 'string',
		noticeNumber: 'string',
		statusTimestamp: new Date(),
		amount: 'string | number',
		status: 'string',
		paTaxCode: 'string',
		description: 'string',
		company: 'string',
		office: 'string',
		fee: 'string',
		totalAmount: 'string',
	});

	const getLatestTransaction = async () => {
		if (selectedTerminal === '-') {
			return;
		}
		try {

			const selectedTerminalObject: Terminal[] = terminals.subscribers.filter(
				(term) => term.terminalId === selectedTerminal
			);
			await utils.checkTokenValidity();

			const data: any = await axios.get(
				process.env.REACT_APP_API_ADDRESS +
				'/presets/' +
				paTaxCode +
				'/' +
				selectedTerminalObject[0]?.subscriberId,
				{
					headers: {
						Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
						RequestId: process.env.REACT_APP_REQUEST_ID,
					},
				}
			);
			const element =
				data.data.presets[
				data.data.presets.length - 1
				]; /* I get the latest transaction, which is the last one from the list of all transaction */

			const trans = {
				id: 0,
				transactionId: element?.statusDetails?.transactionId || '-',
				noticeNumber: element?.noticeNumber || '-',
				statusTimestamp: new Date(element?.statusTimestamp) || '-',
				amount:
					typeof element?.statusDetails?.notices[0].amount === 'number'
						? (element?.statusDetails?.notices[0].amount / 100).toFixed(2)
						: '-',
				status: element?.statusDetails?.status || '-',
				paTaxCode: element?.paTaxCode || '-',
				description: element?.statusDetails?.notices[0].description || '-',
				company: element?.statusDetails?.notices[0].company || '-',
				office: element?.statusDetails?.notices[0].office || '-',
				fee:
					typeof element?.statusDetails?.fee === 'number'
						? (element?.statusDetails?.fee / 100).toFixed(2)
						: '-',
				totalAmount:
					typeof element?.statusDetails?.totalAmount === 'number'
						? (element?.statusDetails?.totalAmount / 100).toFixed(2)
						: '-',
			};
			await setLatestTransaction(trans);
			setModalOpen(true);
		} catch (e) {
			setToastActive(true);
			setToastStatus('error');
			setToastMessage('Errore! ' + e);
		}
	};

	const getTerminals = async () => {
		await utils.checkTokenValidity(); //Check if token is valid, if not, or if token is null, get a new token

		if (sessionStorage.getItem('access_token') === null) {
			setIsFetching(true); //if is fetching then in the JSX the loading spinner will be shown
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
			console.log(e);
			setToastActive(
				true
			); /* If an exception is thrown activate the toast, set its status to error and show an error message */
			setToastStatus('error');
			setToastMessage('Errore!  ' + e);
		}
		setTimeout(() => {
			/* Show the spinner for 0.5s more than the API call, otherwise it would be seen as a flash most of the time*/
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
					/* Again, if after the API call, only one terminal is present, set it as the selected one */
					setNoticeTaxCode('');
					setPaymentNoticeNumber('');
					setToastActive(true);
					setToastStatus('success');
					setIsPolling(true);
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
			}, 2000);
		}
	};

	useEffect(() => {
		if (process.env.REACT_APP_IS_USING_MOCK === 'true') {
			/* If mocking use this data, otherwise call the API */
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

	useEffect(() => {
		if (terminals.subscribers?.length == 1) {
			setSelectedTerminal(
				terminals.subscribers[0].terminalId
			); /* If only one terminal is present, then set it as the seelcted terminal*/
		}
	}, [terminals]);

	useInterval(
		() => {
			getLatestTransaction();
			setPollingCounter(pollingCounter + 1);
			if (pollingCounter >= 30 || latestTransaction.status === 'CLOSED') {
				setIsPolling(false);
				setPollingCounter(0);
				if (terminals.subscribers?.length > 1) {
					setSelectedTerminal('-');
				} else {
					if (terminals.subscribers[0]) {
						setSelectedTerminal(terminals.subscribers[0].terminalId);
					}
				}

			} /* Activate polling every 2 seconds to check the transaction status,
			 after 10 times (20 seconds) if nothing has changed and the status still isn't CLOSED, stop polling and resets the polling counter*/
		},
		isPolling ? 2000 : null
	);

	return (
		<>
			{isFetching ? <LoadingSpinner /> : ''}
			<Container>
				{
					<TransactionModal
						modalOpen={modalOpen}
						setModalOpen={setModalOpen}
						selectedTransaction={latestTransaction}
						closable={!isPolling}
						loading={isPolling}
					/>
				}
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
								{terminals.subscribers.length > 1 && (
									<MenuItem value={'-'}>{'Seleziona un terminale...'}</MenuItem>
								)}

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
							Attiva pagamento
						</Button>
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default Paga;
