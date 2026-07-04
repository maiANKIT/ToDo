const mailSender = async (email, subject, body) => {
  try {
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        subject: subject,
        body: body,
      }),
    });

    const data = await response.json();
    console.log("Mail sent successfully via Google Script:", data);

    return data;
  } catch (error) {
    console.error("Mail error: ", error);
    throw error;
  }
};

module.exports = mailSender;
