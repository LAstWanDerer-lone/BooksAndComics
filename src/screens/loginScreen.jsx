import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Blue from '@material-ui/core/colors/blue';
import Book from '../assets/books.png';
import Avatar from '@material-ui/core/Avatar';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import LocalLibraryIcon from '@material-ui//icons/LocalLibrary';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
    root: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justify: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to top right, #0039a6, #4B9CD3, #120A8F)',
        color: 'black',
    },
    container: {
        borderRadius: '18px',
        boxShadow: '4px 8px 8px 4px rgba(0, 0, 0, 0.2)',
        height: '90vh',
        display: 'flex',
        flexDirection: 'row',
        justify: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    image: {
        height: '90vh',
        backgroundImage: `url(${Book}), linear-gradient(to bottom right, #0039a6, #120A8F)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        borderRadius: '18px 0px 0px 18px',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        borderRadius: '0px 18px 18px 0px',
        padding: '10px',
        textAlign: 'center',
    },
    formTitle: {
        textAlign: 'left'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: Blue[700],
        color: "white",
        textAlign: 'center',
        textDecoration: 'none',
        '&:hover': { color: "white", backgroundColor: Blue[900], }
    },
    link: {
        textAlign: 'center',
        textDecoration: 'none',
    },
    white: {
        color: 'white'
    },
    blue900: {
        color: Blue[900]
    },
});

class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: false,
            isAdmin: false,
        }
    }

    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('user'));
        if(userData) {
            this.props.routeProps.history.push('/home');
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            error: false,
            isAdmin: false
        });
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        });

        const userAuth = {
            email: this.state.email,
            password: this.state.password,
            isAdmin: this.state.isAdmin
        }
        
        await axios.get('http://localhost:5000/login', {
            params: {
                email: userAuth.email,
                password: userAuth.password,
                isAdmin: userAuth.isAdmin
            }
        })
            .then(async (res) => {
                if (res.data.status === 404) {
                    this.setState({ error: true });
                } else {
                    await this.props.onSubmitCallback(res.data.user[0], this.state.isAdmin);
                    this.props.routeProps.history.replace('/home');
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    toggleUser = () => {
        var prevState = this.state.isAdmin;
        this.setState({
            isAdmin: !prevState
        });   
    }

    render() {

        const { classes } = this.props;
        const { email, password, error, isAdmin } = this.state;
        
        return (
            <div className={classes.root}>
                <Container maxWidth="md" className={classes.container}>
                    <Grid container spacing={6} direction="row" justify="center" alignItems="center">
                        <Grid item xs={7} className={classes.image}></Grid>
                        <Grid item xs={5}>
                            {error === true &&
                                <Alert severity="error">
                                    <AlertTitle>Error</AlertTitle>
                                    Wrong Email or Password <strong>check it out!</strong>
                                </Alert>
                            }
                            <Link to={`/`} className={classes.link}>
                            <Avatar className={classes.avatar}>
                                <LocalLibraryIcon />
                            </Avatar>
                            </Link>
                            <form noValidate className={classes.form} onSubmit={this.onSubmit}>
                                <Typography component="h1" variant="h3" className={classes.formTitle}>
                                    Welcome Back
                                </Typography>
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={this.onChange} />
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={this.onChange} />
                                <FormControlLabel
                                    color="primary"
                                    control={<Switch checked={isAdmin} onChange={this.toggleUser} />}
                                    label="Admin Login"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className={classes.submit}>
                                    Sign In
                                </Button>
                                <Link to="/register" className={`${classes.link} ${classes.blue900}`}>
                                    Don't have an account? Sign Up
                                </Link>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </div >
        );
    }
}

export default withStyles(styles)(LoginScreen);