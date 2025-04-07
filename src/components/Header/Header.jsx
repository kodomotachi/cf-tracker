import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
      <div className="header__container">
        <div className="header__logo">
          <div className="header__logo-img"></div>
          <div className="header__logo-text">CF Tracker</div>
        </div>
        <div className="header__menu">
          <div className="header__menu-nav">
            <Link to="/stats" className="header__menu-nav-item">
              Stats
            </Link>
            <Link to="/problems" className="header__menu-nav-item">
              Problems
            </Link>
            <Link to="/contents" className="header__menu-nav-item">
              Contents
            </Link>
          </div>
          <div className="header__search-box">
            <input
              type="text"
              placeholder="handle1, handle2, .."
              className="header__search-box-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
