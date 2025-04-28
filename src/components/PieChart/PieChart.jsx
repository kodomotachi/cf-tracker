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
    const statusColors = {
      FAILED: "#e74c3c",
      OK: "#27ae60",
      PARTIAL: "#f1c40f",
      COMPILATION_ERROR: "#e67e22",
      RUNTIME_ERROR: "#d35400",
      WRONG_ANSWER: "#e26255",
      TIME_LIMIT_EXCEEDED: "#9b59b6",
      MEMORY_LIMIT_EXCEEDED: "#3498db",
      IDLENESS_LIMIT_EXCEEDED: "#2980b9",
      SECURITY_VIOLATED: "#8e44ad",
      CRASHED: "#2c3e50",
      INPUT_PREPARATION_CRASHED: "#34495e",
      CHALLENGED: "#16a085",
      SKIPPED: "#95a5a6",
      TESTING: "#f39c12",
      REJECTED: "#e74c3c",
      SUBMITTED: "#3498db",
    };

    const backgroundColors = labels.map((status) => statusColors[status]);

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
