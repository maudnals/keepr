// Extend the Window interface to include custom properties
declare global {
  interface Window {
    DISCOVERY_DOC: string;
    SCOPES: string;
    CLIENT_ID: string;
    API_KEY: string;
  }
}

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/people/v1/rest";

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/contacts";

window.DISCOVERY_DOC = DISCOVERY_DOC;
window.SCOPES = SCOPES;
