//Forms
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const logout = document.querySelector('#logout');
const adminForm = document.querySelector('.admin-actions');
var output = document.querySelector('.image-preview');
var loading = "";
var img;
let isUserLogged = false;
let user;

//Function to reset a field
resetField = (field)=>{
    field.value=null;
}

//Add admin cloud function
if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        var loader = document.querySelector(".admin-loading")

        loader.innerHTML = loading;
        const adminEmail = document.querySelector('#admin-email').value;
        const addAdminRole = functions.httpsCallable('addAdminRole');
        document.getElementById("overlay").style.display = "block";
        addAdminRole({ email: adminEmail }).then(result => {
            document.getElementById("overlay").style.display = "none";
            //console.log(result);
            if (result && result.data && result.data.errorInfo && result.data.errorInfo.code == "auth/user-not-found") {
                adminForm.reset();
                M.toast({ html: '<font color="red">Please re-check Email</font>', classes: 'rounded white' });
            }
            else {
                adminForm.reset();
                M.toast({ html: '<font color="green">Admin created!</font>', classes: 'rounded white' });
            }

        }).catch(err => {
            document.getElementById("overlay").style.display = "none";
            adminForm.reset()
            M.toast({ html: '<font color="green">Re-check Email!</font>', classes: 'rounded white' });
        })
    });
}


//Auth status change 
auth.onAuthStateChanged(usr => {
    user = usr;
    if (user) {
        //console.log("user Logged in",user);
        //NavUI(user)
        isUserLogged = true;
        user.getIdTokenResult().then((idTokenResult) => {
            //console.log(idTokenResult)
            user.admin = idTokenResult.claims.admin;
            NavUI(user).then(()=>{
                render()
            });

            //Email Verifcation
            const Verification = document.querySelector("#verification");
            //console.log("ver",Verification)
            if (Verification) {
                Verification.addEventListener("submit", (e) => {
                    e.preventDefault();
                    document.getElementById("overlay").style.display = "block";
                    const verify = document.querySelector(".verifyEmail");

                    user.sendEmailVerification().then(() => {
                        //console.log("success")
                        document.getElementById("overlay").style.display = "none";
                        M.toast({ html: '<font color="green">Verification link is sent!</font>', classes: 'rounded white' });
                        verify.innerHTML = "";
                    }).catch(error => {
                        console.log(error)
                        document.getElementById("overlay").style.display = "none";
                        M.toast({ html: '<font color="red">Please try again</font>', classes: 'rounded white' });
                    })
                })
            }
        }).catch(err => { console.log(err) })


    }
    else {
        // console.log("User Logged Out",user);
        //  console.log("inside navUi call from auth")
        isUserLogged = false;
        user = null;
        NavUI(false).then(()=>{
            render()
        })
    }
});


//Password requirement checker
function checkPassword(str) {
    // at least six characters
    var re = /.{6,}/;
    return re.test(str);
}

//Function to load the image
var loadFile = (file) => {
    var input = file.target;

    if (input.files.length) {
        if (file.target)
            img = file.target.files[0];
        //console.log(file.target.files[0]);
        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            console.log(dataURL)
            console.log(output)
            var imgContent = `
            <img src=${dataURL}>
        `
            output.innerHTML = imgContent;
            //console.log(dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }
    else {
        output.innerHTML = `
        <img src="assets/user2.png">
        `;
    }

}


// Signup
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById("overlay").style.display = "block";
        //User info
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const confirmPassword = signupForm['signup-confirm-password'].value;

        //if passwords doesn't match
        if (password !== confirmPassword) {
            resetField(document.getElementById('signup-password'))
            resetField(document.getElementById('signup-confirm-password'))
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="red">Passwords does not match</font>', classes: 'rounded white' });
        }
        else if (!checkPassword(password)) {
            resetField(document.getElementById('signup-password'))
            resetField(document.getElementById('signup-confirm-password'))
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="red">Password length should atleast be 6</font>', classes: 'rounded white' });
        }

        //if passwords match
        else {
            storageRef = storage.ref(email);
            storageRef.put(img).then(() => {
                //Signing up the user (asynchronous)
                auth.createUserWithEmailAndPassword(email, password).then(Credential => {
                    //console.log(Credential.user.emailVerified);
                    //Closing the login modal and resetting the form
                    db.collection("users").doc(Credential.user.uid).set({
                        bio: signupForm['signup-bio'].value,
                        loginCount: 1
                    });
                    signupForm.reset();
                    document.getElementById("overlay").style.display = "none";

                }).catch((error) => {
                    const signupForm = document.querySelector("#signup-form");
                    var loader = document.querySelector(".signup-loading")
                    document.getElementById("overlay").style.display = "none";
                    // output.innerHTML = `
                    // <img src="assets/user2.png">
                    // `;
                    console.log("error", error);
                    const signError = document.querySelector(".signup-error");
                    if (error.code == "auth/invalid-email") {
                        resetField(document.getElementById('signup-email'))
                        M.toast({ html: '<font color="red">Invalid Email please re-check.</font>', classes: 'rounded white' });
                    }
                    else if (error.code == "auth/weak-password") {
                        resetField(document.getElementById('signup-password'))
                        resetField(document.getElementById('signup-confirm-password'))
                        M.toast({ html: '<font color="red">Password length should be atleast 6</font>', classes: 'rounded white' });

                    }
                    else if (error.code == "auth/email-already-in-use") {
                        resetField(document.getElementById('signup-email'))
                        M.toast({ html: '<font color="red">Email already in use</font>', classes: 'rounded white' });
                    }
                    else {
                        signError.innerHTML = "";
                    }
                });;
            }).catch(error => {
                console.log(error);
                document.getElementById("overlay").style.display = "none";
            })
        }
    })
}


//Logout
if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        //Logging out user(asynchronous)
        document.getElementById("overlay").style.display = "block";
        auth.signOut().then(() => {
            // console.log("User Successfully logged out");
            document.getElementById("overlay").style.display = "none";
            loginForm.reset();
            signupForm.reset();
            window.location.hash = "#";
        }).catch((err)=>{
            document.getElementById("overlay").style.display = "none";
        })
    })
}


//Login
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        document.getElementById("overlay").style.display = "block";
        e.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        var loader = document.querySelector(".login-loading")
        loader.innerHTML = loading;
        

        //Logging User(asynchronous)
        auth.signInWithEmailAndPassword(email, password).then(credential => {
            document.getElementById("overlay").style.display = "none";
            //Closing the login modal and resetting the form
            console.log("logged in")
            loader.innerHTML = "";
            loginForm.reset();
            window.location.hash = "#";
            
        }).catch((error) => {
            //if credentials are wrong / doesn't exist.
            // M.Modal.getInstance(modal).close();
            document.getElementById("overlay").style.display = "none";
            console.log(error)
            var loader = document.querySelector(".login-loading")
            loader.innerHTML = "";
            if(error.code==="auth/wrong-password"){
                resetField(document.getElementById("login-password"))
                M.toast({ html: '<font color="red">Please re-check Password</font>', classes: 'rounded white' });
            }
            else{
                    resetField(document.getElementById("login-email"))
                    M.toast({ html: '<font color="red">Please re-check Email</font>', classes: 'rounded white' });
            }
        });
    });
}


//Forgot Password
const forgotForm = document.querySelector("#forgot-form");
if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        var loader = document.querySelector(".forgot-loading")
        document.getElementById("overlay").style.display = "block";
        loader.innerHTML = loading;
        const email = forgotForm['forgotPass-email'].value;
        const modal = document.querySelector("#modal-forgot");
        auth.sendPasswordResetEmail(email).then(() => {
            forgotForm.reset();
            M.Modal.getInstance(modal).close();
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="green">Reset link has been sent!</font>', classes: 'rounded white' });
        }).catch((error) => {
            var loader = document.querySelector(".forgot-loading")
            //M.Modal.getInstance(modal).close();
            loader.innerHTML = "";
            document.getElementById("overlay").style.display = "none";
            forgotForm.reset();
            M.toast({ html: '<font color="red">Email does not exist</font>', classes: 'rounded white' });
        });
    });
}

handleEdit=(ref,type)=>{
    iconsole.log(ref,type)
}