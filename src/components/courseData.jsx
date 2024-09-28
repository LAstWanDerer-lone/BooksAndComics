import React from 'react';
import {
    IconButton,
    List,
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
import axios from 'axios';
import PDFPreview from './PDFPreview';


const styles = (theme) => ({
    root: {
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0px 4px 4px 2NPMpx rgba(0, 0, 0, 0.2)',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '20px',
        boxShadow: theme.shadows[5],
        border: '1px solid transparent'
    }
});


class CourseData extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            fileUrl: undefined,
            showPdf: false,
            courseData: props.courseData,
            courseName: props.courseName
        }
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

    deleteNote(noteId, fileName) {

        axios.delete("http://localhost:5000/admin/delete", {
            params: {
                courseName: this.state.courseName,
                semesterId: this.state.courseData._id,
                noteId: noteId,
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

        const { fileUrl, showPdf, courseData } = this.state;

        const closePdf = () => {
            this.setState({ showPdf: false });
        }

        return (
            <div>
                { courseData.notes.length !== 0 &&
                    <Paper className={classes.root}>
                        <Typography variant="h5">Semester {courseData.semester}</Typography>
                        <List>
                            {courseData.notes.map((n, ni) =>
                                <ListItem key={ni}>
                                    <ListItemText>
                                        <Box fontWeight="bold">{n.subjectName}</Box>
                                    </ListItemText>
                                    <ListItemIcon>
                                        <IconButton onClick={() => { this.getNote(n.fileName) }}>
                                            <Visibility color="primary" />
                                        </IconButton>
                                        {this.props.isAdmin &&
                                            <IconButton onClick={() => { this.deleteNote(n._id, n.fileName) }}>
                                                <DeleteIcon color="primary" />
                                            </IconButton>}
                                    </ListItemIcon>
                                </ListItem>
                            )}
                        </List>
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
                    </Paper>
                }
            </div>
        );
    }
}

export default withStyles(styles)(CourseData);