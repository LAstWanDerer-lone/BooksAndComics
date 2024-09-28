import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom'
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Container, Avatar, MenuItem, Menu, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  loginBtn: {
    backgroundColor: '#3987f4',
    color: 'white',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#3987f4'
    }
  },
  logoutBtn: {
    backgroundColor: '#e53935',
    color: 'white',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#f44336'
    }
  },
  appbar: {
    backgroundColor: 'transparent',
    color: '#202555'
  },
  link: {
    textDecoration: 'none',
    color: 'white'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

function Appbar(props) {

  const classes = useStyles();

  const [auth, setAuth] = React.useState(props.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const isAdmin = props.isAdmin;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };  

  const handleLogout = () => {
    props.routeProps.history.replace('/login');
    props.onLogoutCallback();
    setAuth(false);
  }

  const addNote = () => {
    props.routeProps.history.push('/upload');
  }

const requestNote = () => {
  if(isAdmin) {
    props.routeProps.history.push('/admin/request');
  }else{
    props.routeProps.history.push('/request');
  }
}


  return (
    <div className={classes.root}>
      <Container>
        <AppBar position="static" elevation={0} className={classes.appbar}>
          <Toolbar>
            <Link to='/home'>
            <Avatar className={classes.avatar}>
              <LocalLibraryIcon />
            </Avatar>
            </Link>
            <Typography variant="h4" className={classes.title}>
              <Box fontWeight="bold">ShareNotes</Box>
            </Typography>
            {!auth ?
              <Button variant="contained" className={classes.loginBtn}>
                <Link to='/login' className={classes.link}>Login</Link>
              </Button> :
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}>
                  {isAdmin && <MenuItem onClick={addNote}>Add Note</MenuItem>}
                  <MenuItem onClick={requestNote}>{isAdmin ? "Pending Requests" : "Share Notes"}</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>}
          </Toolbar>
        </AppBar>
      </Container>
    </div>
  );
}

export default Appbar;