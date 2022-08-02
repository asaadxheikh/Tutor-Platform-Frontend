import React, { useState } from "react";
import { Banner } from "../../layouts/Banner/Banner";
import { CategoryForm } from "./Categories/CategoryForm";
import { createModuleStyleExtractor } from "../../../utils/css";
import { SubCategoryForm } from "./SubCategories/SubCategoryForm";
import { ServiceType } from "./ServiceType/ServiceType";
import { MaterialUpload } from "./MaterialUpload/MaterialUpload";
import { UserDetails } from "./UserDetails/UserDetails";
import styles from "./NewOrder.module.scss";
import { BudgetAndDeadline } from "./BudgetAndDeadline/BudgetAndDeadline";
import { ProjectDetails } from "./ProjectDetails/ProjectDetails";
import { IBudgetDeadline, IUserDetails } from ".";
const cx = createModuleStyleExtractor(styles);

export function NewOrder() {
  const [category, setCategory] = useState("Humanities");
  const [subject, setSubject] = useState(0);
  const [details, setDetails] = useState<IUserDetails>({});
  const [budgetDeadline, setBudgetDeadline] = useState<IBudgetDeadline>({});
  const [files, setFiles] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [pagesCount, setPagesCount] = useState("1 Page(s) / 275 Words");

  const placeNewOrder = () => {
    console.log({
      category,
      subject,
      details,
      budgetDeadline,
      files,
      serviceType,
      projectDetails,
      pagesCount,
    });
  };

  return (
    <div className={cx("new-order-page")}>
      <Banner />
      <CategoryForm category={category} setCategory={setCategory} />
      <SubCategoryForm
        pagesCount={pagesCount}
        setPagesCount={setPagesCount}
        category={category}
        subject={subject}
        setSubject={setSubject}
      />
      <ServiceType serviceType={serviceType} setServiceType={setServiceType} />
      <MaterialUpload files={files} setFiles={setFiles} />
      <UserDetails details={details} setDetails={setDetails} />
      <BudgetAndDeadline
        serviceType={serviceType}
        budgetDeadline={budgetDeadline}
        setBudgetDeadline={setBudgetDeadline}
      />
      <div className={cx(["order-ftr", "main-app-width"])}>
        <div className={cx("ftr-content")}>
          <button className={cx("submit-button")}>Submit</button>
        </div>
      </div>
      {/* <div className={cx("NewOrder__root")}>
        <div className={cx("NewOrder__container")}>
          {serviceType !== 1 && <ProjectDetails projectDetails={projectDetails} setProjectDetails={setProjectDetails} />}
        </div>
      </div> */}
    </div>
  );
}
