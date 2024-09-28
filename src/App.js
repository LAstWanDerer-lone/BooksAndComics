import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './App.css';

import LandingScreen from './screens/landingScreen'
import LoginScreen from './screens/loginScreen'
import RegisterScreen from './screens/registerScreen'
import HomeScreen from './screens/homeScreen'
import CourseScreen from './screens/courseScreen';
import UploadScreen from './screens/uploadScreen';
import RequestNoteScreen from "./screens/requestNoteScreen";
import AdminRequestNoteScreen from  './screens/adminRequestNotesScreen';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
  }

  componentDidMount() {
    const userData =  JSON.parse( localStorage.getItem('user'));
    this.setState({
      user: userData  
    })
  }

  handleUserLogin = (user, isAdmin) => {
    
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      college: user.college,
      isAdmin: isAdmin
    };

    this.setState({
      user: userData
    });

    localStorage.setItem('user', JSON.stringify(userData));

  }

  handleUserLogout = () => {
    localStorage.removeItem('user');
    this.setState({
      user: undefined
    });
  }

  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route exact path="/">
                <LandingScreen />
              </Route>
              <Route path="/upload"  render={(routeProps) => <UploadScreen  routeProps={routeProps}/> }/>
              <Route path="/admin/request" render={(routeProps) => <AdminRequestNoteScreen  onLogoutCallback={this.handleUserLogout} routeProps={routeProps}/> } />
              <Route path="/request" render={(routeProps) => <RequestNoteScreen  onLogoutCallback={this.handleUserLogout} routeProps={routeProps}/> } />
              <Route path="/home" render={(routeProps) => <HomeScreen  onLogoutCallback={this.handleUserLogout} routeProps={routeProps} />} />
              <Route path="/login" render={(routeProps) => <LoginScreen onSubmitCallback={this.handleUserLogin} routeProps={routeProps} />} />
              <Route path='/register' render={(routeProps) => <RegisterScreen onSubmitCallback={this.handleUserLogin} routeProps={routeProps} />} />
              <Route path="/course/:courseName" render={(routeProps) => <CourseScreen onLogoutCallback={this.handleUserLogout} routeProps={routeProps} />} />
            </Switch>
          </Router>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
