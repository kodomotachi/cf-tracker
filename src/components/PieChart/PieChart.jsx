import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./PieChart.css";

// Đăng ký các plugin cần thiết cho chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ dataUser }) {
  const location = useLocation();
  const [chartData, setChartData] = useState(null);
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

    // Gom nhóm theo verdict
    const verdictCount = {};
    dataUser.forEach((item) => {
      const verdict = item.verdict || "Unknown";
      verdictCount[verdict] = (verdictCount[verdict] || 0) + 1;
    });

    const labels = Object.keys(verdictCount);
    const values = Object.values(verdictCount);
    const backgroundColors = [
      "#4ade80", // green
      "#f87171", // red
      "#60a5fa", // blue
      "#facc15", // yellow
      "#a78bfa", // purple
      "#f472b6", // pink
      "#94a3b8", // gray
    ];

    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Submissions",
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1,
          hoverOffset: 12,
          cutout: "50%",
        },
      ],
    });

    setOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            boxWidth: 64,
            boxHeight: 16,
            padding: 16,
            usePointStyle: true,
          },
        },
        datalabels: {
          color: "#333",
          font: {
            weight: "bold",
            size: 12,
          },
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percentage = (value / total) * 100;

            return `${percentage.toFixed(1)}%`;
          },

          anchor: "end",
          align: "start",
          offset: 10,
        },
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    });
  }, [dataUser, location.pathname]);

  return (
    <div className="pie-chart">
      <div className="pie-chart__header">
        <div className="pie-chart__header-title">Submission By Verdict</div>
      </div>
      <div className="pie-chart__body">
        {isDataExist ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="chart--no-data">No data</div>
        )}
      </div>
    </div>
  );
}

export default PieChart;
