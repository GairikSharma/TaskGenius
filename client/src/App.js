import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./routes";
import { ReminderContext } from "./context";

import DummyNav from "./components/navbar/dummynav";

import { useAuthState } from "react-firebase-hooks/auth";
import auth from "./firebase";
import { db } from "./firebase";
import { useState, useEffect } from "react";

import { getDocs } from "firebase/firestore";
import { collection } from "firebase/firestore";
import Loader from "./components/loader/loader";
import Landing from "./pages/Landing";

function App() {
  const [alltask, setAlltask] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");

  const remainderCollectionRef = collection(db, "reminders");
  const [deletetask, setDeleteTask] = useState(0);
  const [markdone, setMarkDone] = useState(0);
  const [donelist, setDoneList] = useState([]);
  const [sidebar, setShowSidebar] = useState(false);

  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const getTask = async () => {
      const task = await getDocs(remainderCollectionRef);
      setAlltask(task.docs.map((t) => ({ ...t.data(), id: t.id })));
      // console.log(task.docs.map((t) => ({ ...t.data(), id: t.id })));
    };
    getTask();
  }, []);

  return (
    <ChakraProvider>
      <BrowserRouter>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="App">
            <ReminderContext.Provider
              value={{
                title,
                setTitle,
                description,
                setDescription,
                date,
                setDate,
                alltask,
                setAlltask,
                deletetask,
                setDeleteTask,
                markdone,
                setMarkDone,
                donelist,
                setDoneList,
                email,
                setEmail,
                designation,
                setDesignation,
                sidebar,
                setShowSidebar
              }}
            >
              {user ? <Routing /> : <Landing />}
            </ReminderContext.Provider>
          </div>
        )}
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
