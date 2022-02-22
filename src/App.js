
import { LoginPage } from './Containers/Login';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { Routes, Route } from 'react-router-dom';
import { DashBoard } from './Containers/DashBoard';
import { SignUpPage } from './Containers/SignUp';
import { PrivateRoute } from "./auth/PrivateRoute"

Amplify.configure(awsconfig);

function App() {
  return (
    <div className='page-container'>
      {
        <Routes>
          <Route path='/' element={<LoginPage />}/>
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <DashBoard x={1} />
              </PrivateRoute>
            }
          ></Route>
          <Route path='/signup' element={<SignUpPage />}/>
        </Routes> 
      }
    </div>
  );
}

export default App;
