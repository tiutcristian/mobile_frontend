"use client";
import { useEffect, useState } from 'react';
import { setup2fa, verify2fa } from '../../apiCalls/authentication';
import { getToken } from '@/lib/localStorageUtils';
import { QRCode } from 'react-qrcode-logo';

export default function Setup2FA() {
	const [username, setUsername] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

	function getCurrentUserFromJWT() {
		const token = getToken();
		if (!token) {
			return "not logged in";
		}
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			console.log("Decoded JWT payload:", payload);
			return payload.sub || "unknown user";
		} catch (error) {
			console.error("Error decoding JWT:", error);
			return "invalid token";
		}
	}

	useEffect(() => {
		const user = getCurrentUserFromJWT();
		if (user && user !== "not logged in" && user !== "invalid token") {
			setUsername(user as string);
		} else {
			setUsername('not logged in');
		}
	}, [getCurrentUserFromJWT()]);

  async function handleSetup() {
    const data = await setup2fa(username);
    setQrUrl(data.qrUrl);
    setSecret(data.secret);
  }

  async function handleVerify() {
    await verify2fa(username, code)
      .then((data) => {
        setMessage("2FA setup successful!");
        localStorage.setItem('token', data.token); // Store the new token
        window.location.href = '/'; // Redirect to home
      })
      .catch((error) => {
        setMessage("Error verifying 2FA: " + error.message);
      });
  }

  return (
    <div>
      <h2>Setup 2FA</h2>
      <button onClick={handleSetup}>Generate QR</button>

      {qrUrl && (
        <>
          <p>Scan this QR code in Google Authenticator:</p>
          <QRCode value={qrUrl} size={200} />
          <p>Or manually enter secret: {secret}</p>

          <input
            placeholder="Enter 6-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button onClick={handleVerify}>Verify</button>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}