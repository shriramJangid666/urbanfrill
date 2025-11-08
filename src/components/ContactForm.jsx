import React, { useState } from "react";
import "./contactForm.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      setSuccessMsg("Please fill in all fields.");
      setTimeout(() => setSuccessMsg(""), 2500);
      return;
    }

    const newEntry = {
      name: formData.name,
      phone: formData.phone,
      message: formData.message,
      date: new Date().toISOString(),
    };

    // <- log the submitted data to console (what you asked)
    console.log("ContactForm submission:", newEntry);

    // clear form & show user-friendly inline confirmation
    setFormData({ name: "", phone: "", message: "" });
    setSuccessMsg("✅ Thank you — your message has been recorded.");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="contact-form-outer">
      <div className="contact-form-container">
        <h2>Contact Us</h2>
        <p className="lead">Leave your details below — we’ll reach out soon.</p>

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="cf-input"
            autoComplete="name"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="cf-input"
            autoComplete="tel"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="cf-textarea"
          ></textarea>

          <div className="cf-actions">
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>

        {successMsg && <div className="cf-success">{successMsg}</div>}
      </div>
    </div>
  );
}
