import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { supabase } from '../lib/supabaseClient.js';


function Home() {

    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState("");
    const [editingTitle, setEditingTitle] = useState("");
    const [editingContent, setEditingContent] = useState("");

    const dateOption = {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        };

   useEffect(() => {
    const fetchJournalEntries = async () => {
        try {

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error("User is not authenticated. Please log in.");
                return;
            }

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/journal`,
                {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                }
            );

            const result = await response.json();

            if (result.success) {
                setEntries(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchJournalEntries();
   }, []);

// Entry updating Function
   const handleUpdate = async (id) => {
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.error("User is not authenticated. Please log in.");
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/journal/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ title: editingTitle, content: editingContent })
        });

        const result = await response.json();

        if (result.success) {
            //Update the local state arrays seamlessly without reloading the page
            setEntries(entries.map(entry =>
                entry.id === id ? {...entry, title: editingTitle, content: editingContent } : entry
            ));
            setEditingId(null); // Turn off editing mode.
        }
    } catch (err) {
        console.error("Failed to update entry:", err);
        }
   };

      const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this journal entry?")) return;

        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error("User is not authenticated. Please log in.");
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/journal/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            // Check if the server returned a success status (200-299)
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server responded with ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
            } else {
                console.error(result.message);
            }
        } catch (err) {
            console.error("Failed to delete journal entry:", err.message);
            alert(`Delete failed: ${err.message}`); // Notify user of the 404
        }
   };

  return (
        <section id="home" 
            className="relative h-[calc(100vh-64px)] overflow-y-auto rounded-sm">
            <div 
                className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl text-center font-bold text-white mb-5">
                    Welcome to My Journal
                </h1>

                <p className="text-gray-200 text-center mb-2">
                    This is a simple journal application where you can post your thoughts and experiences.
                </p>

                <p className="text-gray-200 text-center">
                    Use the navigation bar above to explore different sections of the application.
                </p>

            </div>


            {/* Placeholder for journal entries display. You can map over postEntries and display them here. */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {entries.length === 0 ? (
                    <p className="text-white text-center">
                         loading journal entries or no entries available. Start by composing a new entry!
                    </p>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="border max-w-3xl mx-auto border-gray-200 rounded-lg shadow-xl/20 bg-mist-300 py-6 px-6 mb-4">
                            {editingId === entry.id ? (
                                // EDITING MODE INTERFACE
                                <div className='space-y-3'>
                                    <input
                                        type='text'
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        className='w-full p-2 border rounded-md font-semibold'
                                    />

                                    <textarea
                                        type="text"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                        className='w-full p-2 border rounded-md font-semibold'
                                    />
                                    <div className='flex gap-2'>
                                        <button 
                                            onClick={() => handleUpdate(entry.id)}
                                            className='bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-emerald-700'
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => handleUpdate(entry.id)}
                                            className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-400'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            
                            ) : (
                            <article>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {entry.title}
                                </h2>

                                <p className="text-gray-600 mb-4">
                                    {entry.content}
                                </p>

                                <p className="text-sm border-t border-gray-300 text-gray-500 pt-4">
                                    Posted On: {new Date(entry.created_at).toLocaleDateString('en-US',
                                        dateOption
                                    )}
                                </p>

                                <div className='flex gap-4 mt-2'>
                                    <button
                                        onClick={() => {
                                            setEditingId(entry.id);
                                            setEditingTitle(entry.title);
                                            setEditingContent(entry.content);
                                        }}
                                        className='bg-blue-600 text-white px-2 py-2 rounded-md hover:bg-blue-700 text-sm font-medium block'
                                    >
                                        <EditNoteIcon style={{ fontSize: '1.25rem' }} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className='bg-red-600 text-white px-2 py-2 rounded-md hover:bg-red-700 text-sm font-medium'
                                    >
                                        <DeleteIcon style={{ fontSize: '1.25rem' }} />
                                        
                                    </button>
                                </div>
                            </article>
                            )}
                        </div>
                    ))
                )}
            </div>

    </section>
  )
}

export default Home;