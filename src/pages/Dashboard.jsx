import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard.jsx";
import JobFormModal from "../components/JobFormModal.jsx";
import AnalyticsModal from "../components/AnalyticsModal.jsx";
import "./styles/Dashboard.css";

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [showAnalytics, setShowAnalytics] = useState(false);


    const fetchJobs = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/jobs/");
            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);


    const handleCreate = () => {
        setEditingJob(null);
        setShowForm(true);
    };


    const handleEdit = (job) => {
        setEditingJob(job);
        setShowForm(true);
    };


    const handleCloseForm = () => {
        setShowForm(false);
        setEditingJob(null);
    };

    return (
        <div className="dashboard-container">
            <h1>Job Dashboard</h1>

            <div className="top-bar">
                <button type="button" onClick={handleCreate}>
                    Create Job
                </button>
                <button type="button" onClick={() => setShowAnalytics(true)}>
                    Analytics
                </button>
            </div>

            <div className="grid">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            refresh={fetchJobs}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <p>No jobs available</p>
                )}
            </div>


            {showForm && (
                <JobFormModal
                    close={handleCloseForm}
                    refresh={fetchJobs}
                    job={editingJob}
                />
            )}


            {showAnalytics && (
                <AnalyticsModal
                    jobs={jobs}
                    close={() => setShowAnalytics(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;