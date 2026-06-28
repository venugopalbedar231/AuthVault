import { useEffect, useState } from "react";

function Dashboard() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <h1>My Notes</h1>

      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <h2>{note.title}</h2>

            <p>{note.content}</p>

            <span className="date">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;