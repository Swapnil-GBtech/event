
import nodemailer from "nodemailer"

class ApiError extends Error {
  statusCode

  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

export const sendOtpToMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const isPasswordType = options?.type === "password"
    const credential = isPasswordType ? options?.password : options?.otp

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${isPasswordType ? "Login Credentials" : "OTP Verification"}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
        
        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
          <tr>
            <td style="padding: 40px 20px;">
              
              <!-- Main Content Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                      ${isPasswordType ? "🔐 Login Credentials" : "🔐 Verification Code"}
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    
                    <p style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px;">
                      Hello Admin,
                    </p>
                    
                    <p style="margin: 0 0 30px 0; color: #5a6c7d; font-size: 15px;">
                      ${
                        isPasswordType
                          ? "Here are your login credentials for the Event Management System:"
                          : "Your verification code for the Event Management System is ready:"
                      }
                    </p>
                    
                    <!-- Credential Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 30px auto;">
                      <tr>
                        <td style="background-color: #f8f9ff; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center;">
                          <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                            ${credential}
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    ${
                      !isPasswordType
                        ? `
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px;">
                        <strong>⏰ Important:</strong> This code expires in 5 minutes for security purposes.
                      </p>
                    </div>
                    `
                        : ""
                    }
                    
                    <p style="margin: 20px 0 0 0; color: #5a6c7d; font-size: 14px;">
                      If you didn't request this, please contact your system administrator immediately.
                    </p>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 13px; text-align: center;">
                      Best regards,<br>
                      <strong>Event Management System</strong><br>
                      <span style="color: #adb5bd;">This is an automated message - please do not reply</span>
                    </p>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject || (isPasswordType ? "Your Admin Login Credentials" : "Your Verification Code"),
      text: options.message || `Your ${isPasswordType ? "password" : "OTP"} is ${credential}`,
      html: htmlContent,
    }
    await transporter.sendMail(message)
  } catch (error) {
    throw new ApiError(500, (error).message)
  }
}

