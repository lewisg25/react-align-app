import { useState } from "react";

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactFields = [
  { id: "name", label: "Name", placeholder: "Your name", required: true },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
  },
  { id: "subject", label: "Subject", placeholder: "How can we help?" },
];

function ContactField({
  id,
  label,
  formData,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={formData[id]}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

const Contacts = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = ({ target }) => {
    setFormData((currentData) => ({
      ...currentData,
      [target.id]: target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Data Submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <h1>
          Get in <span>Touch</span>
        </h1>
        <p>Have questions? We're here to help you on your alignment journey.</p>
      </section>

      <div className="contact-grid">
        <section className="contact-form-container">
          <h3>
            <i className="fa-regular fa-comment-dots" /> Send us a Message
          </h3>

          {isSubmitted ? (
            <div className="success-message">
              <h4>Thanks, {formData.name}!</h4>
              <p>Your message has been sent. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                {contactFields.slice(0, 2).map((field) => (
                  <ContactField
                    key={field.id}
                    formData={formData}
                    onChange={handleChange}
                    {...field}
                  />
                ))}
              </div>

              <ContactField
                {...contactFields[2]}
                formData={formData}
                onChange={handleChange}
              />

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-solid btn-full">
                Send Message
              </button>
            </form>
          )}
        </section>

        <aside className="contact-sidebar">
          <div className="info-card">
            <h3>Contact Information</h3>
            <div className="info-item">
              <div className="info-icon">
                <i className="fa-regular fa-envelope" />
              </div>
              <div className="info-text">
                <h3>Email</h3>
                <p>lewis.garnett96@yahoo.com</p>
                <p>support@aligntogether.com</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Contacts;
