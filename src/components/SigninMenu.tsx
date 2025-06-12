import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./SigninMenu.css";

interface SigninMenuProps {
  signout: () => void;
  authenticateAndSetData: () => void;
}

export default function SigninMenu({
  signout,
  authenticateAndSetData,
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
    signout();
    handleClose();
  }

  function handleRefresh() {
    authenticateAndSetData();
    handleClose();
  }

  return (
    <>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Menu
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleRefresh} className="auth-button">
          <Button>Refresh</Button>
        </MenuItem>
        <MenuItem onClick={handleSignout}>
          <Button>Sign out</Button>
        </MenuItem>
      </Menu>
    </>
  );
}
