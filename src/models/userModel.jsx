export class User{
    constructor({id, firstName, lastName, college, email, password}={}){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.college = college;
        this.email = email;
        this.password = password;
    }
}
//eslint-disable-next-line
export default {User};