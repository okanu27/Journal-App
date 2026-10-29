import React, { useState } from 'react';


function Compose({ onNewEntry }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');  
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

      const dateOption = {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' };

      const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setError("Title and Content are required.");
            setTimeout(() => {
              setError("");
            }, 2000);
            return;
        }

        {/* Create a new journal entry object */}
        const newEntry = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleDateString('en-US', dateOption) // Add the current date and time
        };

        console.log("newEntry", newEntry);

        setSending(true);

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/journal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEntry),
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || "Failed to send journal");
          }

          console.log("saved entry", data.entry);

          if (onNewEntry) onNewEntry(data.entry);

          setTitle("");
          setContent("");
          setSubmitted(true);

          setTimeout(() => {
          setSubmitted(false);
          setSending(false);
          }, 2000);

        } catch (error) {
          console.error("Failed to create a journal", error);
          setError(error.message || "something went wrong.");
          setSending(false);
        }
  };

  return (
    <section id="compose" className="max-w-3xl min-h-screen mx-auto mt-8 mb-8 p-6 bg-white rounded-sm shadow-md">
      <h1 className="text-3xl font-bold mb-4">
            Compose a New Journal Entry
        </h1>

      <p className="mb-4 text-gray-700">
        Share your thoughts, experiences, and reflections in your personal journal. Use the form below to create a new entry.
      </p>

      <div className="border-t border-red-300 pt-4" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title for your journal entry" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm" />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} rows="5" placeholder="Write your journal entry here..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"></textarea>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {sending ? "Submitting..." : "Submit" }
        </button>

        <div className="min-h-6">
            <p className="text-red-500 font-semibold">
                {error}
            </p>
        </div>

      </form>

      <div className='min-h-6'>
        {submitted && (
          <p className='text-green-500 text-center font-semibold'>
            Journal submitted successfully!
          </p>
        )}
      </div>

    </section>
  );
}

export default Compose;