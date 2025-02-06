import { useState } from "react";
import keeprLogo from "./assets/keepr.svg";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import PersonsListComponent from "./components/PersonsListComponent";
import { inDays, keeprPpties, keeprPptiesNames } from "./utils/utils";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function getOverdueDetails(now, person) {
  const gapInMs = now - person.lastCheckin;
  // Use Math.floor to be lax on checkin (laxer than Math.ceiling)
  const gapInDays = Math.floor(gapInMs / (24 * 3600 * 1000));
  const targetGapInDays = inDays[person.targetCheckinFrequency];
  const diff = Math.abs(gapInDays - targetGapInDays);
  return {
    isOverdue: gapInDays > targetGapInDays,
    diff: diff,
    ratio: Math.round(100 / (targetGapInDays / diff)),
    // const x =
    // 0 days for 30 -> 0%
    // 15 days overdue for 30 -> 50%
    // 30 days overdue for 30 -> 100%
    // 60 days overdue for 30 -> 200%
  };
}

function getPersonFromConnection(
  connection: {
    userDefined: [];
    resourceName?: string;
    names?: [];
  },
  now: number
) {
  if (
    !connection.userDefined ||
    !connection.resourceName ||
    !connection.names[0].displayName
  ) {
    return null;
  }
  let person: Person = {
    resourceName: connection.resourceName,
    name: connection.names[0].displayName,
    isOverdue: false,
    diff: 0,
    targetCheckinFrequency: 0,
    ratio: 0,
  };
  const { userDefined } = connection;
  userDefined.forEach((element) => {
    const { key, value } = element;
    if (keeprPptiesNames.includes(value)) {
      const parsed = keeprPpties[`${value}`].validateAndParse(key);
      person = { ...person, [value]: parsed };
    }
  });
  const overdueDetails = getOverdueDetails(now, person);
  person = { ...person, ...overdueDetails };
  return person;
}

function App() {
  const [overduePersons, setOverduePersons] = useState([]);
  const [onTrackPersons, setOnTrackPersons] = useState([]);
  const [displayTextAuthButton, setDisplayTextAuthButton] =
    useState("authorize");
  const [showSignoutButton, setShowSignoutButton] = useState(false);

  // console.log(tokenClient);
  // console.log(gapi.client.getToken());
  // console.log(gapiInited);
  // console.log(gisInited);

  function signout() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      setDisplayTextAuthButton("authorize");
      setShowSignoutButton(false);
      setOnTrackPersons([]);
      setOverduePersons([]);
    }
  }

  async function setKeeprData() {
    const now = Date.now();
    let response;
    try {
      // Fetch first 100 files
      response = await gapi.client.people.people.connections.list({
        resourceName: "people/me",
        pageSize: 100,
        personFields:
          "names,emailAddresses,coverPhotos,phoneNumbers,clientData,birthdays,userDefined",
      });
    } catch (err) {
      throw new Error(err.message);
      // document.getElementById("content").innerText = err.message;
      // return;
    }
    const connections = response.result.connections;
    if (connections && connections.length > 0) {
      const persons = connections
        .map((c) => getPersonFromConnection(c, now))
        .filter((p: Person) => p !== null);

      const overduePersons = persons
        .filter((p: Person) => p.isOverdue)
        .sort((p1: Person, p2: Person) => p2.ratio - p1.ratio);
      setOverduePersons(overduePersons);

      const onTrackPersons = persons.filter((p: Person) => !p.isOverdue);
      setOnTrackPersons(onTrackPersons);
    }
  }

  function authenticate() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      setShowSignoutButton(true);
      setDisplayTextAuthButton("refresh");
      await setKeeprData();
    };
    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
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
            {!!(tokenClient && gapi) ? (
              <div>
                <Button onClick={authenticate} variant="contained">
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
