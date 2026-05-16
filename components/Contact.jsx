import React, { useState } from "react";
const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data Submitted:", formData);

    setIsSubmitted(true);


    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
      <main classNameName="contact-page">
        <section classNameName="contact-hero">
          <h1>
            Get in <span>Touch</span>
          </h1>
          <p>
            Have questions? We're here to help you on your alignment journey.
          </p>
        </section>

        <div classNameName="contact-grid">
          <section classNameName="contact-form-container">
            <h3>
              <i classNameName="fa-regular fa-comment-dots"></i> Send us a Message
            </h3>

            {isSubmitted ? (
              <div classNameName="success-message">
                <h4>Thanks, {formData.name}!</h4>
                <p>
                  Your message has been sent. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div classNameName="form-row">
                  <div classNameName="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div classNameName="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div classNameName="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <div classNameName="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" classNameName="btn-solid btn-full">
                  Send Message
                </button>
              </form>
            )}
          </section>

          <aside classNameName="contact-sidebar">
            <div classNameName="info-card">
              <h3>Contact Information</h3>
              <div classNameName="info-item">
                <div classNameName="info-icon">
                  <i classNameName="fa-regular fa-envelope"></i>
                </div>
                <div classNameName="info-text">
                  <h3>Email</h3>
                  <p>lewis.garnett96@yahoo.com</p>
                  <p>support@aligntogether.com</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Contacts;


