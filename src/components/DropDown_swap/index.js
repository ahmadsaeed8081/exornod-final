import React, { useState } from "react";
import { ArrowDownIcon } from "../../assets/Icons";
// import { UpArrowIcon ,ArrowDownIcon } from "../../assets/Icons";

const DropDown = ({filteredTokensList}) => {
  const [hide, setHide] = useState(false);
  const tokensList = [
    { title: "USDT", icon: "./images/USDT.png" },

  ];
  return (
    <div className="dropDown flex aic flex-col rel ">
      <div className="category flex aic">
        <div
          className="cbox cleanbtn flex aic rel pointer"
        >
          <div className="slt flex items-center w-full">
            <div className="unit-name flex items-center w-full">
              <span
                className="unit-eng flex items-center w-full"
                placeholder="EXOR"
              >
                EXOR
              </span>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default DropDown;
