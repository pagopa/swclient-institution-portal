import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
/* MUI Core Components */
import { VerticalNav } from './components/VerticalNav';
import { ThemeProvider } from "@mui/material";
import { HeaderAccount, Footer } from '@pagopa/mui-italia';
/* MUI Italia theme */
import { theme } from "@pagopa/mui-italia";



function App() {

  const [sections, setSections] = useState([{
    title: "Paga",
    path: "paga"
  },
  {
    title: "Storico",
    path: "storico"

  },
  {
    title: "Dispositivi",
    path: "dispositivo"

  }])

  useEffect(() => { console.log(sections) }, [sections])
  return (

    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderAccount rootLink={{
          label: "ASL Roma 2",
          href: "home",
          ariaLabel: "home",
          title: "ASL Roma 2",
        }}
          onAssistanceClick={() => { }}
          loggedUser={{
            id: "string",
            name: "Mario",
            surname: "Rossi",
            email: "string"
          }}
          enableDropdown={true}
          userActions={[{
            id: "string",
            icon: null,
            label: "Configurazione",
            onClick: () => { }
          }]}
        />
        <VerticalNav sections={sections} setSections={setSections} />
        <Routes>
          <Route path='/' element={<div>test</div>} />
          {
            sections.map((section, index) => {
              return (<>
                <Route path={"/" + section.path} element={<>{section.title}</>} />
              </>
              )
            })
          }
        </Routes>
        <Footer loggedUser={true}
          companyLink={{ href: "test", ariaLabel: "Company Link" }}
          currentLangCode={undefined}
          languages={{ it: { it: "Italiano" } }}
          onLanguageChanged={() => { }}
          postLoginLinks={[
            {
              label: "",
              href: "string",
              ariaLabel: "POSTLOG",
              linkType: "internal",
              onClick: () => { }
            }
          ]}
          preLoginLinks={{
            aboutUs: {
              links: [{
                label: "About us",
                ariaLabel: "string",
                linkType: "internal",
                onClick: () => { }
              }]
            },

            resources: {
              links: [{
                label: "Resources",
                ariaLabel: "string",
                linkType: "internal",
                onClick: () => { }
              }]
            },

            followUs: {
              title: "Follow us",
              socialLinks: [{
                icon: "string",
                /** the url to witch the user will be redirect */
                href: "string",
                title: "Social",
                ariaLabel: "Social",
                /** if defined it will override the href behavior */
                onClick: () => { }
              }],
              links: [{
                label: "string",
                ariaLabel: "string",
                linkType: "internal",
                onClick: () => { }
              }]
            }
          }}

          legalInfo={<><b>PagoPA S.p.A.</b> - Società per azioni con socio unico - Capitale sociale di euro 1,000,000 interamente versato - Sede legale in Roma, Piazza Colonna 370,
            CAP 00187 - N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009</>}
        />

      </div>
    </ThemeProvider>
  );
}

export default App;
