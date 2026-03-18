import React, { useState, useEffect } from "react";
import "./styles/JobFormModal.css";

const JobFormModal = ({ close, refresh, job }) => {

    const [form, setForm] = useState({
        title: "",
        status: [],
        category: [],
        address: "",
        city: "",
        state: "",
        start_date: "",
        end_date: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");


    useEffect(() => {
        if (job) {
            setForm({
                title: job.job_title || "",
                status: job.status ? job.status.split(",") : [],
                category: job.job_category ? job.job_category.split(",") : [],
                address: job.address || "",
                city: job.city || "",
                state: job.state || "",
                start_date: job.start_date || "",
                end_date: job.end_date || "",
                description: job.description || "",
            });

            setPreview(job.profile_image || null);
            setImage(null);
        }
    }, [job]);


    const toggleSelect = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter((v) => v !== value)
                : [...prev[field], value],
        }));
        setError("");
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async () => {


        if (!form.title || !form.status.length || !form.category.length) {
            setError("Please fill all required fields");
            return;
        }

        try {
            const data = new FormData();

            data.append("job_title", form.title);
            data.append("status", form.status.join(","));
            data.append("job_category", form.category.join(","));
            data.append("address", form.address);
            data.append("city", form.city);
            data.append("state", form.state);
            data.append("start_date", form.start_date);
            data.append("end_date", form.end_date);
            data.append("description", form.description);

            if (image) {
                data.append("profile_image", image);
            }

            const url = job
                ? `http://127.0.0.1:8000/api/jobs/${job.id}/`
                : "http://127.0.0.1:8000/api/jobs/";

            const method = job ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                body: data,
            });

            if (res.ok) {
                refresh();
                close();
            } else {
                const err = await res.json();
                console.error("Submit Error:", err);
                setError("Error saving job");
            }

        } catch (err) {
            console.error("Submit Error:", err);
            setError("Something went wrong");
        }
    };

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                <h2>{job ? "Edit Job" : "Create Job"}</h2>


                <input
                    type="text"
                    placeholder="Job Title *"
                    value={form.title}
                    onChange={(e) => {
                        setForm({ ...form, title: e.target.value });
                        setError("");
                    }}
                />


                <h4>Status *</h4>
                <div className="modal-multi">
                    {["Draft", "Requested", "Posted", "Filled"].map((s) => (
                        <button
                            key={s}
                            type="button"
                            className={form.status.includes(s) ? "selected" : ""}
                            onClick={() => toggleSelect("status", s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>


                <h4>Category *</h4>
                <div className="modal-multi">
                    {["Full-time", "Part-time", "Intern"].map((c) => (
                        <button
                            key={c}
                            type="button"
                            className={form.category.includes(c) ? "selected" : ""}
                            onClick={() => toggleSelect("category", c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>


                <input
                    type="text"
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                />


                <input
                    type="text"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                />


                <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                />


                <div className="modal-dates">
                    <input
                        type="date"
                        value={form.start_date}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    />
                    <input
                        type="date"
                        value={form.end_date}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    />
                </div>


                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />


                <input type="file" onChange={handleImageChange} />
                {preview && (
                    <img src={preview} alt="Preview" className="preview-image" />
                )}


                {error && <p className="error-text">{error}</p>}


                <div className="modal-buttons">
                    <button className="submit-btn" onClick={handleSubmit}>
                        {job ? "Update" : "Submit"}
                    </button>
                    <button className="close-btn" onClick={close}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default JobFormModal;