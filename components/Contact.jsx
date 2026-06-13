import { useState } from "react";

const formStart = {
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
  const [formData, setFormData] = useState(formStart);
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
        <p className="contact-hero-kicker">We would love to hear from you</p>
        <h1>
          Get in <span>Touch</span>
        </h1>
        <p>Have questions? We're here to help you on your alignment journey.</p>
      </section>

      <div className="contact-grid">
        <section className="contact-form-container">
          <div className="contact-form-heading">
            <div className="contact-heading-icon" aria-hidden="true">
              <i className="fa-regular fa-comment-dots" />
            </div>
            <div>
              <p className="contact-kicker">Contact support</p>
              <h3>Send us a Message</h3>
              <p>
                Tell us what is going on and we will point you in the right
                direction.
              </p>
            </div>
          </div>

          {isSubmitted ? (
            <div className="success-message">
              <div className="success-icon" aria-hidden="true">
                <i className="fa-solid fa-check" />
              </div>
              <h4>Thanks, {formData.name}!</h4>
              <p>Your message has been sent. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
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
                <span>Send Message</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </button>

              <div className="contact-form-meta" aria-label="Contact details">
                <span>
                  <i className="fa-regular fa-clock" aria-hidden="true" /> 24h
                  response
                </span>
                <span>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />{" "}
                  Private message
                </span>
              </div>
            </form>
          )}
        </section>

        <aside className="contact-sidebar">
          <div className="info-card">
            <p className="contact-kicker">Direct contact</p>
            <h3>Contact Information</h3>
            <div className="info-item">
              <div className="info-icon">
                <i className="fa-regular fa-envelope" />
              </div>
              <div className="info-text">
                <h3>Email</h3>

                <p>support@aligntogether.com</p>
              </div>
            </div>
            <div className="info-note">
              <i className="fa-regular fa-circle-check" aria-hidden="true" />
              <span>
                Best for account help, program questions, and support.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Contacts;
