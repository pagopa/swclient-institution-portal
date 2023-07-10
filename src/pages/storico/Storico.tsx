import React, { ChangeEventHandler, useEffect, useState } from 'react';

import {
	Typography,
	Button,
	FormHelperText,
	Box,
	Stack,
	Paper,
	styled,
	Grid,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
	Container,
	TableHead,
	TableRow,
	TableCell,
	SelectChangeEvent,
	TableContainer,
	Table,
	TableBody,
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { parse } from 'path';
import Snackbar from '../../components/Snackbar';
import utils from '../../utils/utils';
import TransactionModal from '../../components/TransactionModal';

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

export interface Operation {
	operationType: string;
	paTaxCode: string;
	subscriberId: string;
	noticeTaxCode: string;
	noticeNumber: string;
	presetId: string;
	creationTimestamp: string;
	status: string;
	statusTimestamp: string;
	statusDetails: {
		transactionId: string;
		acquirerId: string;
		channel: string;
		merchantId: string;
		terminalId: string;
		insertTimestamp: string;
		notices: [
			{
				paymentToken: string;
				paTaxCode: string;
				noticeNumber: string;
				amount: string | number;
				description: string;
				company: string;
				office: string;
			}
		];
		totalAmount: string;
		fee: string;
		status: string;
	};
}
export interface TerminalHistory {
	presets: [Operation];
}



export const Storico = () => {
	const [selectedTerminal, setSelectedTerminal] = useState('-');
	const [selectedTransaction, setSelectedTransaction] = useState<Row>();
	const [terminals, setTerminals] = useState<Terminals | { subscribers: [] }>({
		subscribers: [],
	});
	const [terminalError, setTerminalError] = useState(false);
	const [terminalErrorHelper, setTerminalErrorHelper] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [paTaxCode, setPaTaxCode] = useState('00139860050');
	const [isFetching, setIsFetching] = useState(true);
	const [toastMessage, setToastMessage] = useState('');
	const [toastStatus, setToastStatus] = useState('');
	const [toastActive, setToastActive] = useState(false);
	const [terminalHistory, setTerminalHistory] =
		useState<TerminalHistory | null>(null);

	const openModal = (row: Row) => {
		setModalOpen(true);
		if (typeof row.fee === 'number') {
			row.fee = (parseFloat(row.fee) / 100).toFixed(2);
		}
		if (typeof row.totalAmount === 'number') {
			row.totalAmount = (parseFloat(row.totalAmount) / 100).toFixed(2);
		}
		setSelectedTransaction(row);
	};

	const [rows, setRows] = useState([{}]);

	const getTerminals = async () => {
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
			await utils.checkTokenValidity();

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
			setToastMessage('Errore! ' + e);
		}
		setTimeout(() => {
			setIsFetching(false);
		}, 500);
	};

	const getTerminalHistory = async () => {
		if (selectedTerminal === '-') {
			return;
		}
		try {
			const selectedTerminalObject: Terminal[] = terminals.subscribers.filter(
				(term) => term.terminalId === selectedTerminal
			);
			await utils.checkTokenValidity();

			setIsFetching(true);
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
			setTerminalHistory(data.data);
		} catch (e) {
			setToastActive(true);
			setToastStatus('error');
			setToastMessage('Errore! ' + e);
		}
		setTimeout(() => {
			setIsFetching(false);
		}, 500);
	};

	useEffect(() => {
		let row: Row[] = [];
		terminalHistory?.presets?.map((element, index) => {
			row.push({
				id: index,
				transactionId: element?.statusDetails?.transactionId || '-',
				noticeNumber: element?.noticeNumber || '-',
				statusTimestamp: new Date(element?.statusTimestamp) || '-',
				amount:
					typeof element?.statusDetails?.notices[0].amount === 'number'
						? (element?.statusDetails?.notices[0].amount / 100).toFixed(2) +
						' €'
						: '-',
				status: element?.statusDetails?.status || '-',
				paTaxCode: element?.paTaxCode || '-',
				description: element?.statusDetails?.notices[0].description || '-',
				company: element?.statusDetails?.notices[0].company || '-',
				office: element?.statusDetails?.notices[0].office || '-',
				fee: element?.statusDetails?.fee || '-',
				totalAmount: element?.statusDetails?.totalAmount || '-',
			});
		});

		setRows(row);
	}, [terminalHistory]);

	const columns: GridColDef[] = [
		{
			field: 'transactionId',
			headerName: 'Numero transazione',
			type: 'string',
			width: 150,
			sortable: true,
		},
		{
			field: 'noticeNumber',
			headerName: 'Codice  avviso',
			type: 'number',
			width: 200,
			sortable: true,
		},
		{
			field: 'statusTimestamp',
			headerName: 'Data',
			width: 130,
			sortable: true,
			type: 'date',
		},
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
				return (
					<Button
						variant="outlined"
						onClick={() => {
							openModal(row);
						}}
						sx={{ width: '75%', height: '50%' }}
					>
						Dettagli
					</Button>
				);
			},
		},
	];

	useEffect(() => {
		getTerminalHistory();
	}, [selectedTerminal]);

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
	}, [sessionStorage.getItem('access_token')]);

	useEffect(() => {
		if (terminals.subscribers?.length == 1) {
			setSelectedTerminal(
				terminals.subscribers[0].terminalId
			); /* If only one terminal is present, then set it as the seelcted terminal*/
		}
	}, [terminals]);

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
		if (value === '-') {
			setTerminalError(true);
			setTerminalErrorHelper('Campo obbligatorio');
		} else {
			setTerminalError(false);
			setTerminalErrorHelper('');
		}
	};

	return (
		<>
			{isFetching ? <LoadingSpinner /> : ''}
			<Container>
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
					{modalOpen && selectedTransaction ? (
						<TransactionModal modalOpen={modalOpen} setModalOpen={setModalOpen} selectedTransaction={selectedTransaction} />
					) : (
						''
					)}
					<Grid>
						<Item sx={{ textAlign: 'left' }}>
							<Typography variant="h4">Storico</Typography>
						</Item>
					</Grid>
					<Stack spacing={6} style={{ marginTop: '2vh' }}>
						<FormControl sx={{ width: '40vw', marginBottom: '2.5vh' }}>
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
									Scegli un terminale
								</MenuItem>
								{terminals.subscribers.map((term, index: number) => {
									return (
										<MenuItem value={term.terminalId} key={index}>
											{term.label}
										</MenuItem>
									);
								})}
							</Select>
							<FormHelperText error>{terminalErrorHelper}</FormHelperText>
						</FormControl>
						{selectedTerminal !== '-' &&
							terminalHistory?.presets &&
							terminalHistory?.presets?.length > 0 ? (
							<DataGrid
								rows={rows}
								columns={columns}
								initialState={{
									pagination: {
										paginationModel: { page: 0, pageSize: 5 },
									},
								}}
								localeText={{
									MuiTablePagination: {
										labelDisplayedRows: ({ from, to, count }) =>
											`${from} - ${to} di ${count}`,
										labelRowsPerPage: <>Righe per pagina</>,
									},
								}}
								sx={{
									borderColor: 'divider',
									'& .MuiDataGrid-cell:hover': {
										color: 'primary.main',
									},
									width: '60vw',
								}}
								pageSizeOptions={[5, 10]}
							/>
						) : (
							''
						)}
						{(!terminalHistory?.presets ||
							(terminalHistory?.presets &&
								terminalHistory?.presets?.length < 1)) &&
							selectedTerminal !== '-' &&
							!isFetching ? (
							<div style={{ marginTop: '4vh' }}>
								<Typography variant="subtitle1">
									Non risultano ancora operazioni per il terminale selezionato
								</Typography>
							</div>
						) : (
							''
						)}
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default Storico;
