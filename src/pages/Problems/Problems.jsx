import React, { useEffect, useState } from "react";
import "./Problems.css";
function Problems() {
  const [data, setData] = useState([]);
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://codeforces.com/api/problemset.problems?tags=implementation")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          setData(data.result.problems); // Lấy danh sách problems
          setProblems(data.result.problems); // Lấy danh sách problems
        } else {
          console.error("Lỗi khi lấy dữ liệu:", data);
        }
      })
      .catch((error) => console.error("Lỗi kết nối API:", error))
      .finally(() => setLoading(false));
  }, []);

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

    setProblems(results);
  };

  //  const handleSearch = () => {
  //    //  setSearch(search);
  //    setShowDropdown(false);
  //    const keysArray = filteredUniversities.map(([key, _]) => key);
  //    appHandleCodeChange([...keysArray]);
  //  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="problems">
      <div className="problems__menu">
        <div className="problems__menu-search-box">
          <input
            type="text"
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Problem Name or Id"
            className="problems__menu-search-box-input"
          />
        </div>
        <div className="problems__menu-display">Showing 100 of 550</div>
        <div className="problems__btn-group">
          <div className="problems__menu-btn">
            <i class="fa-solid fa-shuffle"></i>
          </div>
          <div className="problems__menu-btn">
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
          <div className="problems__table__thread-item width-16 cursor-pointer">
            <div className="problems__table__thread-item-text">ID</div>
            <div className="problems__table__thread-item-group">
              <i class="fa-solid fa-caret-up problems__table__thread-item-icon"></i>
              <i class="fa-solid fa-caret-down problems__table__thread-item-icon"></i>
            </div>
          </div>
          <div className="problems__table__thread-item width-64 ">
            <div className="problems__table__thread-item-text">Name</div>
          </div>
          <div className="problems__table__thread-item width-16 cursor-pointer">
            <div className="problems__table__thread-item-text">Rating</div>
            <div className="problems__table__thread-item-group">
              <i class="fa-solid fa-caret-up problems__table__thread-item-icon"></i>
              <i class="fa-solid fa-caret-down problems__table__thread-item-icon"></i>
            </div>
          </div>
          <div className="problems__table__thread-item width-16 cursor-pointer">
            <div className="problems__table__thread-item-text">Points</div>
            <div className="problems__table__thread-item-group">
              <i class="fa-solid fa-caret-up problems__table__thread-item-icon"></i>
              <i class="fa-solid fa-caret-down problems__table__thread-item-icon"></i>
            </div>
          </div>
        </div>
        <div className="problems__table__content">
          {/* https://codeforces.com/problemset/problem/2092/D */}
          {problems.slice(0, 10).map((value, index) => (
            <div className="problems__table__content-container" key={index}>
              <div className="problems__table__content-item width-8">
                <div className="problems__table__content-item-text">
                  {index + 1}
                </div>
              </div>
              <div className="problems__table__content-item width-16 cursor-pointer">
                <div className="problems__table__content-item-text">
                  {value.contestId}
                  {value.index}
                </div>
              </div>
              <div className="problems__table__content-item width-64 cursor-pointer">
                <a
                  href={`https://codeforces.com/problemset/problem/${value.contestId}/${value.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="problems__table__content-item-text"
                >
                  {value.name}
                </a>
              </div>
              <div className="problems__table__content-item width-16 cursor-pointer">
                <div className="problems__table__content-item-text">
                  {value.rating ? value.rating : "-"}
                </div>
              </div>
              <div className="problems__table__content-item width-16 cursor-pointer">
                <div className="problems__table__content-item-text">
                  {value.points ? value.points : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Problems;
