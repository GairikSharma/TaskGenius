import React, { useContext, useState } from "react";
import { ReminderContext } from "../../context";
import auth from "../../firebase";
import { SpinnerIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import "./modal.css";

function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    title,
    setTitle,
    description,
    setDescription,
    date,
    setDate,
  } = useContext(ReminderContext);
  const [showErrAlert, setShowErrAlert] = useState(false);
  const [msg, setMsg] = useState("Enter all the details properly");
  const { alltask, setAlltask } = useContext(ReminderContext)
  const [adding, setAdding] = useState(false)

  const showAlert = () => {
    setShowErrAlert(true);
    setTimeout(() => {
      setShowErrAlert(false);
    }, 3000);
  };

  const addRemainder = async (e) => {
    if (title === "" || description === "" || date === "") {
      if (title === "" && description != "" && date != "") {
        setMsg("Enter title");
      } else if (description === "" && title != "" && date != "") {
        setMsg("Enter description");
      } else if (date === "" && description != "" && title != "") {
        setMsg("Enter date");
      }
      showAlert();
    } else {
      e.preventDefault();
      setAdding(true)
      const task = {
        title,
        description,
        date,
        email: auth.currentUser.email
      }
      await addDoc(collection(db, "reminders"), task);
      setAlltask([task, ...alltask])
      setAdding(false)
      onClose() //Close the modal
    }
  };
  return (
    <>
      <Button colorScheme="gray" color={"#427ef5"} onClick={onOpen}>
        Add Task +
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {showErrAlert && (
            <Alert status="error" className="alert" zIndex={"100"}>
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          )}
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Add title"
              my={2}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />

            <Textarea
              placeholder="Add description"
              my={2}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <Input
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
              my={2}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="twitter"
              onClick={addRemainder}
              onClose={onClose}
              disabled={title === "" || description === "" || date === ""}
            >
              {adding ?
                <SpinnerIcon className="spinner" />
                : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default BasicUsage;
