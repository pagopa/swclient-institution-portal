import React, { useEffect, useState } from 'react';
import { theme } from '@pagopa/mui-italia';
import {
	Typography,
	Box,
	Stack,
	Paper,
	styled,
	Grid,
	Container,
	Modal,
	Button,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { StatusChip } from '../storico';
import LoadingSpinner from '../../components/LoadingSpinner';
import Snackbar from '../../components/Snackbar';

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

export const Dispositivi = () => {
	const [rows, setRows] = useState([]);
	const [paTaxCode, setPaTaxCode] = useState('00139860050');
	const [selectedTerminal, setSelectedTerminal] = useState<any>(null);
	const [terminals, setTerminals] = useState<Terminals | { subscribers: [] }>({
		subscribers: [],
	});
	const [modalOpen, setModalOpen] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [toastActive, setToastActive] = useState(false);
	const [toastStatus, setToastStatus] = useState('');
	const [toastMessage, setToastMessage] = useState('');

	const columns: GridColDef[] = [
		{
			field: 'terminalId',
			headerName: 'POS',
			type: 'string',
			width: 200,
			sortable: true,
		},
		{
			field: 'label',
			headerName: 'Descrizione',
			width: 200,
			sortable: true,
			type: 'string',
		},
		{
			field: 'lastOperation',
			headerName: 'Data ultima operazione',
			width: 180,
			type: 'string',
		},
		{
			field: 'action',
			headerName: 'Azioni',
			width: 90,
			renderCell: (row) => {
				return (
					<DeleteIcon
						sx={{ cursor: 'pointer' }}
						onClick={() => {
							setModalOpen(true);
							setSelectedTerminal(row);
						}}
					/>
				);
			},
		},
	];

	useEffect(() => {
		if (!modalOpen) {
			setSelectedTerminal(false);
		}
	}, [modalOpen]);

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
		setIsFetching(true);

		try {
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

	const deleteTerminal = async () => {
		setIsFetching(true);
		try {
			await axios.delete(
				process.env.REACT_APP_API_ADDRESS +
					'/terminals/' +
					paTaxCode +
					'/' +
					selectedTerminal.row.subscriberId,
				{
					headers: {
						Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
						RequestId: process.env.REACT_APP_REQUEST_ID,
					},
				}
			);
			setModalOpen(false);
			getTerminals();
		} catch (e) {
			setToastActive(true);
			setToastStatus('error');
			setToastMessage('Errore! ' + e);
			setModalOpen(false);
		}
		setTimeout(() => {
			setIsFetching(false);
		}, 500);
	};

	useEffect(() => {
		let r: any = [];
		terminals.subscribers.map((t, i) => {
			r.push({
				id: i,
				terminalId: t.terminalId,
				label: t.label,
				subscriberId: t.subscriberId,
				lastOperation: t.lastUsageTimestamp
					? new Date(t.lastUsageTimestamp).toLocaleDateString()
					: '-',
			});
		});

		console.log(r);
		setRows(r);
	}, [terminals]);

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

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));

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
					{modalOpen ? (
						<Modal
							open={modalOpen}
							onClose={() => {
								setModalOpen(false);
							}}
							aria-labelledby="child-modal-title"
							aria-describedby="child-modal-description"
						>
							<Box
								sx={{
									position: 'absolute' as 'absolute',
									top: '50%',
									left: '50%',
									borderRadius: '1%',
									transform: 'translate(-50%, -50%)',
									width: 600,
									bgcolor: 'background.paper',
									boxShadow: 24,
									p: 4,
								}}
							>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Sei sicuro di voler eliminare questo terminale?
								</Typography>
								<div style={{ marginTop: '2.5vh' }}>
									<Button
										onClick={() => {
											deleteTerminal();
										}}
									>
										Sì
									</Button>
									<Button
										onClick={() => {
											setModalOpen(false);
										}}
									>
										No
									</Button>
								</div>
							</Box>
						</Modal>
					) : (
						''
					)}
					<Grid>
						<Item sx={{ textAlign: 'left' }}>
							<Typography variant="h4">Dispositivi</Typography>
						</Item>
					</Grid>
					<Stack spacing={6} style={{ marginTop: '2vh' }}>
						{rows.length > 0 ? (
							<DataGrid
								rows={rows}
								localeText={{
									MuiTablePagination: {
										labelDisplayedRows: ({ from, to, count }) =>
											`${from} - ${to} di ${count}`,
										labelRowsPerPage: <>Righe per pagina</>,
									},
								}}
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
									},
									width: '45vw',
								}}
							/>
						) : (
							<div style={{ marginTop: '4vh', marginLeft: '-17.5vw' }}>
								<Typography variant="subtitle1">
									Non risulta alcun dispositivo attivo
								</Typography>
							</div>
						)}
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default Dispositivi;
