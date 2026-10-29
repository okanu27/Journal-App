import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Edit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [title, setTittle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    //Fetch the current entry data to update.
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/journal/${id}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.success) {
                    setTittle(result.data.title);
                    setContent(result.data.content);
                }
                setLoading(false);
            })
            .catch((err) => console.error((err)));
    }, [id]);

    // Handle form submission.

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/journal/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, content })
            });

            const result = await response.json();
            if (result.success) {
                navigate("/"); //Redirect back to the Home page.
            }

        } catch (error) {
            console.error("Update failed:", error);
        }
    }

    if (loading) return <div className="text-center p-10">Loading entry...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
                Edit Journal Entry
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTittle(e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <textarea
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Save Changes
                </button>

            </form>
        </div>
    );
}

export default Edit;