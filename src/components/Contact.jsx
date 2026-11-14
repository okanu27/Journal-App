import React, { useState} from "react";


function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [send, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Handle form submission logic here
        if (!name || !email || !message) {

            setError("Please fill in all fields and try again.");
            setTimeout(() => {
                setError("");
            }, 4000 );
            
            console.error("Fill in all fields and try again.");
            return;
        }

        const formData = {
            name: name,
            email: email,
            message: message
        };

        setSending(true);

        try {
            const response = await fetch (`${import.meta.env.VITE_API_URL}/api/journal/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send your message.");
            }

            console.log(`information`, formData);

            setName("");
            setEmail("");
            setMessage("");

            setSending(false);
            setSubmitted(true);
        setTimeout(() => {
            //setSending(false);
            setSubmitted(false);
        }, 3000);

        } catch (error) {
            console.error("Failed to send message", error);
            setError("Something went wrong, try again." || error.message);
        }

    };


  return (
    <section id="contact" className="max-w-3xl min-h-screen mx-auto mt-10 mb-8 p-6 bg-white rounded-sm shadow-md">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4 text-gray-700">
        If you have any questions, sponsorship, or feedback about My Journal, feel free to reach out to us!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 block w-full border p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 block w-full border p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={send || submitted}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
          >
            {submitted ? "Sent! ⎷" : send ? "Sending..." : "Send Message" }
          </button>

          <div className="min-h-6">
            <p className="text-red-400 text-center font-semibold">
                {error}
            </p>
          </div>

        </div>
      </form>

      <div className="min-h-6">
        {submitted && (
            <p className="text-green-400 text-center font-semibold">
                ⎷ Message sent successfully, we'll get back to soon.
            </p>
        )}
      </div>
    </section>
  );
}

export default Contact;