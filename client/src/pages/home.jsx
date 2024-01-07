import React, { useContext, useState } from "react";
import "../styles/home.css";
import "../components/TaskCard/taskcard.css";
import BasicUsage from "../components/modal/modal";

import { db } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ReminderContext } from "../context";
import auth from "../firebase";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { SlCalender } from "react-icons/sl";
import AddTask from "../components/AddTaskComponent/AddTask";

function Home() {
  const [disable, setDisable] = useState(false);
  const { alltask, setAlltask, deletetask, setDeleteTask } = useContext(ReminderContext);
  const completedArr = [
    {
      title: "",
      description: "",
    },
  ];
  {
    alltask.map((complete) => {
      if (complete.email === auth.currentUser.email) {
        completedArr.push(complete.title, complete.description);
      }
    });
  }

  const markAsDone = async (_status, id) => {
    const markDoneTask = doc(db, "reminders", id);
    const updateState = { status: 1 };

    //UI Update
    const tasksAfterUpdate = alltask.filter((item) => {
      if (item.id === markDoneTask.id) {
        item.status = 1
      }
      return item
    })
    setAlltask(tasksAfterUpdate)

    //DB Update
    await updateDoc(markDoneTask, updateState);
    setDeleteTask(true);
    if (updateDoc) {
      setDisable(true);
    }
  };

  const deleteTask = async (id) => {
    try {
      const userTask = doc(db, "reminders", id);

      //UI update
      const tasksAfterDelete = alltask.filter(item => item.id !== userTask.id)
      setAlltask(tasksAfterDelete)

      //DB Update
      await deleteDoc(userTask);
      setDeleteTask(deletetask + 1);

    } catch (error) {
      console.log(error);
    }
  };

  const currentUserData = [];
  {
    alltask.map((t) => {
      if (t.email === auth.currentUser.email) {
        currentUserData.push(t.title);
      }
    });
  }

  //format date
  // function formatDate(dateString) {
  //   const options = { day: "numeric", month: "long" };
  //   const formattedDate = new Date(dateString).toLocleDateString(
  //     undefined,
  //     options
  //   );
  //   return formattedDate;
  // }

  //format time
  function formatTime(dateString) {
    const options = { hour: "numeric", minute: "numeric" };
    const formattedTime = new Date(dateString).toLocaleTimeString(
      undefined,
      options
    );
    return formattedTime;
  }
  return (
    <>
      <div className="tasks">
        {alltask.map((t, index) => {
          if (t.email === auth.currentUser.email) {
            return (
              <div className="card-body" key={index}>
                <div className="Title-more-btn">
                  <div
                    className={t.status ? "task-title-diasable" : "task-title"}
                  >
                    {t.title}
                  </div>
                </div>
                <div
                  className={
                    t.status ? "task-description-disable" : "task-description"
                  }
                >
                  {t.description}
                </div>
                {t.status ? (
                  <div className="due-date">
                    <div className="done">Done</div>
                  </div>
                ) : (
                  <div className="due-date">
                    <SlCalender className="due" />Due {new Date(t.date).toLocaleString()}
                  </div>
                )}
                <div className="done-delete-buttons">
                  <MdOutlineFileDownloadDone
                    onClick={() => {
                      markAsDone(t.markDone, t.id);
                    }}
                    className="done-button"
                  />
                  <BsTrash
                    onClick={() => {
                      deleteTask(t.id);
                    }}
                    className="delete-button"
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="sticky-add-button">
        <BasicUsage />
      </div>
      {currentUserData.length == 0 && <AddTask />}
    </>
  );
}

export default Home;
