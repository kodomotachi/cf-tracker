import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // ⬅️ Thêm plugin này
import "./MultiplePieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels); // ⬅️ Đăng ký thêm DataLabels

function MultiplePieChart({ dataUser, propContests }) {
  const [groupedData, setGroupedData] = useState({});
  const [isDataExist, setIsDataExist] = useState(false);

  useEffect(() => {
    if (
      !dataUser ||
      dataUser.length === 0 ||
      (dataUser.length == 1 && dataUser[0].id === "none")
    ) {
      setIsDataExist(false);
      return;
    }
    setIsDataExist(true);

    const mergedList = propContests.map((contest) => {
      const contestId = String(contest.id);
      const divMatches = contest.name.match(/Div\.?\s?[1-4]/g); // Giữ nguyên chữ
      const isEdu = /Edu/i.test(contest.name);
      const isGlobal = /Global/i.test(contest.name);
      const isCodeForces = /Codeforces/i.test(contest.name);

      const cleanedDivs = divMatches?.map((div) =>
        div
          .replace(/Div[\.\s]?1/i, "Div. 1")
          .replace(/Div[\.\s]?2/i, "Div. 2")
          .replace(/Div[\.\s]?3/i, "Div. 3")
          .replace(/Div[\.\s]?4/i, "Div. 4")
      );
      const uniqueDivs = [...new Set(cleanedDivs)];
      const divString = uniqueDivs ? uniqueDivs.join(" + ") : "";

      let types = [];
      if (isEdu) types.push("Educational");
      if (isGlobal) types.push("Global");
      if (divString) types.push(divString);

      if (!isEdu && !isGlobal && !divString) types.push("Other");

      return {
        ...contest,
        div: types,
      };
    });

    const groups = {};

    mergedList.map((contest) => {
      dataUser.forEach((item) => {
        if (item.contestId === contest.id) {
          contest.div.forEach((value) => {
            const groupName = value;
            const verdict = item.verdict || "Unknown";

            // Nếu nhóm chưa có trong groups thì tạo nhóm mới
            if (!groups[groupName]) {
              groups[groupName] = { AC: 0, NonAC: 0 };
            }

            // Cập nhật số lượng AC và NonAC cho nhóm
            if (verdict === "OK") {
              groups[groupName].AC += 1;
            } else {
              groups[groupName].NonAC += 1;
            }
          });
        }
      });
    });
    setGroupedData(groups);
  }, [propContests, dataUser]);

  const generateChartData = (ac, nonAc) => ({
    labels: ["AC", "Non-AC"],
    datasets: [
      {
        data: [ac, nonAc],
        backgroundColor: ["#4ade80", "#f87171"],
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        color: "#333",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value, context) => {
          const dataArr = context.chart.data.datasets[0].data;
          const total = dataArr.reduce((acc, val) => acc + val, 0);
          const percentage = total ? (value / total) * 100 : 0;
          return `${percentage.toFixed(1)}%`;
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div className="multiple-pie-chart">
      <div className="multiple-pie-chart__header">
        <div className="multiple-pie-chart__header-title">
          Contest Categories By AC Percentage
        </div>
      </div>
      <div className="multiple-pie-chart__body">
        {isDataExist ? (
          Object.entries(groupedData).map(([groupName, { AC, NonAC }], idx) => (
            <div key={idx} className="multiple-pie-chart__item">
              <div className="multiple-pie-chart__item-chart">
                <Pie data={generateChartData(AC, NonAC)} options={options} />
              </div>
              <div className="multiple-pie-chart__item-label">{groupName}</div>
            </div>
          ))
        ) : (
          <div className="chart--no-data">No data</div>
        )}
      </div>
    </div>
  );
}

export default MultiplePieChart;
