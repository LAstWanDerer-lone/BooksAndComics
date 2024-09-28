import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import CourseBanner from '../components/courseBanner';
import { Grid, Typography } from '@material-ui/core';
import Appbar from '../components/appbar';

import CourseData from '../components/courseData';

const styles = (theme) => ({
    root: {
        height: '100%',
        backgroundColor: '#fafafa'
    },
    Container: {
        marginTop: 30,
    },
    notesSection: {
        margin: '20px 0px'
    },
    notesContainer: {
        margin: '10px 0px'
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
});

class CourseScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            courseData: [],
            user: JSON.parse(localStorage.getItem('user'))
        }
        this.fetchNotes = this.fetchNotes.bind(this);
    }

    componentDidMount() {
        const courseName = this.props.match.params.courseName;
        this.fetchNotes(courseName);
    }


    fetchNotes(courseName) {

        if(courseName === 'ISE'){
            courseName = 'CSE';
        }

        axios.get('http://localhost:5000/course', {
            params: {
                courseName: courseName,
            }
        })
            .then(async (res) => {
                this.setState({
                    courseData: res.data.courseData
                });

            })
            .catch((error) => {
                console.log(error);
            });
    }



    render() {
        const { classes } = this.props;
        const { courseName } = this.props.match.params;
        const courseData = this.state.courseData;

        const user = this.state.user;

        return (
            <div className={classes.root}>
                {user === null ? <div>
                    <Container maxWidth="sm" className={classes.error}>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            <p><strong>You Need to Login First</strong></p>
                            <Link to="/login" className={classes.link}>
                                Login
                            </Link>
                        </Alert>
                    </Container>
                </div> :
                    <div>
                        <Appbar auth={user !== undefined} isAdmin={user.isAdmin} onLogoutCallback={this.props.onLogoutCallback} routeProps={this.props.routeProps} />
                        <Container className={classes.Container}>
                            <CourseBanner courseName={courseName} />
                            <div className={classes.notesSection}>
                                <Typography variant='h3'>Notes</Typography>
                                {courseData.length !== 0 ?
                                    <Grid container className={classes.notesContainer} spacing={5}>
                                        {courseData.map((c, ci) => {
                                            if(c.notes.length !== 0){
                                                return (
                                                    <Grid item xs={6} key={ci}>
                                                    <CourseData courseData={c} isAdmin={user.isAdmin} courseName={courseName}/>
                                                    </Grid>
                                                );
                                            }
                                            return null;
                                        }
                                        )}
                                    </Grid> :
                                    <Typography variant="h2" style={{ textAlign: 'center' }}>No Notes Available</Typography>
                                }
                            </div>
                        </Container>
                    </div>}
            </div>
        );
    }

}

export default withRouter(withStyles(styles)(CourseScreen));