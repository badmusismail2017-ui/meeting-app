/*=========================================
        MeetAlarm Authentication
=========================================*/

class AuthService {

    constructor() {

        this.users = JSON.parse(localStorage.getItem("meetAlarmUsers")) || [];

        this.currentUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        ) || null;

    }

    saveUsers() {

        localStorage.setItem(
            "meetAlarmUsers",
            JSON.stringify(this.users)
        );

    }

    saveCurrentUser(user) {

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );

    }

    emailExists(email) {

        return this.users.some(user =>
            user.email.toLowerCase() === email.toLowerCase()
        );

    }

    register(user) {

        if (this.emailExists(user.email)) {

            return {

                success:false,

                message:"Email already exists."

            };

        }

        this.users.push(user);

        this.saveUsers();

        return {

            success:true,

            message:"Registration successful."

        };

    }

    login(email,password){

        const user=this.users.find(user=>

            user.email===email &&
            user.password===password

        );

        if(!user){

            return{

                success:false,

                message:"Invalid email or password."

            };

        }

        this.currentUser=user;

        this.saveCurrentUser(user);

        return{

            success:true,

            user

        };

    }

    logout(){

        localStorage.removeItem(
            "loggedInUser"
        );

    }

    isLoggedIn(){

        return localStorage.getItem(
            "loggedInUser"
        )!==null;

    }

}

const auth=new AuthService();

/*=========================================
        PASSWORD TOGGLE
=========================================*/

const togglePassword=document.querySelector("#togglePassword");

const password=document.querySelector("#password");

if(togglePassword){

togglePassword.addEventListener("click",()=>{

if(password.type==="password"){

password.type="text";

togglePassword.classList.remove("fa-eye");

togglePassword.classList.add("fa-eye-slash");

}else{

password.type="password";

togglePassword.classList.remove("fa-eye-slash");

togglePassword.classList.add("fa-eye");

}

});

}

/*=========================================
        LOGIN
=========================================*/

const loginForm=document.querySelector("#loginForm");

if(loginForm){

loginForm.addEventListener("submit",(e)=>{

e.preventDefault();

const email=document.querySelector("#email").value.trim();

const password=document.querySelector("#password").value;

const button=document.querySelector(".login-btn");

button.classList.add("loading");

setTimeout(()=>{

const result=auth.login(email,password);

button.classList.remove("loading");

if(result.success){

alert("Login Successful 🎉");

window.location.href="dashboard.html";

}else{

alert(result.message);

}

},1200);

});

}

/*=========================================
        REGISTER
=========================================*/

const registerForm=document.querySelector("#registerForm");

if(registerForm){

registerForm.addEventListener("submit",(e)=>{

e.preventDefault();

const fullname=document.querySelector("#fullname").value.trim();

const email=document.querySelector("#email").value.trim();

const password=document.querySelector("#password").value;

const confirmPassword=document.querySelector("#confirmPassword").value;

if(fullname.length<3){

alert("Full name is too short.");

return;

}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){

alert("Enter a valid email.");

return;

}

if(password.length<8){

alert("Password must be at least 8 characters.");

return;

}

if(password!==confirmPassword){

alert("Passwords do not match.");

return;

}

const result=auth.register({

id:Date.now(),

fullname,

email,

password,

createdAt:new Date()

});

if(result.success){

alert("Registration Successful 🎉");

window.location.href="login.html";

}else{

alert(result.message);

}

});

}

/*=========================================
        PAGE PROTECTION
=========================================*/

/*=========================================
        PAGE PROTECTION
=========================================*/

function protectPage() {

    const protectedPages = [

        "dashboard.html",

        "create-meeting.html"

    ];

    const currentPage =

        window.location.pathname.split("/").pop();

    if (

        protectedPages.includes(currentPage) &&

        !auth.isLoggedIn()

    ) {

        window.location.href = "login.html";

    }

}

protectPage();

/*=========================================
        LOGOUT
=========================================*/

function logout() {

    auth.logout();

    window.location.href = "login.html";

}

window.logout = logout;