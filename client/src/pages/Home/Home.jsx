import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/Cards/EmptyCard";


export default function Home() {
  const [openAddEditNotes, setOpenAddEditNotes] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
});

  const [user, setUser] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();

  //Get User Info
  const getUser = async(id) => {
    try {
      const response = await axiosInstance.get("/api/v1/user/get-user");

      if (response.data && response.data.user) {
        setUser(response.data.user);
      }

    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login")
      }
    }
  };

  // Get all notes
  const getAllNotes = async() => {
    const response = await axiosInstance.get("/api/v1/note/notes/all");

   try {
     if (response.data && response.data.notes) {
      setAllNotes(response.data.notes);
    }
  } catch (error) {
    console.log("An unexpected error has occurred. Please try again.")
  };
}

 //Edit Note
 const handleEdit = (noteDetails) => {
  setOpenAddEditNotes({ isShown: true, data: noteDetails, type: "edit"});
}

//Delete Note
const deleteNote = async(data) => {
  const noteId = data.id;
  try {
    const response = await axiosInstance.delete("/api/v1/note/delete-note/" + noteId);

    if (response.data && !response.data.error) {
      showToastMessage("Note Deleted Successfully", 'delete');
      getAllNotes();
    }

  } catch (error) {
    if (error.response && error.response.data 
      && error.response.data.message) {
        console.log("An unexpected error has occurred. Please try again.")
      }
  }
}

//Update Pin
const updateIsPinned = async(noteData) => {
  const noteId = noteData.id;
    try {
      const response = await axiosInstance.put("/api/v1/note/update-note-pinned/" + noteId, {
        isPinned: !noteData.isPinned,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }

    } catch (error) {
      console.log(error);
    }
}

//Search Notes

const handleCloseToast = () => {
  setShowToastMsg({
    isShown: false,
    message: "",
  });
};

const showToastMessage = (message, type) => {
  setShowToastMsg({
    isShown: true,
    message,
    type
  });
};

  useEffect(() => {
    getAllNotes();
    getUser();
    return () => {};
  }, [])

 


  return(
    <>
      <Navbar user={user} />

      <div className="container mx-auto">
        {
        allNotes.length > 0 
          ?
          (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:px-2  gap-4 mt-8">
          {
            allNotes.map((note, index) => (
              <NoteCard 
                key={note.id}
                title={note.title} 
                date={note.createdOn} 
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => deleteNote(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))
          }
        
          </div>
          )
          :
          (
            <EmptyCard message={`Start creating your first note! Click the 'Add' button to get started.`} />
          )
        }
      </div>
      <button className="w-16 h-16 flex items-center justify-center rounded-2xl
      bg-primary hover:bg-blue-600 absolute right-10 bottom-10" 
        onClick={() => {
          setOpenAddEditNotes({ isShown: true, type: "add", data:null })
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal 
        isOpen={openAddEditNotes.isShown}
        onRequestClose = {() => {}}
        style = {{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-[3/4] bg-white rounded-md mx-auto
        mt-14 p-5 overflow-scroll"
      >

        <AddEditNotes 
          type={openAddEditNotes.type}
          noteData={openAddEditNotes.data}
          onClose={() => {
            setOpenAddEditNotes({isShown: false, type: "add", data: null })
          }}

          getAllNotes = {getAllNotes}
          showToastMessage = {showToastMessage}
        />

      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />

    </>
  )
}