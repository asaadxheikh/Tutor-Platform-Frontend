import React from "react";
import { createModuleStyleExtractor } from "../../../../utils/css";
import { categories } from "..";
import styles from "./CategoryForm.module.scss";
const cx = createModuleStyleExtractor(styles);

export function CategoryForm({
  category,
  setCategory,
}: {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className={cx("categories-section")}>
      <div className={cx(["wrapper", "main-app-width"])}>
        <div className={cx("content")}>
          <div className={cx("title")}>Select a Cateogry</div>
          <div className={cx("categories-list")}>
            {categories.map((cat, index) => (
              <div
                key={index}
                className={cx([
                  "category-item",
                  category === cat.title ? "active" : "",
                ])}
                onClick={() => setCategory(cat.title)}
              >
                <div className={cx("label")}>{cat.title}</div>
                <img src={cat.image} className={cx("image")} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
