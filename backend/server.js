import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from './lib/supabase.js';
import { getUserSupabase } from './lib/userSupabase.js';
import { verifyToken } from './middleware/verifyToken.js';


dotenv.config();

const App = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://journalapp1.vercel.app",
    "http://localhost:5174",
].filter(Boolean);

App.use(cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    })
);

App.use(express.json());
App.use(bodyParser.urlencoded({ extended: true }));
App.use(express.static('public'));

let journalEntries = [];

App.post('/api/journal', verifyToken, async (req, res) => {
    try {

    console.log("request body", req.body);

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            sucess: false,
            message: "Title and content are required.",
            received: req.body,
        });
    }

    const user = await getUserSupabase(req.accessToken);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. User not found.",
        });
    }

    console.log("Authenticated user:", user);

    const { data, error } = await supabase
        .from("journal_entries")
        .insert([
            {
            title: title.trim(),
            content: content.trim(),
            user_id: req.user.id,
            },
        ])
        .select()
        .single();

        if (error) {
            console.error("Supabase error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to save journal entry.",
            });
        }

        console.log("saved journal entry:", data);

        res.status(200).json({
            success: true,
            message: "Journal entry saved successfully.",
            entry: data,
        });
    } catch (error) {
        console.error("Server error:", error.message);

        res.status(500).json({
            success: false,
            message: "An unexpected server error occurred.",
        });
    }
});

App.post("/api/journal/contact", async (req, res) => {
    
    try {

        console.log("body:", req.body);

        const { name, email, message } = req.body;

        if(!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const { data, error } = await supabase
            .from("contact_submissions")
            .insert({
                    name: name.trim(),
                    email: email.trim(),
                    message: message,
                });
            
        if (error) {

            return res.status(500).json({
                success: false,
                message: "Failed to save your contact form.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Your contact was sent successfully.",
            data,
        });

    } catch (error) {
        console.error("server error", error.message);

        return res.status(500).json({
            success: false,
            message: "Unexpected server error occured",
        });
    }
});

App.post("/api/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
        });

        if (error) {
            console.error("Supabase error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to register user.",
            });
        }

        console.log("Registration successful:", data);

        res.status(200).json({
            success: true,
            message: "Registration successful! Please check your email to confirm your account.",
            data,
        });
    } catch (error) {
        console.error("Server error:", error.message);

        res.status(500).json({
            success: false,
            message: "An unexpected server error occurred.",
        });
    }
});

App.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        });

        if (error) {
            console.error("Supabase error:", error.message);

            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        console.log("Login successful:", data);

        res.status(200).json({
            success: true,
            message: "Login successful!",
            data,
        });
    } catch (error) {
        console.error("Server error:", error.message);

        res.status(500).json({
            success: false,
            message: "An unexpected server error occurred.",
        });
    }
});

App.post("/api/logout", async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signOut();

        if (error) {
            console.error("Supabase error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Failed to log out.",
            });
        }

        console.log("Logout successful:", data);

        res.status(200).json({
            success: true,
            message: "Logout successful!",
            data,
        });
    } catch (error) {
        console.error("Server error:", error.message);

        res.status(500).json({
            success: false,
            message: "An unexpected server error occurred.",
        });
    }
});


App.get('/api/journal', verifyToken, async (req, res) => {
    try {

        const user = await getUserSupabase(req.accessToken);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found.",
            });
        }

        console.log("Authenticated user:", user);

        const { data, error } = await supabase
            .from("journal_entries")
            .select("*")
            .eq("user_id", req.user.id)
            .order("created_at", { ascending: false });


        if (error) throw error;
            
    return res.json({ success: true, data });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
        success: false,
        message: "Failed to retrieve journal entries.",
        });
    }
});

App.put("/api/journal/:id", verifyToken, async (req, res) => {
    try {

        const user = await getUserSupabase(req.accessToken);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found.",
            });
        }

        console.log("Authenticated user:", user);

        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and Content are required.!",
            });
        }

        const { data, error } = await supabase
            .from("journal_entries")
            .update({
                title: title.trim(),
                content: content.trim(),
            })
            .eq("id", req.params.id)
            .eq("user_id", req.user.id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0 ) {
            return res.status(404).json({
                success: false,
                message: "No matching journal entry found to update."
            });
        }

        return res.json({
            success: true,
            message: "Journal entry updated!",
            entry: data,
        });
    } catch (error) {
        console.error("Error updating journal entry:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update journal entry.",
        });
    }
});

App.delete("/api/journal/:id", verifyToken, async (req, res) => {

    const id = Number(req.params.id);
    try {

        const { data, error } = await supabase
            .from("journal_entries")
            .delete()
            .eq("id", req.params.id)
            .eq("user_id", req.user.id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching entry found to delete."
            });
        }

        return res.json({
            success: true,
            message: "Entry deleted successfully!"
        });
    } catch (error) {
        console.error("Error deleting journal entry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete entry."
        });
    }
});

App.get('/health', (req, res) => {
  res.send('Welcome to the Journal API');
});

App.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});