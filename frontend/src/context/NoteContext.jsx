import { useState } from "react";
import { createContext } from "react";
import BACKEND_URL from "../api/url";
import { useEffect } from "react";
export const NoteContext = createContext();

export const NoteProvider=({children}) =>{

    const [notes, setNotes] = useState([]);
    const [loading,  setLoading] = useState(false);

    //fetch all notes
    const getNotes = async() =>{
        const token = localStorage.getItem("accessToken");
        if (!token) return; // ← stop immediately if not logged in
        setLoading(true);
        try{
            const response = await BACKEND_URL.get("/get-notes")
            setNotes(response.data); 
        }catch(error){
            console.error("Error fetching notes : ", error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getNotes();
    }, [])

    //create note
    const createNote = async(note) => {
        const response = await BACKEND_URL.post("/create-note", note)
        setNotes([response.data, ...notes])
    }

    //update note 
    const updateNote = async (id, updatedData) => {
    const response = await BACKEND_URL.put(`/update-note/${id}`, updatedData);

        setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note._id === id ? response.data : note
                )
            );
    };

    //delete note
    const deleteNote = async(id) =>{
        await BACKEND_URL.delete(`/delete-note/${id}`)
        setNotes(notes.filter((note)=>(note._id!==id)))
    }

    return(
        <NoteContext.Provider value={{notes, loading, createNote, updateNote, deleteNote, getNotes}}>
            {children}
        </NoteContext.Provider>
    )

}

