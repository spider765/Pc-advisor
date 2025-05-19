import React, { useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BuildForm = () => {
    const [formData, setFormData] = useState({
        budget: '',
        use_case: 'Gaming',
        brand: 'AMD',
        style: 'RGB',
    });

    const [buildResult, setBuildResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!formData.budget || Number(formData.budget) < 300) {
                throw new Error('Please enter a valid budget (minimum $300)');
            }

            const res = await axios.post(
                'http://localhost:4000/api/builds',
                { build: formData },
                { timeout: 15000 }
            );

            if (!res.data || !res.data.build) {
                throw new Error('Invalid response format from server');
            }

            const requiredComponents = ['cpu', 'gpu', 'ram', 'storage', 'motherboard'];
            const missingComponents = requiredComponents.filter(
                (comp) => !res.data.build[comp]
            );

            if (missingComponents.length > 0) {
                throw new Error(`Missing components in response: ${missingComponents.join(', ')}`);
            }

            if (!res.data.build.total_price) {
                throw new Error('Total price missing in response');
            }

            setBuildResult(res.data.build);
        } catch (error) {
            let errorMessage = 'Error generating build';

            if (error.response) {
                errorMessage =
                    error.response.data.error ||
                    error.response.data.details ||
                    `Server error (${error.response.status})`;
            } else if (error.request) {
                errorMessage = 'No response from server. Please try again later.';
            } else {
                errorMessage = error.message;
            }

            setError(errorMessage);
            console.error('Build generation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPDF = async () => {
        try {
            const input = document.getElementById('build-result');
            if (!input) return;

            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('pc_build_advisor_result.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            setError('Failed to generate PDF');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4 fw-bold">Smart PC Build Advisor</h2>

            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-md-3">
                    <input
                        type="number"
                        name="budget"
                        placeholder="Budget ($)"
                        className="form-control"
                        value={formData.budget}
                        onChange={handleChange}
                        min="300"
                        required
                    />
                </div>
                <div className="col-md-3">
                    <select
                        name="use_case"
                        className="form-select"
                        value={formData.use_case}
                        onChange={handleChange}
                    >
                        <option value="Gaming">Gaming</option>
                        <option value="Editing">Editing</option>
                        <option value="Office">Office</option>
                        <option value="Streaming">Streaming</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        name="brand"
                        className="form-select"
                        value={formData.brand}
                        onChange={handleChange}
                    >
                        <option value="AMD">AMD</option>
                        <option value="Intel">Intel</option>
                        <option value="NVIDIA">NVIDIA</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        name="style"
                        className="form-select"
                        value={formData.style}
                        onChange={handleChange}
                    >
                        <option value="RGB">RGB</option>
                        <option value="Minimal">Minimal</option>
                        <option value="Compact">Compact</option>
                    </select>
                </div>

                <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary py-2" disabled={isLoading}>
                        {isLoading ? 'Generating...' : '⚙️ Generate Build'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="text-center mt-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Generating your perfect build...</p>
                </div>
            )}

            {buildResult && (
                <div className="mt-5">
                    <h3 className="text-center mb-4 fw-bold">💻 Your Suggested Build</h3>

                    <div id="build-result">
                        <div className="row g-4">
                            {['cpu', 'gpu', 'ram', 'storage', 'motherboard'].map((part) => (
                                <div key={part} className="col-md-4">
                                    <div className="card shadow h-100 border-0">
                                        <div className="card-body">
                                            <h5 className="card-title text-capitalize">{part.toUpperCase()}</h5>
                                            <p>
                                                <strong>Name:</strong> {buildResult[part]?.name || 'Not specified'}
                                            </p>
                                            <p>
                                                <strong>Why:</strong> {buildResult[part]?.reason || 'Not specified'}
                                            </p>
                                            <p>
                                                <strong>Price:</strong> {buildResult[part]?.price || '0'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="col-md-12">
                                <div className="alert alert-success text-center fw-bold fs-5">
                                    💰 Total Estimated Price: {buildResult.total_price || '0'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button onClick={downloadPDF} className="btn btn-outline-dark">
                            📄 Download as PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildForm;
