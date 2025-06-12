import keeprLogoMulti from "../assets/logo-l.svg";
import keeprLogoSingle from "../assets/logo-s.jpg";
import "./AppName.css";

interface AppNameProps {
  size: "small" | "large";
}

export default function AppName({ size }: AppNameProps) {
  return (
    <>
      {size === "large" && (
        <>
          <img src={keeprLogoMulti} className="logo-large" alt="Keepr logo" />
          <h1 className={size}>keepr</h1>
        </>
      )}
      {size === "small" && (
        <div className="logo-small-wrapper">
          <img src={keeprLogoSingle} className="logo-small" alt="Keepr logo" />
          <h1 className={size}>keepr</h1>
        </div>
      )}
    </>
  );
}
