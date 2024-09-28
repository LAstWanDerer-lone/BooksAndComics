import React, { useState } from 'react';

import {Document, Page, pdfjs} from 'react-pdf';
import {ButtonGroup, IconButton, makeStyles} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
    pdfControl: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
}));

function PDFPreview(props) {

    const classes = useStyles();

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onPdfLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber-1);
        }
    }

    const nextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber+1);
        }
    }   

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    return (
        <div>
            <Document file={props.fileUrl} onLoadSuccess={onPdfLoadSuccess} >
                <Page pageNumber={pageNumber} height={400} width={400} />
            </Document>

            <ButtonGroup size="small" color="primary" aria-label="outlined primary button group" className={classes.pdfControl}>
                <IconButton onClick={prevPage}><ArrowBackIosIcon fontSize="small" /></IconButton>
                <p>Page {pageNumber} of {numPages}</p>
                <IconButton onClick={nextPage}><ArrowForwardIosIcon fontSize="small" /></IconButton>
            </ButtonGroup>
        </div>
    );
}

export default PDFPreview;