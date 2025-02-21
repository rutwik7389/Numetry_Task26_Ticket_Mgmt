import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/tickets";

function App() {
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const response = await axios.get(API_URL);
        setTickets(response.data);
    };

    const addTicket = async (e) => {
        e.preventDefault();
        await axios.post(API_URL, { subject, description });
        setSubject("");
        setDescription("");
        fetchTickets();
    };

    const updateTicket = async (id, status) => {
        await axios.put(`${API_URL}/${id}`, { status });
        fetchTickets();
    };

    const deleteTicket = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchTickets();
    };

    return (
        <div className="container">
            <h2>Customer Support Ticket System</h2>

            <div className="form-container">
                <form onSubmit={addTicket} className="ticket-form">
                    <h3>Create a New Ticket</h3>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <button type="submit">Create Ticket</button>
                </form>
            </div>

            <h3>Tickets</h3>
            <div className="filter-container">
                <label>Filter by Status:</label>
                <select onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subject</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets
                            .filter((ticket) => !statusFilter || ticket.status === statusFilter)
                            .map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.subject}</td>
                                    <td>{ticket.description}</td>
                                    <td>
                                        <select
                                            value={ticket.status}
                                            onChange={(e) => updateTicket(ticket.id, e.target.value)}
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="delete-btn" onClick={() => deleteTicket(ticket.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
