import React from "react";
import "./styles/AnalyticsModal.css";

const AnalyticsModal = ({ jobs, close }) => {
    const countStatus = {};
    const countCity = {};
    const countState = {};

    jobs.forEach(job => {

        // ✅ FIX: convert string → array
        const statusArray = typeof job.status === "string"
            ? job.status.split(",")
            : job.status || [];

        statusArray.forEach(s => {
            countStatus[s] = (countStatus[s] || 0) + 1;
        });

        if (job.city) {
            countCity[job.city] = (countCity[job.city] || 0) + 1;
        }

        if (job.state) {
            countState[job.state] = (countState[job.state] || 0) + 1;
        }
    });

    const createGradient = (countObj) => {
        const total = Object.values(countObj).reduce((a, b) => a + b, 0);
        if (total === 0) return "#eee"; // ✅ avoid empty crash

        let gradient = "", start = 0;

        Object.entries(countObj).forEach(([k, v], i) => {
            const percent = (v / total) * 100;
            gradient += `hsl(${i * 60},70%,60%) ${start}% ${start + percent}%, `;
            start += percent;
        });

        return gradient.slice(0, -2);
    };

    return (
        <div className="modal-overlay">
            <div className="analytics-box">
                <h2>Analytics</h2>

                <div className="charts">

                    <div>
                        <h4>Status</h4>
                        <div
                            className="pie"
                            style={{ background: `conic-gradient(${createGradient(countStatus)})` }}
                        ></div>
                    </div>

                    <div>
                        <h4>City</h4>
                        <div
                            className="pie"
                            style={{ background: `conic-gradient(${createGradient(countCity)})` }}
                        ></div>
                    </div>

                    <div>
                        <h4>State</h4>
                        <div
                            className="pie"
                            style={{ background: `conic-gradient(${createGradient(countState)})` }}
                        ></div>
                    </div>

                </div>

                <button className="btn close-btn" onClick={close}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default AnalyticsModal;