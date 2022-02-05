import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="menu">
          <Menu />
        </div>
        </div>
        <div className="row group">
        <div className="routes">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
