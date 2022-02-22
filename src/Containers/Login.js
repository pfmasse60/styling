import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fakeAuth } from "../auth/fakeAuth";

/**
 * A basic login form for return users.  Previously saved information regarding
 * air quality and location are retrieved after authentication and displayed
 * on the dash board.
 */
export const LoginPage = () => {
  
  const [username, setEmailValue] = useState('');
  const [password, setPasswordValue] = useState('');

  let navigate = useNavigate();

  /** All communication between customers and Amplify
   * and between Amplify and its downstream dependencies
   * is protected using TLS connections that are signed
   * using the Signature Version 4 signing process.
   * All Amplify Console endpoints use SHA-256 certificates
   * that are managed by AWS Certificate Manager 
   * Private Certificate Authority.  
   * AWS Amplify generates and manages cryptographic keys
   * for encrypting data on behalf of customers.
   * There are no encryption keys for you to manage.
   * */
  const signIn = async () => {
    try {
        await Auth.signIn(username, password);
        fakeAuth.login(() => {
          navigate('/dashboard')
        })
    } catch (error) {
        console.log('error signing in', error);
    }
  }

  return (
    <div className='content-container'>
      <h1>Login Page</h1>

      <label>Email
        <input
          value={username}
          onChange={e => setEmailValue(e.target.value)}
        />
      </label>
      <label>Password
        <input
          type='password'
          value={password}
          onChange={e => setPasswordValue(e.target.value)}
        />
        </label>
        <button
          disabled={!username || !password}
          onClick={signIn}>Sign In</button>
        <hr/>
        <button
          onClick={() => navigate('/signup')}>Don't have an account? Sign Up</button>
    </div>
  )
}