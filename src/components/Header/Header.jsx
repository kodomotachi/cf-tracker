import { React, useState, useRef, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../img/cftracker_logo.png";

function Header({ codeforce, tachi, propHandleUser }) {
  const [handleUser, setHandleUser] = useState("");
  const [search, setSearch] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertFailed, setShowAlertFailed] = useState(false);
  const [showAlertSuccessfull, setShowAlertSuccessfull] = useState(false);

  const [remainingTime, setRemainingTime] = useState(1500); // Tổng thời gian
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const [remainingTime2, setRemainingTime2] = useState(1500); // Tổng thời gian
  const timeoutRef2 = useRef(null);
  const startTimeRef2 = useRef(null);

  const [remainingTime3, setRemainingTime3] = useState(1500); // Tổng thời gian
  const timeoutRef3 = useRef(null);
  const startTimeRef3 = useRef(null);

  const [loading, setLoading] = useState(true);

  const startTimers = () => {
    startTimeRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      setShowAlert(false);
    }, remainingTime);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setHandleUser(e.target.value);
      setShowAlert(true);
      setSearch(e.target.value);
    }
    setRemainingTime(1500);
    clearTimeout(timeoutRef.current);
    startTimers();
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      setRemainingTime((prev) => Math.max(0, prev - elapsed));
    }
  };

  const handleMouseLeave = () => {
    startTimers();
  };

  const startTimers2 = () => {
    startTimeRef2.current = Date.now();
    timeoutRef2.current = setTimeout(() => {
      setShowAlertFailed(false);
    }, remainingTime2);
  };

  const handleMouseEnter2 = () => {
    if (timeoutRef2.current) {
      clearTimeout(timeoutRef2.current);
      const elapsed = Date.now() - startTimeRef2.current;
      setRemainingTime2((prev) => Math.max(0, prev - elapsed));
    }
  };

  const handleMouseLeave2 = () => {
    startTimers2();
  };

  const startTimers3 = () => {
    startTimeRef3.current = Date.now();
    timeoutRef3.current = setTimeout(() => {
      setShowAlertSuccessfull(false);
    }, remainingTime3);
  };

  const handleMouseEnter3 = () => {
    if (timeoutRef3.current) {
      clearTimeout(timeoutRef3.current);
      const elapsed = Date.now() - startTimeRef3.current;
      setRemainingTime3((prev) => Math.max(0, prev - elapsed));
    }
  };

  const handleMouseLeave3 = () => {
    startTimers3();
  };

  useEffect(() => {
    if (handleUser == "") return;
    fetch(codeforce + "/api/user.status?handle=" + handleUser)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          propHandleUser(data.result);
          setShowAlertSuccessfull(true);
          setRemainingTime3(1500);
          clearTimeout(timeoutRef3.current);
          startTimers3();
        } else {
          setShowAlertFailed(true);
          setRemainingTime2(1500);
          clearTimeout(timeoutRef2.current);
          startTimers2();
          setHandleUser("");
        }
      })
      .catch((error) => console.error("Lỗi kết nối API:", error))
      .finally(() => setLoading(false));
  }, [handleUser]);

  return (
    <div className="header">
      <div className="header__container">
        <a href="/" className="header__logo">
          <img className="header__logo-img" src={logo} alt="" />
          {/* <div className="header__logo-text">CF Tracker</div> */}
        </a>
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
              onKeyDown={handleKeyDown}
              placeholder="handle1, handle2, .."
              className="header__search-box-input"
            />
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setShowAlert(false);
              }}
              className={
                showAlert
                  ? "header__search-box-alert"
                  : "header__search-box-alert hide"
              }
            >
              <span>Handles entered: {search}</span>
              <i class="fa-solid fa-xmark"></i>
              <div className="header__search-box-alert-line"></div>
            </div>
            <div
              onMouseEnter={handleMouseEnter2}
              onMouseLeave={handleMouseLeave2}
              onClick={() => {
                setShowAlertFailed(false);
              }}
              className={
                showAlertFailed
                  ? "header__search-box-alert header__search-box-alert--failed"
                  : "header__search-box-alert header__search-box-alert--failed hide"
              }
            >
              <div className="header__search-box-alert--failed-cnt">
                <i className="fa-solid fa-circle-exclamation header__search-box-alert--failed-icon"></i>
                <span>
                  Failded To fetch Submissions for User wih handle: {search}
                </span>
              </div>
              <i class="fa-solid fa-xmark"></i>
              <div className="header__search-box-alert--failed-line"></div>
            </div>

            <div
              onMouseEnter={handleMouseEnter3}
              onMouseLeave={handleMouseLeave3}
              onClick={() => {
                setShowAlertSuccessfull(false);
              }}
              className={
                showAlertSuccessfull
                  ? "header__search-box-alert header__search-box-alert--successful"
                  : "header__search-box-alert header__search-box-alert--successful hide"
              }
            >
              <div className="header__search-box-alert--successful-cnt">
                <i className="fa-solid fa-circle-check header__search-box-alert--successful-icon"></i>
                <span>
                  Successful To fetch Submissions for User wih handle: {search}
                </span>
              </div>
              <i class="fa-solid fa-xmark"></i>
              <div className="header__search-box-alert--successful-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
