import express from 'express';
import bodyParser from 'body-parser';
import { useNavigate, useParams } from 'react-router-dom';
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from './lib/supabase.js';

dotenv.config();

const App = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    process.env.CLIENT_URL,
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

App.post('/api/journal', async (req, res) => {
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

    const { data, error } = await supabase
        .from("journal_entries")
        .insert([
            {
            title: title.trim(),
            content: content.trim(),
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
    //const newEntry = {
      //  id: Date.now(),
        //title,
        //content,
        //date: new Date().toLocaleString(),
    //};

    //journalEntries.unshift(newEntry);

    //console.log("captured post", newEntry);

    //res.status(200).json({ 
        //sucess: true, 
       // message: "saved!",
        //entry: newEntry,
    //});
});

App.get('/api/journal', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("journal_entries")
            .select("*")
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

App.put("/api/journal/:id", async (req, res) => {
    try {
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
            .eq("id", id)
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

App.delete("/api/journal/:id", async (req, res) => {
    console.log("---DEBUGGING DELETE---");
    console.log("Raw param ID:", req.params.id, "Type:", typeof req.params.id);

    const id = Number(req.params.id);
    try {

        const { data, error } = await supabase
            .from("journal_entries")
            .delete()
            .eq("id", id)
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