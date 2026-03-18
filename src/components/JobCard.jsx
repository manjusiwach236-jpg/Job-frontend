import React from "react";
import "./styles/JobCard.css";

const JobCard = ({ job, refresh, onEdit }) => {
    const formatField = (field) => {
        if (!field) return "N/A";
        if (Array.isArray(field)) return field.join(", ");
        if (typeof field === "string") return field;
        return "N/A";
    };


    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/jobs/${job.id}/`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    refresh();
                } else {
                    const errText = await res.text();
                    console.error("Delete Error:", errText);
                }
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };


    const handleDuplicate = async () => {
        try {
            const data = new FormData();

            data.append("job_title", job.job_title);
            data.append("status", formatField(job.status));
            data.append("job_category", formatField(job.job_category));
            data.append("address", job.address);
            data.append("city", job.city);
            data.append("state", job.state);
            data.append("start_date", job.start_date);
            data.append("end_date", job.end_date);
            data.append("description", job.description || "");

            if (job.profile_image) {
                data.append("profile_image", job.profile_image);
            }

            const res = await fetch(`http://127.0.0.1:8000/api/jobs/`, {
                method: "POST",
                body: data
            });

            if (res.ok) {
                refresh();
            } else {
                const errText = await res.text();
                console.error("Duplicate Error:", errText);
            }
        } catch (err) {
            console.error("Duplicate Error:", err);
        }
    };

    return (
        <div className="job-card">
            {job.profile_image && (
                <img
                    src={job.profile_image}
                    alt={job.job_title}
                    className="job-profile-image"
                />
            )}

            <h3 className="job-title">{job.job_title}</h3>


            <p><strong>Status:</strong> {formatField(job.status)}</p>
            <p><strong>Category:</strong> {formatField(job.job_category)}</p>

            <div className="job-card-buttons">
                <button className="edit-btn" onClick={() => onEdit(job)}>Edit</button>
                <button className="delete-btn" onClick={handleDelete}>Delete</button>
                <button className="duplicate-btn" onClick={handleDuplicate}>Duplicate</button>
            </div>
        </div>
    );
};

export default JobCard;