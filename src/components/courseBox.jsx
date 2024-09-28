import React from 'react';
import { makeStyles } from "@material-ui/core";
import {Link} from 'react-router-dom';

import CSE from '../assets/cse.png';

function CourseBox(props) {

    const useStyles = makeStyles((theme) => ({
        box: {
            textAlign: 'center',
            height: '100%',
            width: '100%',
            background: `linear-gradient(to right, ${props.left}, ${props.right})`,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 28,
            borderRadius: 15,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: 'transform .2s',
            '&:hover': {
                transform: 'scale(1.1)',
                cursor: 'pointer'
            }
        },
        link: {
            textDecoration: 'none',
            color: 'white'
        }
    }));

    const classes = useStyles();

    return (
        <Link to={`/course/${props.course}`} className={classes.link}>
            <div className={classes.box}>
                {props.course}
            </div>
        </Link>
    );
}


export default CourseBox;