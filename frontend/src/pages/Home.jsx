import React from 'react'
import { useContext } from 'react'
import { NoteContext } from '../context/NoteContext'
import NoteCard from '../components/NoteCard.jsx'

// const token = localStorage.getItem("accessToken");

// if (!token) {
//     window.location.href = "/login";
// }

function home() {
    const {notes, loading} =  useContext(NoteContext)
    // console.log(notes)
    if(loading){
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg text-gray-500">Loading ...</p>
        </div>
        )
    }
    if(notes.length===0){
        return(
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg text-gray-500">No notes available</p>
        </div>
        )
    }
    return(
        <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
            {notes.map((note)=>(
            <NoteCard key={note._id} note={note}/>
            ))}
        </div>
    )
}

export default home