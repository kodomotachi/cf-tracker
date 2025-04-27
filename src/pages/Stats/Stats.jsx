import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Stats.css";
import PieChart from "../../components/PieChart";
import BarChartCountByRating from "../../components/BarChartCountByRating";
import BarChartRatingByACPercentage from "../../components/BarChartRatingByACPercentage";
import MultiplePieChart from "../../components/MultiplePieChart";
import HeatMapChart from "../../components/HeatMapChart";

function Stats({ dataUser, propContests }) {
  return (
    <div className="stats">
      <PieChart dataUser={dataUser} />
      <BarChartCountByRating dataUser={dataUser} />
      <BarChartRatingByACPercentage dataUser={dataUser} />
      <MultiplePieChart dataUser={dataUser} propContests={propContests} />
      <HeatMapChart dataUser={dataUser} />
    </div>
  );
}

export default Stats;
