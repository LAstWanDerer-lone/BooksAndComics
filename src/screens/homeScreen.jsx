import React from 'react';
import  {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import Appbar from '../components/appbar';
import CourseGridList from '../components/courseGridList';
import { makeStyles, Typography, Box } from '@material-ui/core';

import Library from '../assets/reading.png'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#fafafa",
        height: '100%'
    },
    container: {
        marginTop: 30,
        textAlign: 'left',
    },
    banner: {
        backgroundColor: '#f3e7dd',
        borderRadius: 15,
    },
    bannerText: {
        padding: 20,
        color: '#202565'
    },
    image: {
        backgroundImage: `url(${Library})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '50vh',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#f1f1f1',
        backgroundColor: 'red'
    },
    error:{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    },
    link:{
        textDecoration: 'none',
        color: 'black',
        fontSize: '18px' 
    }
}));


function HomeScreen(props) {
    const classes = useStyles();

    const courseList = ['CSE', 'EEE', 'ECE', 'ISE', 'Mech', 'Civil']
    const commonList = ['Mathematics', 'Science']

    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')));


    React.useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);
    
    return (
        <div className={classes.root}>
            {user === undefined ?
                <Backdrop className={classes.backdrop} open={user === undefined}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                : user === null ?
                    <div>
                        <Container maxWidth="sm" className={classes.error}>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                <p><strong>You Need to Login First</strong></p>
                                <Link to="/login"  className={classes.link}>
                                    Login
                                </Link>
                            </Alert>
                        </Container>
                    </div> :
                    <div>
                        <Appbar auth={user !== undefined} isAdmin={user.isAdmin} onLogoutCallback={props.onLogoutCallback} routeProps={props.routeProps} />
                        <Container className={classes.container}>
                            <Grid container className={classes.banner} justify='center' alignItems='center'>
                                <Grid item xs={6} className={classes.bannerText}>
                                    {user.isAdmin ?
                                        <div>
                                            <Typography variant='h1'>
                                                <Box fontWeight="fontWeightBold">
                                                    Admin Dashboard
                                                </Box>
                                            </Typography>
                                        </div> :
                                        <div>
                                            <Typography variant='h2'>
                                                <Box fontWeight="fontWeightBold">
                                                    Hola, Welcome<br/> {user.firstName} {user.lastName}
                                                </Box>
                                            </Typography>
                                            <Typography variant='h5'>
                                                Email: {user.email}
                                            </Typography>
                                            <Typography variant='h5'>
                                                College: {user.college}
                                            </Typography>
                                        </div>
                                    }
                                </Grid>
                                <Grid item xs={6} className={classes.image}></Grid>
                            </Grid>
                            <CourseGridList name="Courses" list={courseList} />
                            <CourseGridList name="Common" list={commonList} />
                        </Container>
                    </div>
            }
        </div>
    );

}

export default HomeScreen;