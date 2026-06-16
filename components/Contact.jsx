import { motion as Motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, popIn, stagger, useScrollReveal } from "../src/scrollMotion";

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
    <Motion.div className="form-group" variants={fadeUp}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={formData[id]}
        onChange={onChange}
        {...props}
      />
    </Motion.div>
  );
}

const Contacts = () => {
  const [formData, setFormData] = useState(formStart);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reveal = useScrollReveal(0.12);

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
    <Motion.main className="contact-page" variants={stagger} {...reveal}>
      <Motion.section className="contact-hero" variants={fadeUp}>
        <p className="contact-hero-kicker">We would love to hear from you</p>
        <h1>
          Get in <span>Touch</span>
        </h1>
        <p>Have questions? We're here to help you on your alignment journey.</p>
      </Motion.section>

      <Motion.div className="contact-grid" variants={stagger}>
        <Motion.section className="contact-form-container" variants={popIn}>
          <Motion.div className="contact-form-heading" variants={fadeUp}>
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
          </Motion.div>

          {isSubmitted ? (
            <Motion.div className="success-message" variants={popIn}>
              <div className="success-icon" aria-hidden="true">
                <i className="fa-solid fa-check" />
              </div>
              <h4>Thanks, {formData.name}!</h4>
              <p>Your message has been sent. We'll get back to you shortly.</p>
            </Motion.div>
          ) : (
            <Motion.form
              className="contact-form"
              onSubmit={handleSubmit}
              variants={stagger}
            >
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

              <Motion.div className="form-group" variants={fadeUp}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us more..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Motion.div>

              <Motion.button
                type="submit"
                className="btn-solid btn-full"
                variants={fadeUp}
              >
                <span>Send Message</span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Motion.button>

              <Motion.div
                className="contact-form-meta"
                aria-label="Contact details"
                variants={fadeUp}
              >
                <span>
                  <i className="fa-regular fa-clock" aria-hidden="true" /> 24h
                  response
                </span>
                <span>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />{" "}
                  Private message
                </span>
              </Motion.div>
            </Motion.form>
          )}
        </Motion.section>

        <Motion.aside className="contact-sidebar" variants={popIn}>
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
        </Motion.aside>
      </Motion.div>
    </Motion.main>
  );
};

export default Contacts;
