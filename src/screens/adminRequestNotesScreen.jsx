import React from 'react';
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
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Appbar from '../components/appbar';
import PDFPreview from '../components/PDFPreview';

const styles = () => ({
    root: {
        height: '100%'
    },
    Container: {
        marginTop: 30,
    },
    notesSection: {
        margin: '20px 0px'
    },
    notesContainer: {
        margin: '10px auto'
    },
    error: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
    },
    banner: {
        background: '#f3e7dd',
        borderRadius: 15,
        color: '#202565'
    },
    bannerTitle: {
        padding: '20px',
        textTransform: 'capitalize',
        textAlign: 'center'
    },
    bannerDesc: {
        textAlign: 'center',
        padding: '20px 40px'
    },
    link: {
        textDecoration: 'none',
        color: 'black',
        fontSize: '18px'
    }
});

class AdminRequestNoteScreen extends React.Component {

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

        axios.get('http://localhost:5000/admin/request')
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
            requestNoteId: requestNoteId,
            fileName: fileName
        })
            .then((res) => {
                //console.log(res);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    acceptNote(note) {

        axios.post("http://localhost:5000/admin/accept", {
            params: {
                requestNote: note,
                fileName: note.fileName
            }
        }).then((res) => {
            console.log(res);
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        })
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
                {user.isAdmin === false ?
                    <Container maxWidth="sm" className={classes.error}>
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            <p><strong>You Need to be Admin to Access</strong></p>
                        </Alert>
                    </Container>
                    :
                    <div>
                        <Appbar auth={user !== undefined} isAdmin={user.isAdmin} onLogoutCallback={this.props.onLogoutCallback} routeProps={this.props.routeProps} />
                        <Container className={classes.banner}>
                            <Typography variant="h4" className={classes.bannerTitle}>
                                <Box fontWeight="bold">{pendingNotes.length} Note to be accepted</Box>
                            </Typography>
                        </Container>

                        {pendingNotes.length !== 0 ?
                            <div>
                                <Container className={classes.notesContainer}>
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
                                                                <ThumbDownIcon style={{ color: "#f44336" }} />
                                                            </IconButton>
                                                            <IconButton onClick={() => { this.acceptNote(c) }}>
                                                                <ThumbUpIcon style={{ color: "#4CAF50" }} />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                    </ListItem>
                                                </Paper>
                                            </Grid>
                                        )}
                                    </Grid>
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
                            : null}

                    </div>}
            </div>
        );
    }

}

export default withRouter(withStyles(styles)(AdminRequestNoteScreen));