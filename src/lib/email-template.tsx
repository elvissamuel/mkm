import type { User } from "@prisma/client"
import type * as React from "react"

interface EmailTemplateProps {
  user: User
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ user }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
    }}
  >
    {/* Header with Logo */}
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "20px" }}>
      <tr>
        <td style={{ textAlign: "center", padding: "20px 0" }}>
             <img
            src="https://res.cloudinary.com/dws9ykgky/image/upload/v1745879732/MK-black_akqsy0.png"
            alt="Making Kings for Nation Mentorship Logo"
            width="100"
            height="100"
            style={{
              display: "block",
              margin: "0 auto",
              borderRadius: "10px",
              border: "none",
            }}
          />
        </td>
      </tr>
    </table>

    {/* Organization Name */}
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "20px" }}>
      <tr>
        <td style={{ textAlign: "center" }}>
          <h2
            style={{
              color: "#333333",
              margin: "0",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            Making Kings for Nation Mentorship
          </h2>
        </td>
      </tr>
    </table>

    {/* Main Content */}
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#f8f8f8",
        borderRadius: "6px",
        padding: "30px",
        marginBottom: "20px",
      }}
    >
      <tr>
        <td>
          <h1
            style={{
              color: "#333333",
              fontSize: "24px",
              fontWeight: "bold",
              marginTop: "0",
              marginBottom: "20px",
            }}
          >
            Welcome, {user.first_name} {user.last_name}!
          </h1>

          <p
            style={{
              color: "#555555",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0 0 20px 0",
            }}
          >
            Thank you for joining the Making Kings for Nation Mentorship program. We are excited to have you on board and
            look forward to supporting your journey of growth and development.
          </p>

          <p
            style={{
              color: "#555555",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0 0 20px 0",
            }}
          >
            Our mission is to equip and empower you with the insights, tools and resources needed to make you a better person and leader
          </p>

          <div
            style={{
              backgroundColor: "#4a5568",
              color: "#ffffff",
              padding: "15px 25px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              margin: "30px 0",
              display: "inline-block",
            }}
          >
            Get Started Now
          </div>
        </td>
      </tr>
    </table>

    {/* Footer */}
    <table width="100%" cellPadding="0" cellSpacing="0">
      <tr>
        <td style={{ textAlign: "center", padding: "20px 0" }}>
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: "0 0 10px 0",
            }}
          >
            © {new Date().getFullYear()} Making Kings for Nation Mentorship. All rights reserved.
          </p>
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: "0",
            }}
          >
            If you have any questions, please contact us at{" "}
            <a href="mailto:admin@makingkings.org" style={{ color: "#4a5568" }}>
              admin@makingkings.org
            </a>
          </p>
        </td>
      </tr>
    </table>
  </div>
)

export const SuccessPaymentEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ user }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
    }}
  >
    {/* Header with Logo */}
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "20px" }}>
      <tr>
        <td style={{ textAlign: "center", padding: "20px 0" }}>
             <img
            src="https://res.cloudinary.com/dws9ykgky/image/upload/v1745879732/MK-black_akqsy0.png"
            alt="Making Kings for Nation Mentorship Logo"
            width="100"
            height="100"
            style={{
              display: "block",
              margin: "0 auto",
              borderRadius: "10px",
              border: "none",
            }}
          />
        </td>
      </tr>
    </table>

    {/* Organization Name */}
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "20px" }}>
      <tr>
        <td style={{ textAlign: "center" }}>
          <h2
            style={{
              color: "#333333",
              margin: "0",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            Making Kings for Nation Mentorship
          </h2>
        </td>
      </tr>
    </table>

    {/* Main Content */}
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#f8f8f8",
        borderRadius: "6px",
        padding: "30px",
        marginBottom: "20px",
      }}
    >
      <tr>
        <td>
          <h1
            style={{
              color: "#333333",
              fontSize: "24px",
              fontWeight: "bold",
              marginTop: "0",
              marginBottom: "20px",
            }}
          >
            Congratulations, {user.first_name} {user.last_name}!
          </h1>

          <p
            style={{
              color: "#555555",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0 0 20px 0",
            }}
          >
            Your payment has been confirmed and you're welcome onboard. To get started kindly join the WhatsApp group through the link provided below.
          </p>

          <a style={{
              backgroundColor: "#4a5568",
              color: "#ffffff",
              padding: "15px 25px",
              borderRadius: "4px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              margin: "30px 0",
              display: "inline-block",
            }} href="https://chat.whatsapp.com/EOkSWX3PrEW9EiiDypP3G2">Join the WhatsApp group</a>

        </td>
      </tr>
    </table>

    {/* Footer */}
    <table width="100%" cellPadding="0" cellSpacing="0">
      <tr>
        <td style={{ textAlign: "center", padding: "20px 0" }}>
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: "0 0 10px 0",
            }}
          >
            © {new Date().getFullYear()} Making Kings for Nation Mentorship. All rights reserved.
          </p>
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: "0",
            }}
          >
            If you have any questions, please contact us at{" "}
            <a href="mailto:admin@makingkings.org" style={{ color: "#4a5568" }}>
              admin@makingkings.org
            </a>
          </p>
        </td>
      </tr>
    </table>
  </div>
)
