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

    // Fetch jobs from backend
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

    // Open create job modal
    const handleCreate = () => {
        setEditingJob(null);
        setShowForm(true);
    };

    // Open edit job modal
    const handleEdit = (job) => {
        setEditingJob(job);
        setShowForm(true);
    };

    // Close modal safely
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

            {/* Job Form Modal */}
            {showForm && (
                <JobFormModal
                    close={handleCloseForm}
                    refresh={fetchJobs}
                    job={editingJob}
                />
            )}

            {/* Analytics Modal */}
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