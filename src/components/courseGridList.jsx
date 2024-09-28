import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CourseBox from './courseBox';

const { makeStyles } = require("@material-ui/core");

const useStyles = makeStyles((theme)=>({
    sectionName:{
        margin: '20px auto'
    },
    courseContainer: {
        borderRadius: 15,
        height: 280,
        width: 200
    },
}));

function CourseGridList(props) {

    const classes = useStyles();
    
    const colors = [
        ['#fc4a1a', '#f7b733'],
        ['#8E2DE2', '#4A00E0'],
        ['#00b09b', '#96c93d'],
        ['#c31432', '#240b36'],
        ['#5f2c82', '#49a09d'],
        ['#396afc', '#2948ff'],
    ];

    return(
        <div>
            <div className={classes.sectionName}>
                    <Typography variant='h4'>
                        <Box fontWeight="fontWeightBold">
                            {props.name}
                        </Box>
                    </Typography>
                </div>
                <Grid container spacing={3} justify="flex-start">
                    {props.list.map((l, index) =>
                        <Grid item className={classes.courseContainer} key={index}>
                            <CourseBox course={l} left={colors[index][0]} right={colors[index][1]} />
                        </Grid>
                    )}
                </Grid>
        </div>
    );
}

export default CourseGridList;