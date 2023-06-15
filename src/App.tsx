import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
	Routes,
	Route,
	Navigate,
	useLocation,
	matchRoutes,
	useParams,
	Params,
} from 'react-router-dom';
/* MUI Core Components */
import { VerticalNav } from './components/VerticalNav';
import { ThemeProvider } from '@mui/material';
import { HeaderAccount, Footer, HeaderProduct } from '@pagopa/mui-italia';
/* MUI Italia theme */
import { theme } from '@pagopa/mui-italia';
import { Paga } from './pages/paga';
import { Dispositivi } from './pages/dispositivi';
import { Storico } from './pages/storico';
import PaymentsIcon from '@mui/icons-material/Payments';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import HistoryIcon from '@mui/icons-material/History';
import { PartySwitchItem } from '@pagopa/mui-italia/dist/components/PartySwitch';


function App() {
	const getRoutePath = (location: any, params: Params): string => {
		const { pathname } = location;

		if (!Object.keys(params).length) {
			return pathname; // we don't need to replace anything
		}

		let path = pathname;
		Object.entries(params).forEach(([paramName, paramValue]) => {
			if (paramValue) {
				path = path.replace(paramValue, `:${paramName}`);
			}
		});
		return path;
	};

	const getCurrentPath = () => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const location = useLocation();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const params = useParams();
		const path = getRoutePath(location, params);
		return path.split('/')[1];
	};

	const [sections, setSections] = useState([
		{
			title: 'Paga',
			path: 'paga',
			active: true,
			element: <Paga />,
			icon: <PaymentsIcon />,
		},
		{
			title: 'Storico',
			path: 'storico',
			active: false,
			element: <Storico />,
			icon: <TabletAndroidIcon />,
		},
		{
			title: 'Dispositivi',
			path: 'dispositivo',
			active: false,
			element: <Dispositivi />,
			icon: <HistoryIcon />,
		},
	]);



	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<HeaderProduct productsList={[{
					id: "string",
					title: "PagoPA S.p.A",
					productUrl: "AAA",
					linkType: "internal"
				}]} partyList={[{
					id: "string",
					name: "ASL Roma 2",
					logoUrl: 'https://i2.wp.com/tiburno.tv/wp-content/uploads/2019/12/asl-roma-5-1-e1611159976843.jpg?fit=659%2C322&ssl=1'
				}]} />

				{/* <HeaderAccount
					rootLink={{
						label: 'ASL Roma 2',
						href: '',
						ariaLabel: 'home',
						title: 'ASL Roma 2',
					}}
					onAssistanceClick={() => { }}
					loggedUser={{
						id: 'string',
						name: 'Mario',
						surname: 'Rossi',
						email: 'string',
					}}
					enableDropdown={true}
					userActions={[
						{
							id: 'string',
							icon: null,
							label: 'Configurazione',
							onClick: () => { },
						},
					]}
				/>*/}
				<VerticalNav
					sections={sections}
					setSections={setSections}
					currentPath={getCurrentPath()}
				/>
				<div style={{ marginTop: '2vh' }}>
					<Routes>
						<Route path="/" element={<Navigate to="/paga" replace />} />
						{sections.map((section, index) => {
							return (
								<>
									<Route path={'/' + section.path} element={section.element} />
								</>
							);
						})}
					</Routes>
				</div>
				<div style={{ position: 'fixed', bottom: '0', width: '100%' }}>
					<Footer
						loggedUser={true}
						companyLink={{ href: 'test', ariaLabel: 'Company Link' }}
						currentLangCode={undefined}
						languages={{ it: { it: 'Italiano' } }}
						onLanguageChanged={() => { }}
						postLoginLinks={[
							{
								label: '',
								href: 'string',
								ariaLabel: 'POSTLOG',
								linkType: 'internal',
								onClick: () => { },
							},
						]}
						preLoginLinks={{
							aboutUs: {
								links: [
									{
										label: 'About us',
										ariaLabel: 'string',
										linkType: 'internal',
										onClick: () => { },
									},
								],
							},

							resources: {
								links: [
									{
										label: 'Resources',
										ariaLabel: 'string',
										linkType: 'internal',
										onClick: () => { },
									},
								],
							},

							followUs: {
								title: 'Follow us',
								socialLinks: [
									{
										icon: 'string',
										/** the url to witch the user will be redirect */
										href: 'string',
										title: 'Social',
										ariaLabel: 'Social',
										/** if defined it will override the href behavior */
										onClick: () => { },
									},
								],
								links: [
									{
										label: 'string',
										ariaLabel: 'string',
										linkType: 'internal',
										onClick: () => { },
									},
								],
							},
						}}
						legalInfo={
							<>
								<b>PagoPA S.p.A.</b> - Società per azioni con socio unico -
								Capitale sociale di euro 1,000,000 interamente versato - Sede
								legale in Roma, Piazza Colonna 370, CAP 00187 - N. di iscrizione
								a Registro Imprese di Roma, CF e P.IVA 15376371009
							</>
						}
					/>
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
