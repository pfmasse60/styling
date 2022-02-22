import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';
import { fakeAuth } from "../auth/fakeAuth";

/**
 * An interface that shows the saved location and air quality threshold of
 * an end user and the AQI for the given location.  An indication is also made
 * using the colors green or red indicating acceptible or unacceptible air quality.
 */
export const DashBoard = () => {
  const [airQuality, setAirQuality] = useState('');
  const [city, setLocation] = useState('');
  const [given_name, setGivenName] = useState('');
  const [family_name, setFamilyName] =  useState('');
  const [threshold, setThreshold] = useState('');

  const navigate = useNavigate();

  async function fetchAqi(myCity) {
    console.log(myCity);
    const url = `http://localhost:8080/https://api.waqi.info/feed/${myCity}/?token=xxxxxxxxxxxxxxxxxxx`;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        json?.data?.aqi ? setAirQuality(json.data.aqi) : setAirQuality(':(');console.log(json.data.aqi)});
  }

  useEffect(() => {
    Auth.currentUserInfo().then(info => {
        setGivenName(info.attributes.given_name);
        setFamilyName(info.attributes.family_name);
        setLocation(info.attributes.locale);
        setThreshold(info.attributes['custom:threshold']);
        fetchAqi(info.attributes.locale);
    });
  },[]);
  
  async function signOut() {
    try {
      await Auth.signOut();
      fakeAuth.logout(() =>
        navigate("/", { state: { from: { pathname: "/dashboard" } } })
      )
    } catch(err) {
      console.log('Error when logging out');
    }
  }

  async function updateLocation() {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, {
      locale: `${city}`,
      'custom:threshold': `${threshold}`
    });
  }

  return (
    <div className='container'>
      <div className='content-container'>
        <h1>User Air Quality Settings</h1>
        <h2>{given_name} {family_name}</h2>

      <hr />
      <div>
      <label>Location
        <input
          value={city}
          onChange={e => setLocation(e.target.value)}
          onInput={e => fetchAqi(e.target.value)}
        />
      </label>
      </div>

      <div>
      <label>Warning Threshold
        <input
          value={threshold}
          onChange={e => setThreshold(e.target.value)}
        />
      </label>
      </div>

      <label>Location Air Quality
        <div className='aqi-container'>
          <div className={`aqi-number ${threshold < airQuality ? 'background-color: red' : 'background-color: green'}`}>
              {airQuality}
          </div>
        </div>
      </label>

      <hr />
      <button
        onClick={updateLocation}>Update
      </button>
      <hr />
      <button
        onClick={signOut}>Sign Out
      </button>

      </div>
  </div>
  )
}