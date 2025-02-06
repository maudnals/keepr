import { useState } from "react";
import keeprLogo from "./assets/keepr.svg";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import PersonsListComponent from "./components/PersonsListComponent";
import { createPersonFromConnection } from "./utils/utils";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [overduePersons, setOverduePersons] = useState([]);
  const [onTrackPersons, setOnTrackPersons] = useState([]);
  const [displayTextAuthButton, setDisplayTextAuthButton] =
    useState("authorize");
  const [showSignoutButton, setShowSignoutButton] = useState(false);
  const [localParams] = useState({
    tokenClient: tokenClient,
    gapi: gapi,
    google: google,
  });

  async function getConnections() {
    let response;
    try {
      response = await localParams.gapi.client.people.people.connections.list({
        resourceName: "people/me",
        pageSize: 100,
        personFields:
          "names,emailAddresses,coverPhotos,phoneNumbers,clientData,birthdays,userDefined",
      });
    } catch (err) {
      throw new Error(err.message);
    }
    const connections = response.result.connections;
    return connections;
  }

  function getSortedOverduePersonsFromPersons(persons: Person[]): Person[] {
    return (
      persons
        // Only keep persons for which the check-in is overdue
        .filter((p: Person) => p.isCheckinOverdue)
        // Order by overdue ratio (greater overdue ratios first)
        .sort((p1: Person, p2: Person) => p2.overdueRatio - p1.overdueRatio)
    );
  }

  function getSortedOnTrackPersonsFromPersons(persons: Person[]): Person[] {
    return (
      persons
        // Only keep persons for which the check-in is not overdue
        .filter((p: Person) => !p.isCheckinOverdue)
        // Order by # days until next check-in (lesser # first)
        .sort((p1: Person, p2: Person) => -(p2.diff - p1.diff))
    );
  }

  async function setData() {
    const connections = await getConnections();
    if (!connections || connections.length === 0) {
      return;
    }
    const now = Date.now();
    const persons: Person[] = connections
      .map((c: Connection) => createPersonFromConnection(c, now))
      .filter((p: Person) => p !== null);
    setOverduePersons(getSortedOverduePersonsFromPersons(persons));
    setOnTrackPersons(getSortedOnTrackPersonsFromPersons(persons));
  }

  function authenticateAndSetData() {
    localParams.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      updateDisplay("refresh", true);
      await setData();
    };
    if (localParams.gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      localParams.tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      localParams.tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  function signout() {
    const token = localParams.gapi.client.getToken();
    if (token !== null) {
      localParams.google.accounts.oauth2.revoke(token.access_token);
      localParams.gapi.client.setToken("");
      updateDisplay("authorize", false);
      resetData();
    }
  }

  function resetData() {
    setOnTrackPersons([]);
    setOverduePersons([]);
  }

  function updateDisplay(authButtonText: string, showSignoutButton: boolean) {
    setDisplayTextAuthButton(authButtonText);
    setShowSignoutButton(showSignoutButton);
  }

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div>
          <a>
            <img src={keeprLogo} className="logo keepr" alt="Keepr logo" />
          </a>
        </div>
        <h1>keepr</h1>
        <Grid container spacing={2}>
          <Grid size={6}>
            {localParams.tokenClient && localParams.gapi ? (
              <div>
                <Button onClick={authenticateAndSetData} variant="contained">
                  {displayTextAuthButton}
                </Button>
              </div>
            ) : (
              <div>Not ready</div>
            )}
          </Grid>
          <Grid size={6}>
            {showSignoutButton && (
              <Button onClick={signout} variant="contained">
                Sign out
              </Button>
            )}
          </Grid>
        </Grid>
        <PersonsListComponent
          personsList={overduePersons}
          listTitle={"Overdue"}
          listTitleColor={"error"}
          emptyStateText={"No one overdue"}
          columnHeaders={["Name", "Overdue by", "Target check-in frequency"]}
        />
        <PersonsListComponent
          personsList={onTrackPersons}
          listTitle={"On track"}
          listTitleColor={"success"}
          emptyStateText={"No one on track"}
          columnHeaders={[
            "Name",
            "# Days until check-in",
            "Target check-in frequency",
          ]}
        />
      </ThemeProvider>
    </>
  );
}

export default App;
