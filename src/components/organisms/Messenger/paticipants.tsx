import React, { forwardRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "../../../stores/rootReducer";
import Spinner from "../../atoms/Spinner/Spinner";
import {
  ITwilioConversation,
  ITwilioMessage,
  ITwilioStore,
} from "../../../types/twilio";
import {
  updateAddMembersModalState,
  updateStartChatModalState,
} from "../../../stores/twilio";
import { defaultProfilePic } from ".";
import styles from "./Messenger.module.scss";
import { createModuleStyleExtractor } from "../../../utils/css";
import { PlusIcon } from "../../../assets/svgIcons";
import { fetchCurrentUserId } from "../../../stores/users";
const cx = createModuleStyleExtractor(styles);

const Participants = ({
  twilioStore,
  openAddPeople,
  setOpenAddPeople,
}: {
  twilioStore: ITwilioStore;
  openAddPeople: boolean;
  setOpenAddPeople: (flag: boolean) => void;
}) => {
  const { isConversationLoading, conversations, activeConversation } =
    twilioStore;
  const dispatch = useDispatch();
  const userId: string | undefined = useSelector(fetchCurrentUserId);
  const isOwner = userId === twilioStore?.activeConversation?.createdBy;
  
  const showAddMembersModal = () => {
    dispatch(updateAddMembersModalState(true));
  };

  return (
    <div className={cx(["participants-area", openAddPeople ? "show" : "hide"])}>
      <div className={cx("asides-hdr")}>
        <div className={cx("left")}>
          <div className={cx("title")}>People</div>
        </div>
        <div className={cx("right")}>
          {isOwner && 
            <div
              className={cx("action-btn")}
              onClick={() => showAddMembersModal()}
            >
              <PlusIcon />
            </div>
          }
          <div
            className={cx(["action-btn", "cross-btn"])}
            onClick={() => setOpenAddPeople(false)}
          >
            &times;
          </div>
        </div>
      </div>
      <div className={cx("people-list")}>
        {activeConversation?.participants?.map((item, index) => (
          <>
            {!item.isLoading ? (
              <div key={index} className={cx("people")}>
                <div className={cx("meta")}>
                  <div className={cx("people-dp")}>
                    <div
                      className={cx("image")}
                      style={{
                        backgroundImage: `url("${
                          item?.attributes?.image_path ||
                          require("../../../assets/images/avatar.png")
                        }")`,
                      }}
                    />
                    <div className={cx("online-status")} />
                  </div>
                  <div className={cx("people-name")}>
                    {item?.attributes?.name || "(no-name)"}
                  </div>
                </div>
                {item.identity == activeConversation.createdBy && <div className={cx("desti")}>Owner</div>} 
                
              </div>
            ) : (
              <div key={index} className={cx("people")}>
                <div className={cx("meta")}>
                  <div className={cx(["people-dp", "holder"])} />
                  <div className={cx(["people-name", "holder"])} />
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Participants;
