import React, { use, useEffect, useState, useRef } from "react";
import "./Contests.css";
import Problems from "../Problems";

function Contest({ codeforce, tachi, dataUser }) {
  const [problems, setProblems] = useState([]);
  const [mergedProblems, setMergedProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [data, setData] = useState([]);
  const [categoriesContest, setCategoriesContest] = useState([
    "Div. 1",
    "Div. 2",
    "Div. 3",
    "Div. 4",
    "Educational",
    "Div. 1 + Div. 2",
    "Global",
    "All",
  ]);
  const [activeItems, setActiveItems] = useState(
    Array(categoriesContest.length).fill(false) // Tạo mảng [false, false, ...]
  );

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

  const [loading, setLoading] = useState(true);

  const toggleItem = (index) => {
    const updated = [...activeItems];
    updated[index] = !updated[index]; // Đảo trạng thái on/off
    setActiveItems(updated);
  };

  useEffect(() => {
    fetch(codeforce + "/api/problemset.problems")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "OK") {
          setProblems(res.result.problems);
          const tagSet = new Set();
          res.result.problems.forEach((problem) => {
            problem.tags.forEach((tag) => tagSet.add(tag));
          });
          setListTag([...tagSet]);
        } else {
          fetch(tachi + "/api/problemset.problems")
            .then((res1) => res1.json())
            .then((res1) => {
              if (res1.status === "OK") {
                setProblems(res1.result.problems);
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
    fetch(codeforce + "/api/contest.list?gym=false")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "OK") {
          setContests(res.result);
        } else {
          fetch(tachi + "/api/contest.list?gym=false")
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

  useEffect(() => {
    const problemMap = new Map();
    const order = new Set();
    // Đảm bảo KEY là cùng kiểu (ví dụ dùng String)
    for (const problem of problems) {
      const contestId = String(problem.contestId);
      if (!problemMap.has(contestId)) {
        problemMap.set(contestId, []);
      }
      problemMap.get(contestId).push(problem);
      if (problem.index[0] >= "A" && problem.index[0] <= "Z")
        order.add(problem.index[0]);
    }

    setOrderProblems(
      Array.from(order).sort((a, b) => {
        return a.localeCompare(b);
      })
    );

    const mergedList = contests.map((contest) => {
      const contestId = String(contest.id);
      return {
        ...contest,
        problemList: problemMap.get(contestId) || [],
      };
    });

    console.log(mergedList);
    setData(mergedList);
  }, [contests, problems]);

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
    const newData = data.filter((value) => value.problemList.length > 0);
    setDataDisplay(newData);
    //  if (data.length > 0 && !perPage.includes(data.length)) {
    //    setPerPage([10, 20, 50, 100, 200, data.length]);
    //  }
    setMaxPage(Math.ceil(newData.length / limitPage));
  }, [data, limitPage]);

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
    const newData = data.filter((value) => value.problemList.length > 0);
    setDataDisplay(newData);
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
          {/* <div
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
              <div className="contests__menu-btn-bar__solve-status-selector">
                <div className="contests__menu-btn-bar__solve-status-selector-title">
                  Solve Status
                </div>
                <div className="contests__menu-btn-bar__solve-status-selector-group">
                  <div
                    onClick={() => setFilterSolved(!filterSolved)}
                    className={
                      filterSolved
                        ? "contests__menu-btn-bar__solve-status-selector-btn active"
                        : "contests__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    SOLVED
                  </div>
                  <div
                    onClick={() => setFilterAttemped(!filterAttemped)}
                    className={
                      filterAttemped
                        ? "contests__menu-btn-bar__solve-status-selector-btn active"
                        : "contests__menu-btn-bar__solve-status-selector-btn"
                    }
                  >
                    ATTEMPED
                  </div>
                  <div
                    onClick={() => setFilterUnsolved(!filterUnsolved)}
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
              <div className="contests__menu-btn-bar__range-filter">
                <div className="contests__menu-btn-bar__range-filter-group">
                  <div className="contests__menu-btn-bar__range-filter-btn">
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
                  <div className="contests__menu-btn-bar__range-filter-btn">
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
                <div className="contests__menu-btn-bar__range-filter-group">
                  <div className="contests__menu-btn-bar__range-filter-btn">
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
                  <div className="contests__menu-btn-bar__range-filter-btn">
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
              <div className="contests__menu-btn-bar__tag-selector">
                <div className="contests__menu-btn-bar__tag-selector-title">
                  Tags
                </div>

                <div className="contests__menu-btn-bar__tag-selector-multi-select">
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
                <div className="contests__menu-btn-bar__tag-selector-selected">
                  {tagSelected.map((value, index) => (
                    <div
                      onClick={() => {
                        const newTags = tagSelected.filter(
                          (tag) => tag !== value
                        );
                        setTagSelected(newTags);
                      }}
                      className="contests__menu-btn-bar__tag-selector-selected-item"
                    >
                      <span>{value}</span>
                      <i class="fa-solid fa-xmark"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="contest__category-tabs">
        {categoriesContest.map((value, index) => (
          <div
            className={
              activeItems[index]
                ? "contest__category-tabs-item active"
                : "contest__category-tabs-item"
            }
            onClick={() => toggleItem(index)}
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
          <div className="contests__table__thread-item min-width-280">
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
                <div className="contests__table__content-item  min-width-280">
                  <div className="contests__table__content-item-title ">
                    {value.name}
                  </div>
                </div>

                {Array.from({ length: orderProblems.length }).map(
                  (_, index) => {
                    const problem = value.problemList[index] || "";
                    const firstText = problem == "" ? "" : problem.index;

                    const LastText = problem == "" ? "" : ". " + problem.name;

                    return (
                      <div className="contests__table__content-item  min-width-160">
                        <a
                          href={`https://codeforces.com/problemset/problem/${problem.contestID}/${problem.index}`}
                          target="_blank"
                          className="contests__table__content-item-text"
                        >
                          <span>{firstText}</span> {LastText}
                        </a>
                      </div>
                    );
                  }
                )}
              </div>
            ))}
          {console.log(dataDisplay)}
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
    </div>
  );
}

export default Contest;
