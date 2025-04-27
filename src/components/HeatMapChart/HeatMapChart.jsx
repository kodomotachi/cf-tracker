import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./HeatMapChart.css";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import "cal-heatmap/cal-heatmap.css";

function HeatMap({ dataUser }) {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const [listYears, setListYears] = useState([currentYear]);
  const [thisYear, setThisYear] = useState(0);
  const [isDataExist, setIsDataExist] = useState(false);
  const calRef = useRef(null);
  const calInstance = useRef(null);

  useEffect(() => {
    if (
      !dataUser ||
      dataUser.length === 0 ||
      (dataUser.length == 1 && dataUser[0].id === "none")
    ) {
      if (thisYear > 0) setThisYear(0);
      setIsDataExist(false);
      return;
    }
    setIsDataExist(true);
    if (thisYear === 0) {
      setThisYear(currentYear);
    }
    // Xử lý dữ liệu: gom số lượng submit theo từng ngày
    let minYears = currentYear;
    const formattedData = Object.entries(
      dataUser.reduce((acc, item) => {
        // Kiểm tra và lấy thời gian từ creationTimeSeconds
        const timestamp = item.creationTimeSeconds;
        if (!timestamp || isNaN(timestamp)) return acc; // nếu không có hoặc không hợp lệ thì bỏ qua

        const date = new Date(timestamp * 1000); // Chuyển UNIX timestamp thành Date
        if (isNaN(date.getTime())) return acc; // Nếu ngày không hợp lệ thì bỏ qua

        const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD" (Ngày tháng năm)
        if (minYears > parseInt(date.getFullYear())) {
          minYears = parseInt(date.getFullYear());
        }
        // Tích lũy số lần xuất hiện của ngày này trong acc
        acc[dateStr] = (acc[dateStr] || 0) + 1;
        return acc;
      }, {})
    ).map(([date, value]) => ({ date, value }));

    const arrayYears = [];
    for (let year = currentYear; year >= minYears; year--) {
      arrayYears.push(year);
    }
    setListYears(arrayYears);
    if (formattedData.length === 0) {
      console.log("Không có dữ liệu để hiển thị");
      return; // dừng nếu không có dữ liệu
    }

    // Tạo heatmap mới
    calInstance.current = new CalHeatmap();
    calInstance.current.paint(
      {
        itemSelector: calRef.current,
        range: 12,
        domain: {
          type: "month",
          gutter: 4,
          label: { text: "MMM", textAlign: "start", position: "top" },
        },
        subDomain: {
          type: "ghDay",
          radius: 2,
          width: 11,
          height: 11,
          gutter: 4,
        },
        date: {
          start: new Date(`${thisYear}-01-01`),
        },
        data: {
          source: formattedData,
          x: "date",
          y: (d) => d.value,
          type: "json",
        },
        scale: {
          color: {
            type: "linear",
            domain: [0, 50],
            range: ["#d9d5dc", "#4d4352"],
            // Thử màu sắc khác
          },
        },
        theme: "light",
      },
      [
        [
          Tooltip,
          {
            text: function (date, value, dayjsDate) {
              return (
                (value ? value : "No") +
                " submissions on " +
                dayjsDate.format("dddd, MMMM D, YYYY")
              );
            },
          },
        ],
        [
          LegendLite,
          {
            includeBlank: true,
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
        ],
        [
          CalendarLabel,
          {
            width: 30,
            textAlign: "start",
            text: () =>
              dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? "" : d)),
            padding: [25, 0, 0, 0],
          },
        ],
      ]
    );

    // Cleanup
    return () => {
      if (calRef.current) {
        calRef.current.innerHTML = ""; // Xóa hết nội dung cũ trước khi vẽ lại
      }
      calInstance.current?.destroy();
    };
  }, [dataUser, thisYear, location.pathname]);

  useEffect(() => {
    setThisYear(currentYear);
  }, [location.pathname]);
  return (
    <div className="heat-map-chart">
      <div className="heat-map-chart__header">
        <div className="heat-map-chart__header-title">Submission HeatMap</div>
        <div className="heat-map-chart__header-filter-table">
          <div
            className={
              isDataExist
                ? "heat-map-chart__header-filter-cnt"
                : "heat-map-chart__header-filter-cnt disable"
            }
          >
            <select
              className="heat-map-chart__header-filter-btn"
              onChange={(e) => {
                setThisYear(e.target.value);
              }}
            >
              {listYears.map((value, index) => (
                <option
                  className="heat-map-chart__header-filter-btn-text"
                  value={value}
                >
                  {value}
                </option>
              ))}
            </select>
            <i class="fa-solid fa-angle-down heat-map-chart__header-filter-btn-icon"></i>
          </div>
        </div>
      </div>
      <div className="heat-map-chart__body">
        {isDataExist ? (
          <div className="heat-map-chart__body-chart" ref={calRef} />
        ) : (
          <div className="chart--no-data">No data</div>
        )}
      </div>
    </div>
  );
}

export default HeatMap;
