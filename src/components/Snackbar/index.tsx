import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertColor } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
export default function SimpleSnackbar({
	status,
	open,
	setOpen,
	message,
}: {
	status: AlertColor;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	message: string;
}) {
	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	return (
		<div>
			<Snackbar
				sx={{
					bottom: '40vh !important',
					left: '42.5vw !important',
				}}
				open={open}
				onClose={handleClose}
				action={action}
				autoHideDuration={2000}
			>
				<Alert
					sx={{
						background:
							status === 'success'
								? theme.palette.success.main
								: theme.palette.error.main,
					}}
					severity={status}
				>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}
