import React, { use, useEffect, useState, useRef } from "react";
import "./Problems.css";
function Problems({ codeforce, tachi, dataUser }) {
  const [problems, setProblems] = useState([]);
  const [problemsStatistics, setProblemsStatistics] = useState([]);
  const [mergedProblems, setMergedProblems] = useState([]);
  const [data, setData] = useState([]);

  const [limitPage, setLimitPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState([10, 20, 50, 100, 200]);

  const [minPage, setMinPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(4000);
  const [minContestId, setMinContestId] = useState(1);
  const [maxContestId, setMaxContestId] = useState(4000);
  const [listTag, setListTag] = useState([]);

  const [sortId, setSortId] = useState(-1);
  const [sortRating, setSortRating] = useState(-1);
  const [sortSolvedCount, setSortSolvedCount] = useState(-1);
  const [filterSolved, setFilterSolved] = useState(1);
  const [filterAttemped, setFilterAttemped] = useState(0);
  const [filterUnsolved, setFilterUnsolved] = useState(0);

  const [search, setSearch] = useState([]);
  const [gotoPage, setGotoPage] = useState(1);
  const [tagSelected, setTagSelected] = useState([]);
  const [dataDisplay, setDataDisplay] = useState([]);

  const [filterTableToggle, setfilterTableToggle] = useState(0);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dataUser == "") return;
    const verdictMap = {};

    dataUser.forEach((value) => {
      const key = `${value.problem.contestId}-${value.problem.index}`;
      // Chỉ lấy verdict OK ưu tiên nhất, nếu không thì verdict khác
      if (!verdictMap[key] || value.verdict === "OK") {
        verdictMap[key] = value.verdict;
      }
    });

    const result = mergedProblems
      .filter((problem) => {
        const key = `${problem.contestId}-${problem.index}`;
        const verdict = verdictMap[key] || null;

        const isSolved = verdict === "OK";
        const isAttempted = verdict && verdict !== "OK";
        const isUnsolved = !verdict;

        if (
          (!filterSolved || !isSolved) &&
          (!filterAttemped || !isAttempted) &&
          (!filterUnsolved || !isUnsolved)
        ) {
          return false;
        }

        if (tagSelected && tagSelected.length > 0) {
          const hasTag = tagSelected.some((tag) => problem.tags.includes(tag));
          if (!hasTag) return false;
        }

        if (
          (minRating && problem.rating < minRating) ||
          (maxRating && problem.rating > maxRating)
        ) {
          return false;
        }

        if (
          (minContestId && problem.contestId < minContestId) ||
          (maxContestId && problem.contestId > maxContestId)
        ) {
          return false;
        }

        return true;
      })
      .map((problem) => {
        const key = `${problem.contestId}-${problem.index}`;
        return {
          contestId: problem.contestId,
          index: problem.index,
          name: problem.name,
          points: problem.points,
          rating: problem.rating,
          tag: problem.tags,
          solvedCount: problem.solvedCount,
          verdict: verdictMap[key] || null,
        };
      });

    setData(result);
    setDataDisplay(result);
  }, [
    dataUser,
    filterSolved,
    filterAttemped,
    filterUnsolved,
    tagSelected,
    minRating,
    maxRating,
    minContestId,
    maxContestId,
  ]);

  useEffect(() => {
    fetch(codeforce + "/api/problemset.problems")
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
          console.error("Lỗi khi lấy dữ liệu:", res);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setfilterTableToggle(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (selectedValues) => {
    setSearch(selectedValues);

    const results = data.filter(
      (value) =>
        String(value.contestId + value.index) // Đảm bảo contestId là chuỗi
          .toLowerCase()
          .startsWith(selectedValues.toLowerCase()) ||
        value.name.toLowerCase().includes(selectedValues.toLowerCase()) // Kiểm tra đúng tên thuộc tính
    );

    setDataDisplay(results);
  };

  useEffect(() => {
    setDataDisplay(data);
    //  if (data.length > 0 && !perPage.includes(data.length)) {
    //    setPerPage([10, 20, 50, 100, 200, data.length]);
    //  }
    setMaxPage(Math.ceil(data.length / limitPage));
  }, [data, limitPage]);

  useEffect(() => {
    if (gotoPage != "") setCurrentPage(gotoPage);
  }, [gotoPage]);

  const handleRandomShuffle = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomItem = data[randomIndex];
    setSearch("");
    setDataDisplay([randomItem]);
  };

  const handleRefresh = () => {
    setSearch("");
    setDataDisplay(data);
  };

  const handleChangePage = (value) => {
    // Cho phép xóa hết để nhập lại
    if (value === "") {
      setGotoPage("");
      return;
    }
    let pageCurrent = Math.floor(value);
    if (value <= 0) pageCurrent = minPage;
    if (value > maxPage) pageCurrent = maxPage;

    setGotoPage(pageCurrent);
  };

  const handleChangeFilterMinRating = (value) => {
    if (value === "") {
      setMinRating("");
      return;
    }
    let rating = Math.floor(value);
    if (value <= 0) rating = minPage;

    setMinRating(rating);
  };

  const handleChangeFilterMaxRating = (value) => {
    if (value === "") {
      setMaxRating("");
      return;
    }
    let rating = Math.floor(value);
    if (value <= 0) rating = minPage;

    setMaxRating(rating);
  };

  const handleChangeFilterMinContestId = (value) => {
    if (value === "") {
      handleChangeFilterMinContestId("");
      return;
    }
    let pageCurrent = Math.floor(value);
    if (value <= 0) pageCurrent = minPage;

    setMinContestId(pageCurrent);
  };
  const handleChangeFilterMaxContestId = (value) => {
    if (value === "") {
      handleChangeFilterMaxContestId("");
      return;
    }
    let pageCurrent = Math.floor(value);
    if (value <= 0) pageCurrent = minPage;

    setMaxContestId(pageCurrent);
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
        <div className="problems__menu-display">
          Showing {limitPage} of {dataDisplay.length}
        </div>
        <div className="problems__btn-group">
          <div
            onClick={() => handleRandomShuffle()}
            className="problems__menu-btn"
          >
            <i class="fa-solid fa-shuffle problems__menu-btn-icon"></i>
          </div>
          <div onClick={() => handleRefresh()} className="problems__menu-btn">
            <i class="fa-solid fa-rotate-right problems__menu-btn-icon"></i>
          </div>
        </div>
        <div
          onClick={() => setfilterTableToggle(!filterTableToggle)}
          className="problems__menu-btn"
        >
          <i
            className={
              filterTableToggle
                ? "fa-solid fa-filter problems__menu-btn-icon active"
                : "fa-solid fa-filter problems__menu-btn-icon"
            }
          ></i>
          <div
            onClick={(e) => e.stopPropagation()}
            ref={dropdownRef}
            className={
              filterTableToggle
                ? "problems__menu-btn-bar"
                : "problems__menu-btn-bar hide"
            }
          >
            <div className="problems__menu-btn-bar__header">
              <div className="problems__menu-btn-bar__title">Filter</div>
              <div
                onClick={() => setfilterTableToggle(0)}
                className="problems__menu-btn-bar__btn-close"
              >
                <i class="fa-solid fa-circle-xmark"></i>
              </div>
            </div>
            <div className="problems__menu-btn-bar__body">
              <div className="problems__menu-btn-bar__solve-status-selector">
                <div className="problems__menu-btn-bar__solve-status-selector-title">
                  Solve Status
                </div>
                <div className="problems__menu-btn-bar__solve-status-selector-group">
                  <div
                    onClick={() => setFilterSolved(!filterSolved)}
                    className={
                      filterSolved
                        ? "problems__menu-btn-bar__solve-status-selector-btn active"
                        : "problems__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    SOLVED
                  </div>
                  <div
                    onClick={() => setFilterAttemped(!filterAttemped)}
                    className={
                      filterAttemped
                        ? "problems__menu-btn-bar__solve-status-selector-btn active"
                        : "problems__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    ATTEMPED
                  </div>
                  <div
                    onClick={() => setFilterUnsolved(!filterUnsolved)}
                    className={
                      filterUnsolved
                        ? "problems__menu-btn-bar__solve-status-selector-btn active"
                        : "problems__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    UNSOLVED
                  </div>
                </div>
              </div>
              <div className="problems__menu-btn-bar__range-filter">
                <div className="problems__menu-btn-bar__range-filter-group">
                  <div className="problems__menu-btn-bar__range-filter-btn">
                    <span>Min Rating:</span>
                    <input
                      type="number"
                      name="minRating"
                      placeholder="min rating = 0"
                      step="1"
                      value={minRating}
                      onChange={(e) =>
                        handleChangeFilterMinRating(e.target.value)
                      }
                    />
                  </div>
                  <div className="problems__menu-btn-bar__range-filter-btn">
                    <span>Max Rating:</span>
                    <input
                      type="number"
                      name="maxRatign"
                      placeholder="Max Rating = 4000"
                      step="100"
                      value={maxRating}
                      onChange={(e) =>
                        handleChangeFilterMaxRating(e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="problems__menu-btn-bar__range-filter-group">
                  <div className="problems__menu-btn-bar__range-filter-btn">
                    <span>Min ContestId:</span>
                    <input
                      type="number"
                      name="minContestId"
                      placeholder="Min ContestId = 1"
                      step="1"
                      value={minContestId}
                      onChange={(e) =>
                        handleChangeFilterMinContestId(e.target.value)
                      }
                    />
                  </div>
                  <div className="problems__menu-btn-bar__range-filter-btn">
                    <span>Max ContestId:</span>
                    <input
                      type="number"
                      name="maxContestId"
                      placeholder="Max ContestId = 4000"
                      step="1"
                      value={maxContestId}
                      onChange={(e) =>
                        handleChangeFilterMaxContestId(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="problems__menu-btn-bar__tag-selector">
                <div className="problems__menu-btn-bar__tag-selector-title">
                  Tags
                </div>

                <div className="problems__menu-btn-bar__tag-selector-multi-select">
                  <select
                    onChange={(e) => {
                      const oldTagSelected = tagSelected;
                      if (!oldTagSelected.includes(e.target.value))
                        setTagSelected([...oldTagSelected, e.target.value]);
                    }}
                  >
                    <option value="" disabled selected hidden>
                      -- Select tag --
                    </option>
                    {listTag.map((value, index) => (
                      <option value={value}>{value}</option>
                    ))}
                  </select>
                  <i class="fa-solid fa-angle-down"></i>
                </div>
                <div className="problems__menu-btn-bar__tag-selector-selected">
                  {tagSelected.map((value, index) => (
                    <div
                      onClick={() => {
                        const newTags = tagSelected.filter(
                          (tag) => tag !== value
                        );
                        setTagSelected(newTags);
                      }}
                      className="problems__menu-btn-bar__tag-selector-selected-item"
                    >
                      <span>{value}</span>
                      <i class="fa-solid fa-xmark"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
          {dataDisplay
            .slice((currentPage - 1) * limitPage, currentPage * limitPage)
            .map((value, index) => (
              <div
                className={
                  !value.verdict
                    ? "problems__table__content-container"
                    : value.verdict == "OK"
                    ? "problems__table__content-container solved"
                    : "problems__table__content-container attemped"
                }
                key={index}
              >
                <div className="problems__table__content-item width-8">
                  <div className="problems__table__content-item-text">
                    {(currentPage - 1) * limitPage + index + 1}
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
        <div className="problems__table-page-bar-container">
          <div
            onClick={() => handleChangePage(minPage)}
            className="problems__table-page-bar-item problems__table-page-bar-item--arrow"
          >
            <i class="fa-solid fa-angles-left"></i>
          </div>
          <div
            onClick={() => handleChangePage(currentPage - 1)}
            className="problems__table-page-bar-item problems__table-page-bar-item--arrow"
          >
            <i class="fa-solid fa-angle-left"></i>
          </div>
          <div
            onClick={() => handleChangePage(currentPage + 1)}
            className="problems__table-page-bar-item problems__table-page-bar-item--arrow"
          >
            <i class="fa-solid fa-angle-right"></i>
          </div>
          <div
            onClick={() => handleChangePage(maxPage)}
            className="problems__table-page-bar-item problems__table-page-bar-item--arrow"
          >
            <i class="fa-solid fa-angles-right"></i>
          </div>
        </div>

        <div className="problems__table-page-bar-item problems__table-page-bar-item--info">
          <span>
            {" "}
            Page {currentPage} of {maxPage}
          </span>
        </div>
        <div className="problems__table-page-bar-item problems__table-page-bar-item--goto">
          <span>Go to page:</span>
          <input
            type="number"
            name="gotoPage"
            placeholder="Max Rating"
            step="1"
            value={gotoPage}
            onChange={(e) => handleChangePage(e.target.value)}
          />
        </div>
        <div className="problems__table-page-bar-item problems__table-page-bar-item--per-page">
          <span>Per Page:</span>
          <div className="problems__table-page-bar-item--per-page-container">
            <select
              onChange={(e) => {
                setLimitPage(e.target.value);
                setGotoPage(1);
              }}
            >
              {perPage.map((value, index) => (
                <option value={value}>{value}</option>
              ))}
            </select>
            <i class="fa-solid fa-angle-down"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problems;
