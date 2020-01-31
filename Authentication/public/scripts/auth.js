//Forms
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const logout = document.querySelector('#logout');
const adminForm = document.querySelector('.admin-actions');
var output = document.querySelector('.image-preview');
var loading = "";
var img;

//Add admin cloud function
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var loader = document.querySelector(".admin-loading")

    loader.innerHTML = loading;
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email: adminEmail }).then(result => {
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
        var loader = document.querySelector(".admin-loading")
        adminForm.reset().then(() => {
            loader.innerHTML = "";
        });
        M.toast({ html: '<font color="green">Re-check Email!</font>', classes: 'rounded white' });
    })
});


//Auth status change 
auth.onAuthStateChanged(user => {
    if (user) {
        //console.log("user Logged in",user);
        //NavUI(user)
        user.getIdTokenResult().then((idTokenResult) => {
            //console.log(idTokenResult)
            user.admin = idTokenResult.claims.admin;
            NavUI(user);

            //Email Verifcation
            const Verification = document.querySelector("#verification");
            if (Verification) {
                Verification.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const verify = document.querySelector(".verifyEmail");

                    user.sendEmailVerification().then(() => {
                        //console.log("success")
                        M.toast({ html: '<font color="green">Verification link is sent!</font>', classes: 'rounded white' });
                        verify.innerHTML = "";
                    }).catch(error => {
                        console.log(error)
                        M.toast({ html: '<font color="red">Please try again</font>', classes: 'rounded white' });
                    })
                })
            }
            }).catch(err=>{console.log(err)})


    }
    else {
        // console.log("User Logged Out",user);
        NavUI(false);
    }
});


//Password requirement checker
function checkPassword(str) {
    // at least six characters
    var re = /.{6,}/;
    return re.test(str);
}

var loadFile = (file)=>{
    var input = file.target;

    if(input.files.length){
        if(file.target)
        img = file.target.files[0];
        //console.log(file.target.files[0]);
        var reader = new FileReader();
        reader.onload = function(){
        var dataURL = reader.result;
        var imgContent = `
            <img src=${dataURL} style="height:100px; width:120px;">
        `
        output.innerHTML = imgContent;
        //console.log(dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }
    else{
        output.innerHTML = "";
    }
    
}




// Signup
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //User info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const confirmPassword = signupForm['signup-confirm-password'].value;
    let matchError = document.querySelector(".password-match");

    //if passwords doesn't match
    if (password !== confirmPassword) {
        signupForm.reset();
        M.toast({ html: '<font color="red">Passwords does not match</font>', classes: 'rounded white' });
    }
    else if (!checkPassword(password)) {
        signupForm.reset();
        M.toast({ html: '<font color="red">Password length should atleast be 6</font>', classes: 'rounded white' });
    }

    //if passwords match
    else {
        var loader = document.querySelector(".signup-loading")
        loader.innerHTML = loading;
        matchError.innerHTML = "";
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
                loader.innerHTML = "";
                output.innerHTML = "";
                signupForm.reset();

            }).catch((error) => {
                const signupForm = document.querySelector("#signup-form");
                var loader = document.querySelector(".signup-loading")
                signupForm.reset().then(() => {
                    loader.innerHTML = "";
                    output.innerHTML="";
                });;
                console.log("error", error);
                const signError = document.querySelector(".signup-error");
                if (error.code == "auth/invalid-email") {
                    M.toast({ html: '<font color="red">Invalid Email please re-check.</font>', classes: 'rounded white' });
                }
                else if (error.code == "auth/weak-password") {
                    M.toast({ html: '<font color="red">Password length should be atleast 6</font>', classes: 'rounded white' });

                }
                else if (error.code == "auth/email-already-in-use") {
                    M.toast({ html: '<font color="red">Email already in use</font>', classes: 'rounded white' });
                }
                else {
                    signError.innerHTML = "";
                }
            });;
        }).catch(error => {
            console.log(error);
        })
    }
})


//Logout
logout.addEventListener('click', (e) => {
    e.preventDefault();
    //Logging out user(asynchronous)
    auth.signOut().then(() => {
        // console.log("User Successfully logged out");
        loginForm.reset();
        signupForm.reset();
    })
})


//Login
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    var loader = document.querySelector(".login-loading")
    loader.innerHTML = loading;

    //Logging User(asynchronous)
    auth.signInWithEmailAndPassword(email, password).then(credential => {

        //Closing the login modal and resetting the form
        loader.innerHTML = "";
        loginForm.reset();
    }).catch((error) => {
        //if credentials are wrong / doesn't exist.
        // M.Modal.getInstance(modal).close();
        var loader = document.querySelector(".login-loading")
        loginForm.reset()
        loader.innerHTML = "";

        M.toast({ html: '<font color="red">Please re-check Email/Password</font>', classes: 'rounded white' });
    });
});



//Forgot Password
const forgotForm = document.querySelector("#forgot-form");
forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    var loader = document.querySelector(".forgot-loading")

    loader.innerHTML = loading;
    const email = forgotForm['forgotPass-email'].value;
    auth.sendPasswordResetEmail(email).then(() => {
        forgotForm.reset();
        M.toast({ html: '<font color="green">Reset link has been sent!</font>', classes: 'rounded white' });
    }).catch((error) => {
        var loader = document.querySelector(".forgot-loading")
        //M.Modal.getInstance(modal).close();
        loader.innerHTML = "";
        forgotForm.reset();
        M.toast({ html: '<font color="red">Email does not exist</font>', classes: 'rounded white' });
    });
});
