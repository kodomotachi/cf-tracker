import React, { use, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Contests.css";
import Problems from "../Problems";

function Contest({ dataUser, propProblems, propContests, propListTag }) {
  const location = useLocation();

  const [problems, setProblems] = useState([]);
  const [userProblems, setUserProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [data, setData] = useState([]);
  const [categoriesContest, setCategoriesContest] = useState([
    "Div. 1",
    "Div. 2",
    "Div. 3",
    "Div. 4",
    "Educational",
    "Div. 1 + Div. 2",
    "Global",
    "Other",
    "All",
  ]);
  const [viewSettings, setViewSettings] = useState([
    "Date",
    "Rating",
    "Color",
    "Short Name",
  ]);

  const [filterDiv, setFilterDiv] = useState(() => {
    const initialState = {};
    categoriesContest.forEach((cat) => {
      initialState[cat] = true;
    });
    return initialState;
  });
  const [viewSelect, setViewSelect] = useState(() => {
    const stored = localStorage.getItem("viewSelect");
    if (stored) {
      return JSON.parse(stored); // Nếu đã lưu thì lấy ra
    }
    // Nếu chưa có trong localStorage thì tạo mặc định
    const initialState = {};
    viewSettings.forEach((cat) => {
      initialState[cat] = false;
    });
    return initialState;
  });

  const [filterSolved, setFilterSolved] = useState(() => {
    const stored = localStorage.getItem("filterSolved");
    if (stored === null) return true;
    return stored === "true";
  });

  const [filterAttemped, setFilterAttemped] = useState(() => {
    const stored = localStorage.getItem("filterAttemped");
    if (stored === null) return false;
    return stored === "true";
  });
  const [filterUnsolved, setFilterUnsolved] = useState(() => {
    const stored = localStorage.getItem("filterUnsolved");
    if (stored === null) return false;
    return stored === "true";
  });

  const [orderProblems, setOrderProblems] = useState([]);
  const [listTag, setListTag] = useState([]);

  const [limitPage, setLimitPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState([10, 20, 50, 100, 200]);

  const [minPage, setMinPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [search, setSearch] = useState([]);
  const [gotoPage, setGotoPage] = useState(1);
  const [tagSelected, setTagSelected] = useState([]);
  const [dataDisplay, setDataDisplay] = useState([]);

  const [filterTableToggle, setfilterTableToggle] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setProblems(propProblems);
    setListTag(propListTag);
    setContests(propContests);
  }, [propProblems, propListTag, propContests]);

  useEffect(() => {
    const order = new Set();
    dataDisplay
      .slice((currentPage - 1) * limitPage, currentPage * limitPage)
      .map((contest, index) => {
        contest.problemList.map((problem) => {
          if (problem.index[0] >= "A" && problem.index[0] <= "Z") {
            const group = problem.index[0];
            if (group >= "A" && group <= "Z") order.add(group);
          }
        });
      });

    setOrderProblems(
      Array.from(order).sort((a, b) => {
        return a.localeCompare(b);
      })
    );
  }, [dataDisplay, currentPage, limitPage]);

  useEffect(() => {
    let currentproblems = problems;
    if (userProblems.length > 0) currentproblems = userProblems;
    const problemMap = new Map();

    // Đảm bảo KEY là cùng kiểu (ví dụ dùng String)
    for (const problem of currentproblems) {
      const contestId = String(problem.contestId);
      if (!problemMap.has(contestId)) {
        problemMap.set(contestId, []);
      }

      problemMap.get(contestId).push(problem);
    }

    const mergedList = contests.map((contest) => {
      const contestId = String(contest.id);
      const divMatches = contest.name.match(/Div\.?\s?[1-4]/g); // Giữ nguyên chữ
      const isEdu = /Edu/i.test(contest.name);
      const isGlobal = /Global/i.test(contest.name);
      const isCodeForces = /Codeforces/i.test(contest.name);
      const fullRound = contest.name.match(/Round (\d+)/);
      const round = fullRound != null ? fullRound[1] : "";
      let shortName = "";

      const cleanedDivs = divMatches?.map((div) =>
        div
          .replace(/Div[\.\s]?1/i, "Div. 1")
          .replace(/Div[\.\s]?2/i, "Div. 2")
          .replace(/Div[\.\s]?3/i, "Div. 3")
          .replace(/Div[\.\s]?4/i, "Div. 4")
      );
      const uniqueDivs = [...new Set(cleanedDivs)];
      const divString = uniqueDivs ? uniqueDivs.join(" + ") : "";

      if (isEdu) {
        shortName = "Edu " + round;
      } else if (isGlobal) {
        shortName = "Global " + round;
      } else if (isCodeForces) {
        shortName = "CF " + round;
      }

      let types = [];
      if (isEdu) types.push("Educational");
      if (isGlobal) types.push("Global");
      if (divString) types.push(divString);

      if (!isEdu && !isGlobal && !divString) types.push("Other");
      let unix_timestamp = contest.startTimeSeconds;

      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds
      var date = new Date(unix_timestamp * 1000);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();

      var formattedTime =
        day +
        "/" +
        month +
        "/" +
        year +
        "\t" +
        hours +
        ":" +
        minutes.substr(-2);

      return {
        ...contest,
        div: types,
        problemList: (problemMap.get(contestId) || []).sort((a, b) =>
          a.index.localeCompare(b.index)
        ),
        shortName: shortName,
        formattedTime: formattedTime,
      };
    });

    const newData = mergedList.filter((value) => value.problemList.length > 0);
    const newData2 = newData.filter((contest) => {
      return contest.problemList.some((problem) => {
        const verdict = problem.verdict || null;

        const isSolved = verdict === "OK";
        const isAttempted = verdict && verdict !== "OK";
        const isUnsolved = !verdict;

        return (
          (filterSolved && isSolved) ||
          (filterAttemped && isAttempted) ||
          (filterUnsolved && isUnsolved)
        );
      });
    });
    setData(newData);
    setDataDisplay(newData2);
    setOldData(newData);
  }, [contests, problems, userProblems]);

  useEffect(() => {
    //  if (dataUser == "") {
    //    setData(oldData);
    //    setDataDisplay(oldData);
    //    return;
    //  }
    const verdictMap = {};

    dataUser.forEach((value) => {
      const key = `${value.problem.contestId}-${value.problem.index}`;
      // Chỉ lấy verdict OK ưu tiên nhất, nếu không thì verdict khác
      if (!verdictMap[key] || value.verdict === "OK") {
        verdictMap[key] = value.verdict;
      }
    });

    const result = problems.map((problem) => {
      const key = `${problem.contestId}-${problem.index}`;
      return {
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        points: problem.points,
        rating: problem.rating,
        tags: problem.tags,
        solvedCount: problem.solvedCount,
        verdict: verdictMap[key] || null,
      };
    });

    setUserProblems(result);
  }, [dataUser, problems]);

  useEffect(() => {
    const newData = data.filter((contest) => {
      return contest.problemList.some((problem) => {
        const verdict = problem.verdict || null;

        const isSolved = verdict === "OK";
        const isAttempted = verdict && verdict !== "OK";
        const isUnsolved = !verdict;

        return (
          (filterSolved && isSolved) ||
          (filterAttemped && isAttempted) ||
          (filterUnsolved && isUnsolved)
        );
      });
    });

    const activeDivs = Object.keys(filterDiv).filter((key) => filterDiv[key]);
    const newData2 = newData.filter((contest) => {
      return contest.div.some((value) => activeDivs.includes(value));
    });

    setDataDisplay(newData2);
    setGotoPage(1);
  }, [filterDiv, filterSolved, filterAttemped, filterUnsolved]);

  const toggleItemDiv = (div) => {
    if (div === "All") {
      // Lấy danh sách các key trừ "All"
      const allKeysExceptAll = Object.keys(filterDiv).filter(
        (key) => key !== "All"
      );

      const allOn = !filterDiv["All"]; // Nếu đang tắt thì bật hết, đang bật thì tắt hết

      const newFilter = {
        All: allOn,
      };

      allKeysExceptAll.forEach((key) => {
        newFilter[key] = allOn;
      });

      setFilterDiv(newFilter);
    } else {
      // Trường hợp toggle từng cái
      setFilterDiv((prev) => {
        const newValue = !prev[div];
        const newFilter = {
          ...prev,
          [div]: newValue,
          All: false, // Mặc định tắt "All" khi toggle riêng
        };

        // Kiểm tra nếu tất cả key (trừ "All") đều true sau toggle thì bật "All"
        const allKeysExceptAll = Object.keys(newFilter).filter(
          (key) => key !== "All"
        );
        const allAreOn = allKeysExceptAll.every((key) => newFilter[key]);

        if (allAreOn) {
          newFilter.All = true;
        }

        return newFilter;
      });
    }
  };
  const toggleItemViewSetting = (value) => {
    setViewSelect((prev) => {
      const updated = {
        ...prev,
        [value]: !prev[value],
      };
      localStorage.setItem("viewSelect", JSON.stringify(updated)); // Lưu lại
      return updated;
    });
  };

  const handleChange = (selectedValues) => {
    setSearch(selectedValues);

    const results = data.filter(
      (contest) =>
        String(contest.id) // Đảm bảo contestId là chuỗi
          .toLowerCase()
          .startsWith(selectedValues.toLowerCase()) ||
        contest.name.toLowerCase().includes(selectedValues.toLowerCase()) // Kiểm tra đúng tên thuộc tính
    );

    setDataDisplay(results);
    setGotoPage(1);
  };

  const getRatingColor = (rating) => {
    if (rating <= 1200) {
      return "var(--rating-color-1)";
    } else if (rating <= 1400) {
      return "var(--rating-color-2)";
    } else if (rating <= 1600) {
      return "var(--rating-color-3)";
    } else if (rating <= 1800) {
      return "var(--rating-color-4)";
    } else if (rating <= 2000) {
      return "var(--rating-color-5)";
    } else if (rating <= 2200) {
      return "var(--rating-color-6)";
    } else if (rating <= 2400) {
      return "var(--rating-color-7)";
    } else if (rating <= 2600) {
      return "var(--rating-color-8)";
    } else if (rating <= 2800) return "var(--rating-color-9)";
    return "var(--rating-color-10)";
  };
  const getSubRatingColor = (rating) => {
    if (rating <= 1200) {
      return "var(--sub-rating-color-1)";
    } else if (rating <= 1400) {
      return "var(--sub-rating-color-2)";
    } else if (rating <= 1600) {
      return "var(--sub-rating-color-3)";
    } else if (rating <= 1800) {
      return "var(--sub-rating-color-4)";
    } else if (rating <= 2000) {
      return "var(--sub-rating-color-5)";
    } else if (rating <= 2200) {
      return "var(--sub-rating-color-6)";
    } else if (rating <= 2400) {
      return "var(--sub-rating-color-7)";
    } else if (rating <= 2600) {
      return "var(--sub-rating-color-8)";
    } else if (rating <= 2800) {
      return "var(--sub-rating-color-9)";
    } else if (rating <= 3000) {
      return "var(--sub-rating-color-10)";
    } else {
      return "var(--sub-rating-color-11)";
    }
  };

  useEffect(() => {
    //  if (dataDisplay.length > 0 && !perPage.includes(dataDisplay.length)) {
    //    setPerPage([10, 20, 50, 100, 200, dataDisplay.length]);
    //  }
    setMaxPage(Math.ceil(dataDisplay.length / limitPage));
  }, [dataDisplay, limitPage]);

  useEffect(() => {
    if (gotoPage != "") setCurrentPage(gotoPage);
  }, [gotoPage]);

  const handleRandomShuffle = () => {
    if (data.length < 1) return;
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomItem = data[randomIndex];
    setSearch("");
    setDataDisplay([randomItem]);
  };

  const handleRefresh = () => {
    setSearch("");
    setDataDisplay(data);
    setFilterSolved(0);
    setFilterAttemped(0);
    setUnSolved(1);
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

  return (
    <div className="contests">
      <div className="contests__menu">
        <div className="contests__menu-search-box">
          <input
            type="text"
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search by Contest Name or Id"
            className="contests__menu-search-box-input"
          />
        </div>
        <div className="contests__menu-display">
          Showing {limitPage} of {dataDisplay.length}
        </div>
        <div className="contests__btn-group">
          <div
            onClick={() => handleRandomShuffle()}
            className="contests__menu-btn"
          >
            <i class="fa-solid fa-shuffle contests__menu-btn-icon"></i>
          </div>
          <div onClick={() => handleRefresh()} className="contests__menu-btn">
            <i class="fa-solid fa-rotate-right contests__menu-btn-icon"></i>
          </div>
        </div>
        <div
          onClick={() => setfilterTableToggle(!filterTableToggle)}
          className="contests__menu-btn"
        >
          <i
            className={
              filterTableToggle
                ? "fa-solid fa-filter contests__menu-btn-icon active"
                : "fa-solid fa-filter contests__menu-btn-icon"
            }
          ></i>
          <div
            onClick={(e) => e.stopPropagation()}
            ref={dropdownRef}
            className={
              filterTableToggle
                ? "contests__menu-btn-bar"
                : "contests__menu-btn-bar hide"
            }
          >
            <div className="contests__menu-btn-bar__header">
              <div className="contests__menu-btn-bar__title">Filter</div>
              <div
                onClick={() => setfilterTableToggle(0)}
                className="contests__menu-btn-bar__btn-close"
              >
                <i class="fa-solid fa-circle-xmark"></i>
              </div>
            </div>
            <div className="contests__menu-btn-bar__body">
              <div className="contests__menu-btn-bar__view-settings">
                <div className="contests__menu-btn-bar__view-settings-title">
                  View Settings
                </div>
                <div className="contests__menu-btn-bar__view-settings-container">
                  {viewSettings.map((value, index) => (
                    <div
                      key={index}
                      onClick={() => toggleItemViewSetting(value)}
                      className={
                        viewSelect[value]
                          ? "contests__menu-btn-bar__view-settings-item active"
                          : "contests__menu-btn-bar__view-settings-item"
                      }
                    >
                      <div className="contests__menu-btn-bar__view-settings-item-text">
                        {value}
                      </div>
                      <div className="contests__menu-btn-bar__view-settings-item-btn">
                        <i class="fa-solid fa-check"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="contests__menu-btn-bar__solve-status-selector">
                <div className="contests__menu-btn-bar__solve-status-selector-title">
                  Solve Status
                </div>
                <div className="contests__menu-btn-bar__solve-status-selector-group">
                  <div
                    onClick={() => {
                      const oldData = filterSolved;
                      localStorage.setItem("filterSolved", !oldData);
                      setFilterSolved(!oldData);
                    }}
                    className={
                      filterSolved
                        ? "contests__menu-btn-bar__solve-status-selector-btn active"
                        : "contests__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    SOLVED
                  </div>
                  <div
                    onClick={() => {
                      const oldData = filterAttemped;
                      localStorage.setItem("filterAttemped", !oldData);
                      setFilterAttemped(!oldData);
                    }}
                    className={
                      filterAttemped
                        ? "contests__menu-btn-bar__solve-status-selector-btn active"
                        : "contests__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    ATTEMPED
                  </div>
                  <div
                    onClick={() => {
                      const oldData = filterUnsolved;
                      localStorage.setItem("filterUnsolved", !oldData);
                      setFilterUnsolved(!oldData);
                    }}
                    className={
                      filterUnsolved
                        ? "contests__menu-btn-bar__solve-status-selector-btn active"
                        : "contests__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    UNSOLVED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contest__category-tabs">
        {categoriesContest.map((value, index) => (
          <div
            key={index}
            className={
              filterDiv[value]
                ? "contest__category-tabs-item active"
                : "contest__category-tabs-item"
            }
            onClick={() => toggleItemDiv(value)}
          >
            {value}
          </div>
        ))}
      </div>

      <div className="contests__table">
        <div className="contests__table__thread">
          <div className="contests__table__thread-item min-width-64">
            <div className="contests__table__thread-item-text">#</div>
          </div>
          <div
            className={
              viewSelect["Short Name"]
                ? "contests__table__thread-item min-width-160"
                : "contests__table__thread-item min-width-280"
            }
          >
            <div className="contests__table__thread-item-text">Contest</div>
          </div>
          {orderProblems.map((value) => (
            <div className="contests__table__thread-item min-width-160">
              <div className="contests__table__thread-item-text">{value}</div>
            </div>
          ))}
        </div>
        <div className="contests__table__content">
          {dataDisplay
            .slice((currentPage - 1) * limitPage, currentPage * limitPage)
            .map((value, index) => (
              <div className="contests__table__content-container">
                <div className="contests__table__content-item  min-width-64">
                  <div className="contests__table__content-item-order">
                    {(currentPage - 1) * limitPage + index + 1}
                  </div>
                </div>
                <div
                  title={`${value.name} \n ID: ${value.id}`}
                  className={
                    viewSelect["Short Name"]
                      ? value.shortName.length > 0
                        ? "contests__table__content-item  min-width-160"
                        : "contests__table__content-item  min-width-160 clean"
                      : "contests__table__content-item  min-width-280"
                  }
                >
                  <a
                    href={`https://codeforces.com/contest/${value.id}`}
                    target="_blank"
                    className="contests__table__content-item-title "
                  >
                    {viewSelect["Short Name"] && value.shortName.length > 0
                      ? value.shortName
                      : value.name}
                    <div
                      className={
                        viewSelect["Short Name"] &&
                        !value.div.includes("Educational") &&
                        !value.div.includes("Global")
                          ? "contests__table__content-item-title-div active"
                          : "contests__table__content-item-title-div"
                      }
                    >
                      {value.div}
                    </div>
                    <div
                      className={
                        viewSelect["Date"]
                          ? "contests__table__content-item-title-date active"
                          : "contests__table__content-item-title-date"
                      }
                    >
                      {value.formattedTime}
                    </div>
                  </a>
                </div>

                {orderProblems.map((letter) => {
                  const grouped = value.problemList.filter(
                    (problem) => problem.index[0] === letter
                  );

                  return (
                    <div
                      key={letter}
                      className="contests__table__content-item-group min-width-160"
                    >
                      {grouped.length === 0 ? (
                        <div className="contests__table__content-item min-width-160 empty-cell"></div>
                      ) : (
                        grouped.map((problem) => {
                          const firstText = problem.index;
                          const LastText = ". " + problem.name;
                          const ratingColor = problem.rating
                            ? getRatingColor(problem.rating)
                            : "gray";
                          const subRatingColor = problem.rating
                            ? getSubRatingColor(problem.rating)
                            : "gray";

                          return (
                            <div
                              key={problem.index}
                              title={problem.name}
                              className={
                                !problem.verdict
                                  ? "contests__table__content-item min-width-160"
                                  : problem.verdict === "OK"
                                  ? "contests__table__content-item min-width-160 solved"
                                  : "contests__table__content-item min-width-160 attemped"
                              }
                              style={{
                                color: viewSelect["Color"]
                                  ? ratingColor
                                  : "inherit",
                              }}
                            >
                              <a
                                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                                target="_blank"
                                className="contests__table__content-item-text"
                              >
                                <span
                                  style={{
                                    color: viewSelect["Color"]
                                      ? subRatingColor
                                      : "inherit",
                                  }}
                                >
                                  {firstText}
                                </span>
                                {LastText}
                                <div
                                  className={
                                    viewSelect["Rating"]
                                      ? "contests__table__content-item-rating active"
                                      : "contests__table__content-item-rating"
                                  }
                                >
                                  ({problem.rating ? problem.rating : "N/A"})
                                </div>
                              </a>
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
      <div className="contests__page-bar">
        <div className="contests__page-bar-container">
          <div
            onClick={() => handleChangePage(minPage)}
            className="contests__page-bar-item contests__page-bar-item--arrow"
          >
            <i class="fa-solid fa-angles-left"></i>
          </div>
          <div
            onClick={() => handleChangePage(currentPage - 1)}
            className="contests__page-bar-item contests__page-bar-item--arrow"
          >
            <i class="fa-solid fa-angle-left"></i>
          </div>
          <div
            onClick={() => handleChangePage(currentPage + 1)}
            className="contests__page-bar-item contests__page-bar-item--arrow"
          >
            <i class="fa-solid fa-angle-right"></i>
          </div>
          <div
            onClick={() => handleChangePage(maxPage)}
            className="contests__page-bar-item contests__page-bar-item--arrow"
          >
            <i class="fa-solid fa-angles-right"></i>
          </div>
        </div>

        <div className="contests__page-bar-item contests__page-bar-item--info">
          <span>
            {" "}
            Page {currentPage} of {maxPage}
          </span>
        </div>
        <div className="contests__page-bar-item contests__page-bar-item--goto">
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
        <div className="contests__page-bar-item contests__page-bar-item--per-page">
          <span>Per Page:</span>
          <div className="contests__page-bar-item--per-page-container">
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
      <div
        className={
          filterTableToggle ? "problems__modal show" : "problems__modal"
        }
      ></div>
    </div>
  );
}

export default Contest;
