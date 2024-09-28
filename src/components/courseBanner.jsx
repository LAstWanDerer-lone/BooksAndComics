import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

function CourseBanner(props) {

    const useStyles = makeStyles((theme) => ({
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
        }
    }));

    const classes = useStyles();

    const abbrData = {
        'CSE': 'Computer Science And Engineering',
        'ISE': 'Information Science And Engineering',
        'EEE': 'Electrical and Electronics Engineering',
        'ECE': 'Electronics and Communication Engineering',
        'Mech': 'Mechanical Engineering',
        'Civil': 'Civil Engineering',
        'Mathematics': 'Department of Mathematics',
        'Science': 'Basics Of Science'
    }


    const descData = {
        'ISE':'Computers have become an indispensible part of our life and an aide to solving problems of any magnitude. This is where the young Computer Engineers step in to create a difference. Career opportunities for students include developing software systems for a diverse range of applications, such as user interfaces, networks, ,databases, forecasting, World Wide Web support, medical communication, satellite, embedded systems, artificial intelligence and neural networks.',
        'CSE': "Computers have become an indispensible part of our life and an aide to solving problems of any magnitude. This is where the young Computer Engineers step in to create a difference. Career opportunities for students include developing software systems for a diverse range of applications, such as user interfaces, networks, databases, forecasting, World Wide Web support, medical communication, satellite, embedded systems, artificial intelligence and neural networks.",
        'EEE': "Electrical Engineering is spread across a range of specialties such as acoustics, speech, signal processing to electromagnetic compatibility, automobiles to vehicular technology, geo-science and remote sensing, laser and electro-optics, robotics, ultra-sonic, ferroelectrics and frequency control.",
        'ECE': 'Electronics and Communications Engineering (ECE) involves researching, designing, developing and testing of electronic equipment used in various systems. Electronics and Communications engineers also conceptualize and oversee the manufacturing of communications and broadcast systems.',
        'Civil': 'Civil Engineering involves planning, designing, constructing, maintaining and supervising infrastructures which include facilities essential to modern life like highways, bridges and tunnels, schools, hospitals, airports and other buildings, sewage systems and water treatment facilities.',
        'Mech': "Mechanical engineers design everything from new batteries, athletic equipment to medical devices and from personal computers, air conditioners, automobile engines to electric power plants. These engineers also design machines that produce these innovations.",
        'Science': 'The Basic Science subjects are pivotal for engineering education. These subjects taught in the first year help in better understanding and application of their respective streams. All Engineering branches have evolved from these basic principles, the branches of physics, chemistry and mathematics from an important base in understanding the larger concepts and theories of the various Engineering branches.',
        'Mathematics': 'Mathematics is the science of structure, order, and relation that has evolved from elemental practices of counting, measuring, and describing the shapes of objects. It deals with logical reasoning and quantitative calculation, and its development has involved an increasing degree of idealization and abstraction of its subject matter.',
    }


    return (
        <div>
                <Grid container className={classes.banner} justify='center' alignItems='center'>
                    <Grid item xs={12}>
                    <Typography variant='h2' className={classes.bannerTitle}>
                            <Box fontWeight="fontWeightBold">
                                {abbrData[props.courseName]}
                            </Box>
                        </Typography>
                        <Typography variant='h6' className={classes.bannerDesc}>
                            <Box fontWeight="fontWeightBold">
                                {descData[props.courseName]}
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
        </div>
    );
}

export default CourseBanner;