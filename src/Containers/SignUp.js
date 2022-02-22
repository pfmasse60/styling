import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeAuth } from "../auth/fakeAuth"

/**
 * A signup form for users including authentication information and 
 * an air quality threshold and location
 * @returns 
 */
export const SignUpPage = () => {
  const [username, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [location, setLocation] = useState('');
  const [threshold, setThreshold] = useState('');
  const [code, setAuthCode] = useState('');
  const [step, setStep] = useState(0);
  const [given_name, setGivenName] = useState('');
  const [family_name, setFamilyName] = useState('');
  const navigate = useNavigate();

  const signUp = async () => {
    try {
        await Auth.signUp({
            username,
            password: passwordValue,
            attributes: {
                email: username,
                given_name,
                family_name,
                locale: location,
                'custom:threshold': threshold
            }
        });
        setStep(1);
    } catch (error) {
        console.log('error signing up:', error);
    }
  }
  const confirmSignUp = async () => { 
    try {
      await Auth.confirmSignUp(username, code);
      try {
        await Auth.signIn(username, passwordValue);
        fakeAuth.login(() => {
          navigate('/dashboard')
        });
      } catch (err) {
        console.log('something went wrong');
      }
  } catch (err) {
      console.log('error resending code: ', err);
  }
  }

  return (
    <div className='content-container'>
      {
        step === 0 && (
          <div>
      <label>First Name
          <input
            value={given_name}
            onChange={e => setGivenName(e.target.value)}
          />
      </label>
      <label>Last Name
          <input
            value={family_name}
            onChange={e => setFamilyName(e.target.value)}
          />          
      </label>
      <label>Email
          <input
            value={username}
            onChange={e => setEmailValue(e.target.value)}
          />
      </label>
        
        <label>Password
          <input
            type='password'
            placeholder='password'
            value={passwordValue}
            onChange={e => setPasswordValue(e.target.value)}
          />
        </label>

        <hr />
        <label>City
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </label>

        <label>Your Desired Air Quality Threshold
          <input
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
          />
        </label>
        <hr/>
        <button
          disabled={!username || !passwordValue}
          onClick={signUp}>Sign Up</button>
        <button
          onClick={() => navigate('/')}>Already have an account? Log In</button>
          </div>
        )
        }


        {
        step === 1 && (
          <div>
      <label>Email
          <input
            value={username}
            onChange={e => setEmailValue(e.target.value)}
            placeholder='my@example.com'
          />
        </label>
        
        <label>Authentication Code
          <input
            placeholder='Authentication Code'
            value={code}
            onChange={e => setAuthCode(e.target.value)}
          />
        </label>
        <hr/>
        <button
          disabled={!username || !code}
          onClick={confirmSignUp}>Confirm Sign Up</button>
          </div>
        )
        }
    </div>
  )
}