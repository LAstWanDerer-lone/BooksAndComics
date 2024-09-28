import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import { withRouter } from 'react-router-dom';
import {
    IconButton,
    Container,
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
    withStyles,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Box
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Visibility from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Appbar from '../components/appbar';
import PDFPreview from '../components/PDFPreview';

const styles = (theme) => ({
    root: {
        height: '100vh',
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
    error: {
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    },
    link: {
        textDecoration: 'none',
        color: 'black',
        textTransform: 'capitalize'
    },
    banner: {
        background: '#f3e7dd',
        borderRadius: 15,
        color: '#202565'
    },
    bannerTitle: {
        paddingTop: '20px',
        textTransform: 'capitalize',
        textAlign: 'center'
    },
    bannerDesc: {
        textAlign: 'center',
        padding: '20px 40px'
    },
    noteData: {
        padding: '20px',
    },
    btn: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    }
});

class RequestNoteScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            requestNotes: [],
            user: JSON.parse(localStorage.getItem('user')),
            fileUrl: undefined,
            showPdf: false,
        }
        this.fetchRequestNotes = this.fetchRequestNotes.bind(this);
    }

    componentDidMount() {
        const courseName = this.props.match.params.courseName;
        this.fetchRequestNotes(courseName);
    }


    fetchRequestNotes() {

        axios.get('http://localhost:5000/request', {
            params: {
                userId: this.state.user.id,
            }
        })
            .then(async (res) => {
                this.setState({
                    requestNotes: res.data.requestNotes
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    getNote(fileName) {

        axios.get("http://localhost:5000/getfile", {
            responseType: "blob",
            params: {
                fileName: fileName
            }
        })
            .then((res) => {
                const file = new Blob([res.data], { type: "application/pdf" });
                const fileUrl = URL.createObjectURL(file);

                this.setState({
                    fileUrl: fileUrl,
                    showPdf: true
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteNote(requestNoteId, fileName) {


        axios.delete("http://localhost:5000/delete", {
            params: {
                requestNoteId: requestNoteId,
                fileName: fileName
            }
        })
            .then((res) => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    render() {

        const { classes } = this.props;
        const { requestNotes, user, fileUrl, showPdf } = this.state;

        const pendingNotes = [];
        const acceptedNotes = [];

        requestNotes.forEach((n) => {
            if (n.status === true) {
                acceptedNotes.push(n);
            } else {
                pendingNotes.push(n);
            }
        });

        const closePdf = () => {
            this.setState({ showPdf: false });
        }

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
                        <Container className={classes.banner}>
                            <Grid container direction="row" justify='center' alignItems='center'>
                                <Grid item xs={12}>
                                    {requestNotes.length === 0 ? <Typography variant='h2' className={classes.bannerTitle}>
                                        <Box fontWeight="fontWeightBold">
                                            You have not shared any notes.
                                        </Box>
                                    </Typography> :
                                        <ListItem>
                                            <ListItemText>
                                                <Typography variant='h5' className={classes.bannerDesc}>
                                                    <Box fontWeight="fontWeightBold">
                                                        You have {pendingNotes.length} pending note to be accepted.
                                        </Box>
                                                </Typography>
                                            </ListItemText>
                                            <ListItemIcon>
                                                <Button className={classes.btn}>
                                                    <Link to='/upload' className={classes.link}>Share More Notes</Link>
                                                </Button>
                                            </ListItemIcon>
                                        </ListItem>}
                                </Grid>
                            </Grid>
                        </Container>
                        {requestNotes.length === 0 ?
                            <Container maxWidth="sm" className={classes.error}>
                                <Alert severity="success">
                                    <AlertTitle>Once you share your notes it will appear here.</AlertTitle>
                                    <Link to="/upload" className={classes.link}>
                                        Share Note
                                     </Link>
                                </Alert>
                            </Container>
                            :
                            <div>
                                <Container >
                                    {pendingNotes.length !== 0 &&
                                        <div>
                                            <Typography variant="h4" style={{ marginLeft: '20px', marginTop: '20px' }}>
                                                Pending
                                    </Typography>
                                            <Grid container className={classes.notesContainer} spacing={5}>
                                                {pendingNotes.map((c, ci) =>
                                                    <Grid item xs={6} key={ci}>
                                                        <Paper className={classes.noteData}>
                                                            <ListItem>
                                                                <ListItemText>
                                                                    <Typography variant='h4'>
                                                                        <Box fontWeight="fontWeightBold">
                                                                            {c.subjectName}
                                                                        </Box>
                                                                    </Typography>
                                                                    <p>{c.courseName}, {c.semester} Semester </p>
                                                                </ListItemText>
                                                                <ListItemIcon>
                                                                    <IconButton onClick={() => { this.getNote(c.fileName) }}>
                                                                        <Visibility color="primary" />
                                                                    </IconButton>
                                                                    <IconButton onClick={() => { this.deleteNote(c._id, c.fileName) }}>
                                                                        <DeleteIcon color="primary" />
                                                                    </IconButton>
                                                                </ListItemIcon>
                                                            </ListItem>
                                                        </Paper>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </div>
                                    }
                                    
                                    {acceptedNotes.length !== 0 &&
                                        <div>
                                            <Typography variant="h4" style={{ marginLeft: '20px', marginTop: '20px' }}>
                                                Accepted
                                            </Typography>
                                            <Grid container className={classes.notesContainer} spacing={5}>
                                                {acceptedNotes.map((c, ci) =>
                                                    <Grid item xs={6} key={ci}>
                                                        <Paper className={classes.noteData}>
                                                            <ListItem>
                                                                <ListItemText>
                                                                    <Typography variant='h4'>
                                                                        <Box fontWeight="fontWeightBold">
                                                                            {c.subjectName}
                                                                        </Box>
                                                                    </Typography>
                                                                    <p>{c.courseName}, {c.semester} Semester </p>
                                                                </ListItemText>
                                                                <ListItemIcon>
                                                                    <IconButton onClick={() => { this.getNote(c.fileName) }}>
                                                                        <Visibility color="primary" />
                                                                    </IconButton>
                                                                    <IconButton onClick={() => { this.deleteNote(c._id, c.fileName) }}>
                                                                        <DeleteIcon color="primary" />
                                                                    </IconButton>
                                                                </ListItemIcon>
                                                            </ListItem>
                                                        </Paper>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </div>
                                    }

                                    <Dialog onClose={closePdf} aria-labelledby="customized-dialog-title" open={showPdf}>
                                        <DialogTitle id="customized-dialog-title" onClose={closePdf}>
                                            <center>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    startIcon={<CloudDownloadIcon />}
                                                    href={fileUrl}
                                                    target="_blank"
                                                    download>
                                                    Download
                                            </Button>
                                            </center>
                                        </DialogTitle>
                                        <DialogContent dividers>
                                            <PDFPreview fileUrl={fileUrl} />
                                        </DialogContent>
                                    </Dialog>
                                </Container>
                            </div>
                        }
                    </div>}
            </div>
        );
    }

}

export default withRouter(withStyles(styles)(RequestNoteScreen));