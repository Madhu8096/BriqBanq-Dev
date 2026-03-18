import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import asyncio
import structlog
from app.core.config import settings

logger = structlog.get_logger()

class EmailService:
    """Service for sending emails via SMTP."""

    @staticmethod
    async def send_otp_email(to_email: str, otp: str):
        """Send OTP email via Gmail SMTP (non-blocking)."""
        logger.info("email_service_invoked", to_email=to_email)
        subject = "Your BrickBanq Verification Code"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #008080;">BrickBanq Verification</h2>
                    <p>Hello,</p>
                    <p>Your verification code is:</p>
                    <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 5px; margin: 20px 0;">
                        {otp}
                    </div>
                    <p>This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">&copy; 2026 BrickBanq. All rights reserved.</p>
                </div>
            </body>
        </html>
        """
        
        if not settings.mail_password:
            logger.warning("smtp_password_not_set", email=to_email)
            print(f"\n[SENSITIVE MOCK] To: {to_email}")
            print(f"[SENSITIVE MOCK] OTP: {otp} (Set MAIL_PASSWORD to send real email)\n")
            return

        try:
            await asyncio.to_thread(
                EmailService._send_smtp_sync,
                to_email,
                subject,
                body
            )
            logger.info("email_sent_successfully", email=to_email)
        except Exception as e:
            logger.error("email_send_failed", email=to_email, error=str(e))
            raise e

    @staticmethod
    def _send_smtp_sync(to_email: str, subject: str, html_content: str):
        """Synchronous SMTP helper for to_thread."""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.mail_from
        msg["To"] = to_email

        part = MIMEText(html_content, "html")
        msg.attach(part)

        with smtplib.SMTP(settings.mail_server, settings.mail_port) as server:
            if settings.mail_tls:
                server.starttls()
            
            server.login(settings.mail_username, settings.mail_password)
            server.send_message(msg)
