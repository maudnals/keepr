import Button from "@mui/material/Button";
import "./SigninMenu.css";
import ButtonGroup from "@mui/material/ButtonGroup";

interface SigninMenuProps {
  signout: () => void;
  authenticateAndSetData: () => void;
}

export default function SigninMenu({
  signout,
  authenticateAndSetData,
}: SigninMenuProps) {
  return (
    <>
      <ButtonGroup size="small" aria-label="Refresh and Sign out">
        <Button onClick={authenticateAndSetData}>Refresh</Button>
        <Button onClick={signout}>Sign out</Button>
      </ButtonGroup>
    </>
  );
}
