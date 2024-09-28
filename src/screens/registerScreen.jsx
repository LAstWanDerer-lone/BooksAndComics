import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Blue from '@material-ui/core/colors/blue';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import LocalLibraryIcon from '@material-ui//icons/LocalLibrary';
import { User } from '../models/userModel';


const styles = theme => ({
    root: {
        height: '100vh',
        background: 'linear-gradient(to bottom right, #0039a6, #4B9CD3)',
        display: 'flex',
        flexDirection: 'row',
        justify: 'center',
        alignItems: 'center'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: 15,
        width: '80%',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    formTilte: {
        padding: '5px'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: Blue[700],
        '&:hover': {
            backgroundColor: Blue[900]
        }
    },
    link: {
        textDecoration: 'none',
        color: Blue[900],
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
});
class RegisterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            college: '',
            email: '',
            password: '',
            emailError: false,
            passwordError: false,
            errorText: ''
        };
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            firstNameError: false,
            emailError: false,
            passwordError: false,
            errorText: ''
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const newUser = new User({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            college: this.state.college,
            email: this.state.email,
            password: this.state.password,
        });

        const regex = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);
        const isEmailCorrect = regex.test(newUser.email);
        const isPasswordCorrect = newUser.password.length >= 8;

        if(!(isEmailCorrect && isPasswordCorrect)) {
            this.setState({
                emailError: !isEmailCorrect,
                passwordError: !isPasswordCorrect,
                errorText: !isEmailCorrect ? 'Enter valid Email address' : 'Password should be atleast 8 characters' 
            });
            return;
        }

        await axios.post('http://localhost:5000/register', newUser)
            .then(async (res) => {
                if (res.data.status === 409) {
                    this.setState({ emailError: true, errorText: 'Email Alreadt Exists' })
                } else {
                    await this.props.onSubmitCallback(res.data.user, false);
                    this.props.routeProps.history.replace('/home');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {

        const { classes } = this.props;
        const { firstName, lastName, college, email, password, emailError, passwordError, errorText } = this.state;

        return (
            <div className={classes.root}>
                <Container component="main" maxWidth="sm">
                    <div className={classes.formContainer}>
                    <Link to={`/`} className={classes.link}>
                            <Avatar className={classes.avatar}>
                                <LocalLibraryIcon />
                            </Avatar>
                            </Link>
                        <Typography component="h1" variant="h3" className={classes.formTilte}>
                            <Box fontWeight="bold">Create account</Box>
                        </Typography>
                        {(emailError || passwordError) &&
                            <Alert severity="error">
                                <strong>{errorText}</strong> 
                            </Alert>
                        }
                        <form className={classes.form} onSubmit={this.onSubmit}>
                            <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="firstName"
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        value={firstName}
                                        onChange={this.onChange} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        value={lastName}
                                        onChange={this.onChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="college"
                                        label="College"
                                        name="college"
                                        autoComplete="college"
                                        value={college}
                                        onChange={this.onChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        error={emailError}
                                        value={email}
                                        onChange={this.onChange} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="filled"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        error={passwordError}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={this.onChange} />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}>
                                Sign Up
                        </Button>
                            <Grid container justify="center">
                                <Grid item>
                                    <Link to='/login' className={classes.link}>
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </div>
        );
    }
}


export default withStyles(styles)(RegisterScreen);