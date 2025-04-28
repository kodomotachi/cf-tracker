import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./BarChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart({ dataUser }) {
  const [chartData, setChartData] = useState({});
  const [isDataExist, setIsDataExist] = useState(false);
  const [options, setOptions] = useState({});

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

    const allRatings = [];
    for (let r = 800; r <= 3500; r += 100) {
      allRatings.push(r.toString());
    }

    // Khởi tạo dữ liệu đếm
    const acCount = {};
    const nonAcCount = {};
    allRatings.forEach((r) => {
      acCount[r] = 0;
      nonAcCount[r] = 0;
    });

    dataUser.forEach((item) => {
      const rating = item.problem?.rating?.toString();
      if (!rating || !acCount.hasOwnProperty(rating)) return;

      if (item.verdict === "OK" || item.verdict === "AC") {
        acCount[rating]++;
      } else {
        nonAcCount[rating]++;
      }
    });

    const countsAC = allRatings.map((r) => acCount[r]);
    const countsNonAC = allRatings.map((r) => nonAcCount[r]);
    const backgroundColorsAC = allRatings.map((r) =>
      getRatingColor(parseInt(r))
    );
    const backgroundColorsNonAC = allRatings.map(() => "#d4edc9");

    setChartData({
      labels: allRatings,
      datasets: [
        {
          label: "Solved",
          data: countsAC,
          backgroundColor: allRatings.map((r) => getRatingColor(parseInt(r))), // vẫn giữ màu theo rating
        },
        {
          label: "Attempted",
          data: countsNonAC,
          backgroundColor: "#ffe3e3",
        },
      ],
    });

    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 64,
            boxHeight: 16,
            padding: 16,
            color: "#000", // màu chữ legend
            generateLabels: (chart) => {
              return chart.data.datasets.map((dataset, i) => {
                const original =
                  ChartJS.defaults.plugins.legend.labels.generateLabels(chart)[
                    i
                  ];
                return {
                  ...original,
                  fillStyle: i === 0 ? "#d4edc9" : "#ffe3e3", // chỉnh màu khối vuông
                };
              });
            },
          },
        },
        tooltip: { enabled: true },
        datalabels: { display: false },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Problem Rating",
          },
        },
        y: {
          stacked: true,
          title: {
            display: false,
            // text: "Submission Count",
          },
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    });
  }, [dataUser]);

  const getRatingColor = (rating) => {
    if (rating < 1200) return "rgb(204, 204, 204)";
    if (rating < 1400) return "rgb(119, 255, 119)";
    if (rating < 1600) return "rgb(119, 221, 187)";
    if (rating < 1900) return "rgb(170, 170, 255)";
    if (rating < 2100) return "rgb(255, 136, 255)";
    if (rating < 2300) return "rgb(255, 204, 136)";
    if (rating < 2400) return "rgb(255, 187, 85)";
    if (rating < 2600) return "rgb(255, 119, 119)";
    if (rating < 3000) return "rgb(255, 51, 51)";
    return "rgb(170, 0, 0)";
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart__header">
        <div className="bar-chart__header-title">Solve Count By Ratings</div>
      </div>
      <div className="bar-chart__body">
        {isDataExist ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="chart--no-data">No data</div>
        )}
      </div>
    </div>
  );
}

export default BarChart;
