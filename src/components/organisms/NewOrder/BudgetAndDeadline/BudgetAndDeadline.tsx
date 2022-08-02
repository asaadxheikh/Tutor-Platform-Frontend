import React, { useEffect, useState } from "react";
import TimezoneSelect from "react-timezone-select";
import DatePicker from "react-modern-calendar-datepicker";
import {
  DropDownIcon,
  CalenderIcon,
  TimeIcon,
} from "../../../../assets/svgIcons";
import { createModuleStyleExtractor } from "../../../../utils/css";
import { IBudgetDeadline } from "..";
import styles from "./BudgetAndDeadline.module.scss";
const cx = createModuleStyleExtractor(styles);

export function BudgetAndDeadline({
  budgetDeadline,
  serviceType,
  setBudgetDeadline,
}: {
  serviceType: string;
  budgetDeadline: IBudgetDeadline;
  setBudgetDeadline: React.Dispatch<React.SetStateAction<IBudgetDeadline>>;
}) {
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  useEffect(() => {
    setBudgetDeadline((budgetDeadline) => ({
      ...budgetDeadline,
      timezone,
    }));
  }, [timezone]);

  const changeHandler = (e: any) => {
    setBudgetDeadline((budgetDeadline) => ({
      ...budgetDeadline,
      [e.target.name]: e.target.value,
    }));
  };

  const [dropTimezone, setDropTimeZone] = useState(false);
  const [timeZone, setTimeZone] = useState("Select Timezone");
  const timeZoneList = [
    { label: "Select Timezone" },
    { label: "Medium School" },
    { label: "Primary School" },
  ];

  useEffect(() => {
    document.body.addEventListener("click", () => {
      setDropTimeZone(false);
    });
  });

  return (
    <div className={cx("budget-detail-form")}>
      <div className={cx(["wrapper", "main-app-width"])}>
        <div className={cx("content")}>
          <div className={cx("title")}>Tell your Budget and Deadline</div>
          <div className={cx("form")}>
            <div className={cx("field")}>
              <div className={cx("lbl")}>Budget ($)</div>
              <input type="text" className={cx("iput")} placeholder="ex. 50" />
            </div>
            <div className={cx("field")}>
              <div className={cx("lbl")}>Coupon Code</div>
              <input
                type="text"
                className={cx("iput")}
                placeholder="Enter Coupon Code"
              />
            </div>
            <div className={cx("field")}>
              <div className={cx("lbl")}>
                Tips ($) <span>(Optional)</span>
              </div>
              <input type="text" className={cx("iput")} placeholder="ex. 5" />
            </div>
            <div className={cx("field")}>
              <div className={cx("lbl")}>Select Timezone</div>
              <button
                className={cx("custom-selector")}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropTimeZone(!dropTimezone);
                }}
              >
                {timeZoneList.map(
                  (item, index) =>
                    timeZone == item.label && (
                      <div
                        className={cx("selector-input")}
                        key={index.toString()}
                      >
                        <div className={cx("selected-text")}>{item.label}</div>
                        <div className={cx("arrow-icon")}>
                          <DropDownIcon />
                        </div>
                      </div>
                    )
                )}
                {dropTimezone && (
                  <div className={cx("selector-options")}>
                    {timeZoneList.map((item, index) => (
                      <button
                        key={index}
                        className={cx("selector-option-item")}
                        onClick={() => {
                          setTimeZone(item.label);
                        }}
                      >
                        <div className={cx("option-item-txt")}>
                          {item.label}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </button>
            </div>
            <div className={cx("field")}>
              <div className={cx("lbl")}>Select Date</div>
              <div className={cx(["iput", "date-picker"])}>
                <DatePicker
                  value={budgetDeadline.startDate}
                  onChange={(day) =>
                    setBudgetDeadline((budgetDeadline) => ({
                      ...budgetDeadline,
                      startDate: day,
                    }))
                  }
                  inputPlaceholder="Select Date"
                  shouldHighlightWeekends
                />
                <div className={cx("icon")}>
                  <CalenderIcon />
                </div>
              </div>
            </div>
            <div className={cx("field")}>
              <div className={cx("lbl")}>Select Time</div>
              <div className={cx(["iput", "date-picker"])}>
                <DatePicker
                  value={budgetDeadline.startDate}
                  onChange={(day) =>
                    setBudgetDeadline((budgetDeadline) => ({
                      ...budgetDeadline,
                      startDate: day,
                    }))
                  }
                  inputPlaceholder="Select Time"
                  shouldHighlightWeekends
                />
                <div className={cx("icon")}>
                  <TimeIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
