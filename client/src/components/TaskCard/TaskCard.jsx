import React from "react";
import "./taskcard.css";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";

function LazyTaskCard() {
  return (
    <>
      <div className="card-body">
        <div className="Title-more-btn">
          <div className="task-title">Task title</div>
        </div>
        <div className="task-description">Task Description</div>
        <div className="due-date">
          <SlCalender className="due" />
        </div>
        <div className="done-delete-buttons">
          <MdOutlineFileDownloadDone className="done-delete-button" />
          <BsTrash className="done-delete-button" />
        </div>
      </div>
    </>
  );
}

export default LazyTaskCard;
