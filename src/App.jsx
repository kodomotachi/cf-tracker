import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import Problems from "./pages/Problems";
import Contests from "./pages/Contests";
import Header from "./components/Header";

const App = () => {
  const [dataUser, setDataUser] = useState([]);
  const [problems, setProblems] = useState([]);
  const [problemsStatistics, setProblemsStatistics] = useState([]);
  const [contests, setContests] = useState([]);

  const [listTag, setListTag] = useState([]);

  const [loading, setLoading] = useState(true);
  const codeforce = "https://codeforces.com";
  const tachi = "https://getdata-codeforces.onrender.com";

  useEffect(() => {
    fetch(codeforce + "/api/problemset.problems", {
      headers: { "Accept-Language": "en" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "OK") {
          setProblems(res.result.problems);
          setProblemsStatistics(res.result.problemStatistics);
          const tagSet = new Set();
          res.result.problems.forEach((problem) => {
            problem.tags.forEach((tag) => tagSet.add(tag));
          });
          setListTag([...tagSet]);
        } else {
          fetch(tachi + "/api/problemset.problems", {
            headers: { "Accept-Language": "en" },
          })
            .then((res1) => res1.json())
            .then((res1) => {
              if (res1.status === "OK") {
                setProblems(res1.result.problems);
                setProblemsStatistics(res1.result.problemStatistics);
                const tagSet = new Set();
                res1.result.problems.forEach((problem) => {
                  problem.tags.forEach((tag) => tagSet.add(tag));
                });
                setListTag([...tagSet]);
              } else {
                console.error("Lỗi khi lấy dữ liệu:", res1);
              }
            })
            .catch((error) => console.error("Lỗi kết nối API:", error))
            .finally(() => setLoading(false));
        }
      })
      .catch((error) => console.error("Lỗi kết nối API:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(codeforce + "/api/contest.list?gym=false", {
      headers: { "Accept-Language": "en" },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "OK") {
          setContests(res.result);
        } else {
          fetch(tachi + "/api/contest.list?gym=false", {
            headers: { "Accept-Language": "en" },
          })
            .then((res1) => res1.json())
            .then((res1) => {
              if (res1.status === "OK") {
                setContests(res1.result);
              } else {
                console.error("Lỗi khi lấy dữ liệu:", res1);
              }
            })
            .catch((error) => console.error("Lỗi kết nối API:", error))
            .finally(() => setLoading(false));
        }
      })
      .catch((error) => console.error("Lỗi kết nối API:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleHandleUser = (value) => {
    setDataUser(value);
  };
  return (
    <div>
      <Router>
        <Header
          tachi={tachi}
          codeforce={codeforce}
          propHandleUser={handleHandleUser}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/problems" replace />} />
          <Route
            path="/problems"
            exact
            element={
              <Problems
                dataUser={dataUser}
                propProblems={problems}
                propProblemsStatistics={problemsStatistics}
                propListTag={listTag}
              />
            }
          />
          <Route
            path="/contests"
            exact
            element={
              <Contests
                dataUser={dataUser}
                propProblems={problems}
                propContests={contests}
                propListTag={listTag}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
