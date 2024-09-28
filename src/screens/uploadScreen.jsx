import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import {
    Container,
    Grid,
    FormControl,
    InputLabel,
    Select,
    Button,
    TextField,
    Typography,
    MenuItem
} from '@material-ui/core';

import PDFPreview from '../components/PDFPreview';
import Blue from '@material-ui/core/colors/blue';

const styles = theme => ({
    root: {
        height: '100vh',
    },
    container: {
        borderRadius: '18px',
        boxShadow: '4px 8px 8px 4px rgba(0, 0, 0, 0.2)',
        height: '90vh',
        display: 'flex',
        flexDirection: 'row',
        justify: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: "20px"
    },
    formContainer: {
        backgroundColor: '#dfe6e9',
        height: '90vh',
        width: '100%',
        borderRadius: '18px 0px 0px 18px',
    },
    form: {
        padding: '20px',
    },
    formControl: {
        margin: '10px 0px'
    },
    pdfpreview: {
        borderRadius: '0px 18px 18px 0px',
        textAlign: 'center'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: Blue[700],
        color: "white",
        textAlign: 'center',
        textDecoration: 'none',
        '&:hover': { color: "white", backgroundColor: Blue[900], }
    },
    chooseBtn: {
        margin: '10px 0px',
    },
    formTitle: {
        textAlign: 'center',
        margin: '20px 0px'
    },
    discard: {
        backgroundColor: '#f44336',
        color: 'white',
        '&:hover': {
            backgroundColor: "#d32f2f"
        }
    }
});

const initState = {
    course: '',
    newCourse: '',
    semester: '',
    subjectName: '',
    file: null,
    fileUrl: undefined,
}

var uploaded = false;

class UploadScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            course: '',
            semester: '',
            subjectName: '',
            file: null,
            fileUrl: undefined,
            error: false
        }
    }

    courseList = ['CSE', 'ISE', 'EEE', 'ECE', 'Civil', 'Mech', 'Mathematics', 'Science'];
    semesterList = [1, 2, 3, 4, 5, 6, 7, 8];

    onChange = (event) => {
        uploaded = false;
        this.setState({
            [event.target.name]: event.target.value,
            error: false
        });
    }

    onFileChosen = (event) => {
        this.setState({
            file: event.target.files[0]
        });

        const fileUrl = URL.createObjectURL(event.target.files[0]);

        this.setState({ fileUrl: fileUrl })

    }

    onDiscard = () => {
        this.props.routeProps.history.goBack();
    }

    onSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        const data = this.state;    
        
        formData.append('course', data.course);
        formData.append('semester', data.semester);
        formData.append('subjectName', data.subjectName);
        formData.append('file', data.file);
        formData.append('userId',data.user.id);


        const baseUrl = 'http://localhost:5000/';
        var endPoint = baseUrl;

        if(data.user.isAdmin === true){
            endPoint += 'admin/upload';
        }else{
            endPoint += 'upload';
        }

        axios.post(endPoint, formData)
            .then((res) => {

                if(res.data.status === 200) {
                    uploaded = true;
                    this.setState({
                        user: JSON.parse(localStorage.getItem('user')),
                        course: '',
                        semester: '',
                        subjectName: '',
                        file: null,
                        fileUrl: undefined,
                        error: false
                    });
                }else{
                    console.log("done");
                     this.setState({
                         error: true
                     });
                }
            })
            .catch((error) => {
                this.state.error = true;
            });
    }

    render() {

        const { classes } = this.props;
        const { user, course, semester, subjectName,error } = this.state;

        return (
            <div className={classes.root}>
                {user === null ? 
                <div>
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
                    <Container maxWidth="md" className={classes.container}>
                    <Grid  container spacing={6} direction="row" justify="center" alignItems="center">
                        <Grid item xs={5} className={classes.formContainer}>
                            <Typography component="h1" variant="h4" className={classes.formTitle}>
                                File Upload
                                </Typography>
                                {error === true &&
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    There was error while uploading <strong>check it out!</strong>
                                </Alert>
                            }
                            <form className={classes.form}>
                                <FormControl variant="filled" className={classes.formControl} fullWidth={true}>
                                    <InputLabel htmlFor="course">Course</InputLabel>
                                    <Select
                                        value={course}
                                        onChange={this.onChange}
                                        inputProps={{
                                            name: 'course',
                                            id: 'course',
                                        }}>
                                        <MenuItem aria-label="None" value="" />
                                        {this.courseList.map((c, index) => <MenuItem value={c} key={index}>{c}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <FormControl variant="filled" className={classes.formControl} fullWidth={true}>
                                    <InputLabel htmlFor="course">Semester</InputLabel>
                                    <Select
                                        value={semester}
                                        onChange={this.onChange}
                                        inputProps={{
                                            name: 'semester',
                                            id: 'semester',
                                        }}>
                                        <MenuItem aria-label="None" value="" />
                                        {this.semesterList.map((c, index) => <MenuItem value={c} key={index}>{c}</MenuItem>)}
                                    </Select>
                                </FormControl>
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="subjectName"
                                    label="Subject"
                                    name="subjectName"
                                    value={subjectName}
                                    onChange={this.onChange} />
                                <Button
                                    className={classes.chooseBtn}
                                    fullWidth={true}
                                    variant="contained"
                                    component="label">
                                    Choose a File
                                     <input type="file" name="file" accept="application/pdf" onChange={this.onFileChosen} hidden />
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    component="label"
                                    fullWidth={true}
                                    className={classes.submit}
                                    onClick={this.onSubmit}>
                                    Upload
                                </Button>
                                {uploaded && <Alert>File Uploaded</Alert>}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    component="label"
                                    fullWidth={true}
                                    className={classes.discard}
                                    onClick={this.onDiscard}>
                                    Discard
                                </Button>
                            </form>
                        </Grid>
                        <Grid item xs={7} className={classes.pdfpreview}>
                            {this.state.fileUrl !== undefined ?
                                <PDFPreview fileUrl={this.state.fileUrl} /> :
                                <Typography variant="h4">Choose a File to Preview</Typography>
                            }
                        </Grid>
                    </Grid>
                </Container>
                </div>
                }
            </div>
        );
    }

}

export default withStyles(styles)(UploadScreen);