import { useEffect, useState } from "react";
import keeprLogo from "./assets/keepr.svg";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import PersonsListComponent from "./components/PersonsListComponent";
import { createPersonFromConnection } from "./utils/utils";
import { AUTH_BUTTON_TEXT } from "./strings";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  const [persons, setPersons] = useState([]);
  const [overduePersons, setOverduePersons] = useState([]);
  const [onTrackPersons, setOnTrackPersons] = useState([]);
  const [displayTextAuthButton, setDisplayTextAuthButton] = useState(
    AUTH_BUTTON_TEXT.authorize
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignoutButton, setShowSignoutButton] = useState(false);

  const [filterMode, setFilterMode] = useState(false);

  const [localParams] = useState({
    tokenClient: tokenClient,
    gapi: gapi,
    google: google,
  });

  useEffect(() => {
    if (searchQuery) {
      setFilterMode(true);
    } else {
      setFilterMode(false);
    }
    filterPersons();
  }, [searchQuery, persons]);

  function exitFilterMode() {
    setSearchQuery("");
  }

  async function getConnections() {
    let response;
    try {
      // Parameters: https://developers.google.com/people/api/rest/v1/people.connections/list
      response = await localParams.gapi.client.people.people.connections.list({
        resourceName: "people/me",
        // 1000 is the max
        pageSize: 1000,
        // Sort people by when they were updated; newer entries first
        sortOrder: "LAST_MODIFIED_DESCENDING",
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

  function filterPersons() {
    const userSearch = searchQuery.trim().toLowerCase();
    const filteredOutPersons = persons.filter((p: Person) =>
      p.name.trim().toLowerCase().includes(userSearch)
    );
    setOverduePersons(getSortedOverduePersonsFromPersons(filteredOutPersons));
    setOnTrackPersons(getSortedOnTrackPersonsFromPersons(filteredOutPersons));
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
    setPersons(persons);
    setOverduePersons(getSortedOverduePersonsFromPersons(persons));
    setOnTrackPersons(getSortedOnTrackPersonsFromPersons(persons));
  }

  function authenticateAndSetData() {
    localParams.tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      updateDisplay(AUTH_BUTTON_TEXT.refresh, true);
      await setData();
    };
    if (localParams.gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session
      localParams.tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session
      localParams.tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  function signout() {
    const token = localParams.gapi.client.getToken();
    if (token !== null) {
      localParams.google.accounts.oauth2.revoke(token.access_token);
      localParams.gapi.client.setToken("");
      updateDisplay(AUTH_BUTTON_TEXT.authorize, false);
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
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <div>
          <a>
            <img src={keeprLogo} className="logo keepr" alt="Keepr logo" />
          </a>
        </div>
        <h1>keepr</h1>
        <div className="sign-in">
          {localParams.tokenClient && localParams.gapi ? (
            <div>
              <Button onClick={authenticateAndSetData} variant="contained">
                {displayTextAuthButton}
              </Button>
            </div>
          ) : (
            <div>Not ready</div>
          )}
          {showSignoutButton && (
            <div>
              <Button onClick={signout} variant="contained">
                Sign out
              </Button>
            </div>
          )}
        </div>
        {/* Only show the UI when Authorized has been clicked i.e. a valid token is available */}
        {localParams.gapi.client.getToken() && (
          <>
            <Grid
              container
              spacing={1}
              sx={{
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Grid size={11}>
                <TextField
                  id="outlined-basic"
                  label="Search by name"
                  variant="outlined"
                  size="medium"
                  value={searchQuery}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const userInput = event.target.value;
                    if (userInput.trim() === "") {
                      // Ensure the query can't be a series of spaces
                      setSearchQuery("");
                    } else {
                      setSearchQuery(event.target.value);
                    }
                  }}
                />
              </Grid>
              <Grid size={1}>
                {filterMode && (
                  <IconButton
                    onClick={exitFilterMode}
                    aria-label="close"
                    color="error"
                  >
                    <Close />
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <PersonsListComponent
              updateData={authenticateAndSetData}
              personsList={overduePersons}
              listTitle={"To check-in with"}
              status={"error"}
              emptyStateText={"No one"}
            />

            <PersonsListComponent
              updateData={authenticateAndSetData}
              personsList={onTrackPersons}
              listTitle={"On track"}
              status={"success"}
              emptyStateText={"No one"}
            />
          </>
        )}
      </ThemeProvider>
    </>
  );
}

export default App;
