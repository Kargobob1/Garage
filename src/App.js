import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import GarageDetail from './components/Dashboard/GarageDetail';
import ChangeManager from './components/Management/ChangeManager';
import { isAuthenticated, getUserRole } from './services/auth';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      if (auth) {
        setUserRole(getUserRole());
      }
    };
    
    checkAuth();
    const interval = setInterval(checkAuth, 300000);
    return () => clearInterval(interval);
  }, []);

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} userRole={userRole} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );

  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/login" render={(props) => <Login {...props} setAuthenticated={setAuthenticated} setUserRole={setUserRole} />} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/garage/:id" component={GarageDetail} />
          <PrivateRoute path="/changes" component={ChangeManager} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;