import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./SigninMenu.css";

interface SigninMenuProps {
  signout: () => void;
  authenticateAndSetData: () => void;
  showSignoutButton: boolean;
  displayTextAuthButton: string;
}

export default function SigninMenu({
  signout,
  showSignoutButton,
  authenticateAndSetData,
  displayTextAuthButton,
}: SigninMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleSignout() {
    console.log("Signing out...");
    signout();
    handleClose();
  }

  function handleAuth() {
    authenticateAndSetData();
    handleClose();
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleAuth} className="auth-button">
          {displayTextAuthButton}
        </MenuItem>
        {showSignoutButton && (
          <MenuItem onClick={handleSignout}>Sign out</MenuItem>
        )}
      </Menu>
    </div>
  );
}
