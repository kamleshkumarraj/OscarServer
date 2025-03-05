export const emailTemplate =(reset_link) => `<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .message {
            font-size: 16px;
            color: #666;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 18px;
        }
        .footer {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>Reset Your Password</div>
        <p class='message'>You recently requested to reset your password. Click the button below to set a new password.</p>
        <a href='${reset_link}' class='btn'>Reset Password</a>
        <p class='message'>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        <div class='footer'>&copy; 2025 Your Company. All rights reserved.</div>
    </div>
</body>
</html>`;

export const emailTemplateForDeleteAccount =(reset_link) => `<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .message {
            font-size: 16px;
            color: #666;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-size: 18px;
        }
        .footer {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>Delete Your Account</div>
        <p class='message'>You recently requested to delete your account. Click the button below to delete your account.</p>
        <a href='${reset_link}' class='btn'>Delete Account</a>
        <p class='message'>If you did not request this, please ignore this email. Your account will remain unchanged.</p>
        <div class='footer'>&copy; 2025 Your Oscar Print. All rights reserved.</div>
    </div>
</body>
</html>`;