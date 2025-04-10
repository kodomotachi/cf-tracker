import React, { useEffect, useState } from "react";
import "./Problems.css";
function Problems({ dataUser }) {
  const [problems, setProblems] = useState([]);
  const [problemsStatistics, setProblemsStatistics] = useState([]);
  const [mergedProblems, setMergedProblems] = useState([]);
  const [data, setData] = useState(dataUser ? dataUser : []);
  const [dataDisplay, setDataDisplay] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortId, setSortId] = useState(-1);
  const [sortRating, setSortRating] = useState(-1);
  const [sortSolvedCount, setSortSolvedCount] = useState(-1);

  useEffect(() => {
    fetch("https://codeforces.com/api/problemset.problems?tags=implementation")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          setProblems(data.result.problems);
          setProblemsStatistics(data.result.problemStatistics);
        } else {
          console.error("Lỗi khi lấy dữ liệu:", data);
        }
      })
      .catch((error) => console.error("Lỗi kết nối API:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const merged = problems.map((problem) => {
      const matchedStat = problemsStatistics.find(
        (stat) =>
          stat.contestId === problem.contestId && stat.index === problem.index
      );

      return {
        ...problem,
        solvedCount: matchedStat ? matchedStat.solvedCount : 0, // nếu không có thì gán 0
      };
    });

    merged.sort((a, b) => (a.rating || 100000) - (b.rating || 100000));
    setMergedProblems(merged);
    if (dataUser != null) return;
    setData(merged);
  }, [problems, problemsStatistics]);

  // sort by contest ID, rating, solvedCount
  const handleSortById = () => {
    if (sortId == -1) setSortId(1);
    else setSortId(!sortId);
    setSortRating(-1);
    setSortSolvedCount(-1);
  };

  const handleSortByRating = () => {
    if (sortRating == -1) setSortRating(1);
    else setSortRating(!sortRating);
    setSortId(-1);
    setSortSolvedCount(-1);
  };

  const handleSortBySolvedCount = () => {
    if (sortSolvedCount == -1) setSortSolvedCount(1);
    else setSortSolvedCount(!sortSolvedCount);
    setSortId(-1);
    setSortRating(-1);
  };

  useEffect(() => {
    if (sortId == -1) return;
    let sorted = [...data];
    if (sortId == 1)
      sorted.sort((a, b) => {
        if (a.contestId !== b.contestId) {
          return a.contestId - b.contestId; // sort theo contestId tăng dần
        }
        return a.index.localeCompare(b.index); // nếu cùng contestId, sort tiếp theo index (A < B < C ...)
      });
    else if (sortId == 0)
      sorted.sort((a, b) => {
        if (a.contestId !== b.contestId) {
          return b.contestId - a.contestId; // sort theo contestId tăng dần
        }
        return b.index.localeCompare(a.index); // nếu cùng contestId, sort tiếp theo index (A < B < C ...)
      });
    setData(sorted);
  }, [sortId]);

  useEffect(() => {
    if (sortRating == -1) return;
    let sorted = [...data];
    if (sortRating == 1)
      sorted.sort((a, b) => (a.rating || 100000) - (b.rating || 100000));
    else if (sortRating == 0)
      sorted.sort((a, b) => (b.rating || 100000) - (a.rating || 100000));
    setData(sorted);
  }, [sortRating]);

  useEffect(() => {
    if (sortSolvedCount == -1) return;
    let sorted = [...data];
    if (sortSolvedCount == 1)
      sorted.sort((a, b) => (a.solvedCount || 0) - (b.solvedCount || 0));
    else if (sortSolvedCount == 0)
      sorted.sort((a, b) => (b.solvedCount || 0) - (a.solvedCount || 0));
    setData(sorted);
  }, [sortSolvedCount]);

  const handleChange = (selectedValues) => {
    setSearch(selectedValues);
    if (selectedValues.trim() === "") {
      setFilteredUniversities([]);
      setShowDropdown(false);
      return;
    }

    const results = data.filter(
      (value) =>
        String(value.contestId + value.index) // Đảm bảo contestId là chuỗi
          .toLowerCase()
          .startsWith(selectedValues.toLowerCase()) ||
        value.name.toLowerCase().includes(selectedValues.toLowerCase()) // Kiểm tra đúng tên thuộc tính
    );

    setData(results);
  };

  useEffect(() => {
    setDataDisplay(data);
  }, [data]);

  const handleRandomShuffle = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomItem = data[randomIndex];
    setDataDisplay([randomItem]);
  };

  const handleRefresh = () => {
    setDataDisplay(data);
  };

  return (
    <div className="problems">
      <div className="problems__menu">
        <div className="problems__menu-search-box">
          <input
            type="text"
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Problem Name or Id"
            className="problems__menu-search-box-input"
          />
        </div>
        <div className="problems__menu-display">Showing 100 of 550</div>
        <div className="problems__btn-group">
          <div
            onClick={() => handleRandomShuffle()}
            className="problems__menu-btn"
          >
            <i class="fa-solid fa-shuffle"></i>
          </div>
          <div onClick={() => handleRefresh()} className="problems__menu-btn">
            <i class="fa-solid fa-rotate-right"></i>
          </div>
        </div>
        <div className="problems__menu-btn">
          <i class="fa-solid fa-filter"></i>
        </div>
      </div>
      <div className="problems__table">
        <div className="problems__table__thread">
          <div className="problems__table__thread-item width-8">
            <div className="problems__table__thread-item-text">#</div>
          </div>
          <div
            onClick={() => handleSortById()}
            className="problems__table__thread-item width-16 cursor-pointer"
          >
            <div className="problems__table__thread-item-text">ID</div>
            <div className="problems__table__thread-item-group">
              <i
                class={
                  sortId == 0
                    ? "fa-solid fa-caret-up problems__table__thread-item-icon show-off"
                    : "fa-solid fa-caret-up problems__table__thread-item-icon"
                }
              ></i>
              <i
                class={
                  sortId == 1
                    ? "fa-solid fa-caret-down problems__table__thread-item-icon show-off"
                    : "fa-solid fa-caret-down problems__table__thread-item-icon"
                }
              ></i>
            </div>
          </div>
          <div className="problems__table__thread-item width-64 ">
            <div className="problems__table__thread-item-text">Name</div>
          </div>
          <div
            onClick={() => handleSortByRating()}
            className="problems__table__thread-item width-16 cursor-pointer"
          >
            <div className="problems__table__thread-item-text">Rating</div>
            <div className="problems__table__thread-item-group">
              <i
                class={
                  sortRating == 0
                    ? "fa-solid fa-caret-up problems__table__thread-item-icon show-off"
                    : "fa-solid fa-caret-up problems__table__thread-item-icon"
                }
              ></i>
              <i
                class={
                  sortRating == 1
                    ? "fa-solid fa-caret-down problems__table__thread-item-icon show-off"
                    : "fa-solid fa-caret-down problems__table__thread-item-icon"
                }
              ></i>
            </div>
          </div>
          <div
            onClick={() => handleSortBySolvedCount()}
            className="problems__table__thread-item width-20 cursor-pointer"
          >
            <div className="problems__table__thread-item-text">Solve Count</div>
            <div className="problems__table__thread-item-group">
              <i
                class={
                  sortSolvedCount == 0
                    ? "fa-solid fa-caret-up problems__table__thread-item-icon show-off"
                    : "fa-solid fa-caret-up problems__table__thread-item-icon"
                }
              ></i>
              <i
                class={
                  sortSolvedCount == 1
                    ? "fa-solid fa-caret-down problems__table__thread-item-icon show-off"
                    : "fa-solid fa-caret-down problems__table__thread-item-icon"
                }
              ></i>
            </div>
          </div>
        </div>
        <div className="problems__table__content">
          {/* https://codeforces.com/problemset/problem/2092/D */}
          {dataDisplay.slice(0, 50).map((value, index) => (
            <div className="problems__table__content-container" key={index}>
              <div className="problems__table__content-item width-8">
                <div className="problems__table__content-item-text">
                  {index + 1}
                </div>
              </div>
              <div className="problems__table__content-item width-16">
                <div className="problems__table__content-item-text">
                  {value.contestId}
                  {value.index}
                </div>
              </div>
              <div className="problems__table__content-item width-64">
                <a
                  href={`https://codeforces.com/problemset/problem/${value.contestId}/${value.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="problems__table__content-item-text cursor-pointer"
                >
                  {value.name}
                </a>
              </div>
              <div className="problems__table__content-item width-16">
                <div className="problems__table__content-item-text">
                  {value.rating ? value.rating : "-"}
                </div>
              </div>
              <div className="problems__table__content-item width-20">
                <div className="problems__table__content-item-text">
                  {value.solvedCount ? value.solvedCount : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="problems__table-page-bar">
        <div className="problems__table-page-bar-item">
          <i class="fa-solid fa-angles-left"></i>
        </div>
        <div className="problems__table-page-bar-item">
          <i class="fa-solid fa-angle-left"></i>
        </div>
        <div className="problems__table-page-bar-item">
          <i class="fa-solid fa-angles-right"></i>
        </div>
        <div className="problems__table-page-bar-item">
          <i class="fa-solid fa-angle-right"></i>
        </div>
      </div>
    </div>
  );
}

export default Problems;
