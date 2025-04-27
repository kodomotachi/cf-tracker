import React from "react";
import "./ScrollUpBtn.css";

function ScrollUpBtn() {
  return (
    <div
      className="scroll-up-btn"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      <i class="fa-solid fa-up-long"></i>
    </div>
  );
}

export default ScrollUpBtn;
