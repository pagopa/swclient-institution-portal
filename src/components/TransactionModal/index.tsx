import {
	Box,
	Chip,
	CircularProgress,
	Modal,
	Stack,
	Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

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

export const StatusChip = ({ status }: { status: string | undefined }) => {
	/* StatusChip comoponent, depending on the status, return a different type of Chip, had to 
use this switch because if I put a variable for the color it would give me an error. */
	let statusLabel;
	switch (status) {
		case 'PRE_CLOSE':
			statusLabel = 'Operazione in sospeso';
			return <Chip label={statusLabel || ''} color={'info'} />;
			break;
		case 'PENDING':
			statusLabel = 'Operazione in sospeso';
			return <Chip label={statusLabel || ''} color={'info'} />;
			break;
		case 'ERROR_ON_CLOSE':
			statusLabel = 'Operazione da rimborsare';
			return <Chip label={statusLabel || ''} color={'error'} />;
			break;
		case 'ERROR_ON_RESULT':
			statusLabel = 'Operazione da rimborsare';
			return <Chip label={statusLabel || ''} color={'error'} />;
			break;
		case 'ERROR_ON_PAYMENT':
			statusLabel = 'Operazione fallita';
			return <Chip label={statusLabel || ''} color={'error'} />;
			break;
		case 'CLOSED':
			statusLabel = 'Eseguita';
			return <Chip label={statusLabel || ''} color={'success'} />;

			break;
		default:
			return <>-</>;
			break;
	}
};

const Index = ({
	modalOpen,
	setModalOpen,
	selectedTransaction,
	closable = true,
	loading = false,
}: {
	modalOpen: boolean;
	setModalOpen: Function;
	selectedTransaction: Row;
	closable?: boolean;
	loading?: boolean;
}) => {
	return (
		<Modal
			open={modalOpen}
			onClose={() => {
				if (closable === true) {
					setModalOpen(false);
				}
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
					Dettagli transazione
				</Typography>
				{loading ? (
					<Stack
						sx={{ alignItems: 'center', marginTop: '5vh', marginBottom: '5vh' }}
					>
						<CircularProgress sx={{ alignContent: 'center' }} />
					</Stack>
				) : (
					<Stack>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							<b>Data: </b>
							{selectedTransaction?.statusTimestamp?.getDate() +
								' ' +
								selectedTransaction?.statusTimestamp?.toLocaleString(
									'default',
									{
										month: 'long',
									}
								) +
								' ' +
								selectedTransaction?.statusTimestamp?.getFullYear() +
								', ' +
								(selectedTransaction?.statusTimestamp?.getHours() > 9
									? selectedTransaction?.statusTimestamp?.getHours()
									: '0' + selectedTransaction?.statusTimestamp?.getHours()) +
								':' +
								(selectedTransaction?.statusTimestamp?.getMinutes() > 9
									? selectedTransaction?.statusTimestamp?.getMinutes()
									: '0' + selectedTransaction?.statusTimestamp?.getMinutes())}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							<b>Id transazione: </b> {selectedTransaction?.transactionId}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							<b>Codice avviso: </b>
							{selectedTransaction?.noticeNumber.slice(0, 4) +
								' ' +
								selectedTransaction?.noticeNumber.slice(4, 8) +
								' ' +
								selectedTransaction?.noticeNumber.slice(8, 12) +
								' ' +
								selectedTransaction?.noticeNumber.slice(12, 16) +
								' ' +
								selectedTransaction?.noticeNumber.slice(16, 18)}
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
							<b>Commissione: </b>
							{selectedTransaction?.fee !== '-'
								? selectedTransaction?.fee + ' €'
								: ' -'}{' '}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							<b>Importo avviso: </b>
							{selectedTransaction?.totalAmount !== '-'
								? selectedTransaction?.totalAmount + ' €'
								: ' -'}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							<b>Ammontare totale : </b>
							{selectedTransaction?.totalAmount !== '-'
								? (
										parseFloat(selectedTransaction?.totalAmount) +
										parseFloat(selectedTransaction?.fee)
								  ).toFixed(2) + ' €'
								: '-'}
						</Typography>
						<Typography id="modal-modal-description" sx={{ mt: 2 }}>
							<b>Stato: </b>
							{<StatusChip status={selectedTransaction?.status} />}
						</Typography>
					</Stack>
				)}
			</Box>
		</Modal>
	);
};

export default Index;
