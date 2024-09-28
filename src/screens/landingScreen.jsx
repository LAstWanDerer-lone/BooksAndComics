import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Appbar from '../components/appbar';
import Library from '../assets/library.png';
import CourseGridList from '../components/courseGridList';

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        color: '#202555',
        backgroundColor: '#f3e7dd'
    },
    container: {
        marginTop: 40,
        textAlign: 'left',
        background: 'linear-gradient(to bottom right, #0039a6, #4B9CD3)',
        borderRadius: '20px',
        padding: '40px 20px',
        color: 'white',
        boxShadow: '0px 8px 8px 0px rgba(0, 0, 0, 0.3)'
    },
    image: {
        backgroundImage: `url(${Library})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    },
    btn: {
        textTransform: 'capitalize',
        letterSpacing: '2px',
        backgroundColor: 'white',
        color: 'black',
        fontWeight: 'bold',
        padding: '10px 20px',
        transition: 'transform .1s',
        '&:hover': {
            backgroundColor: 'black',
            transform: 'scale(1.1)',
            color: 'white'
        }
    },
    desc: {
        marginLeft: '40px'
    },
    link: {
        textDecoration: 'none',
    },
    footer: {
        marginTop: '30px',
        height: '300px',
    },
    abt:{
        margin: '80px auto',
    }
});

class LandingScreen extends React.Component {


    render() {
        const { classes } = this.props;

        const courseList = ['CSE', 'EEE', 'ECE', 'ISE', 'Mech', 'Civil']
        const commonList = ['Mathematics', 'Science']

        return (
            <div className={classes.root}>
                <Appbar auth={false} />
                <Container className={classes.container}>
                    <Grid container spacing={3} direction='row'>
                        <Grid item xs={6} >
                            <div className={classes.desc}>
                                <Typography variant="h1">
                                    Hello!
                                </Typography>
                                <Typography variant="h2">
                                    Welcome To <Box fontWeight="bold">ShareNotes.</Box>
                                </Typography>
                                <br />

                                <Link to='/register' className={classes.link}><Button className={classes.btn}>Get Started </Button></Link>

                            </div>
                        </Grid>
                        <Grid item xs={6} className={classes.image}></Grid>
                    </Grid>
                </Container>

                <Container className={classes.abt}>
                    <Grid container justify="center" alignItems="center">
                        <Grid item xs={6}>
                            <Typography variant="h1"><Box fontWeight="bold">About Us</Box></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6"> 
                            “Share Notes” is a platform that will help the user to obtain notes of their respective subject
                        belonging to their respective branches. Notes are available everywhere on the internet but they
                        might not be precise or up to the university standards. The basic idea behind the concept is that
                        using our platform the user gets all the notes of different subjects at one location hassle free. The
                        user can preview notes before downloading them from the platform. The user can also share the
                        notes which they might possess and are not available on the platform. This will help to grow a
                        community and other users will also be benefited from this. 
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>

                <Container>
                    <CourseGridList name="Courses" list={courseList} />
                    <CourseGridList name="Common" list={commonList} />
                </Container>
                <footer className={classes.footer}></footer>
            </div>
        );
    }
}

export default withStyles(styles)(LandingScreen);