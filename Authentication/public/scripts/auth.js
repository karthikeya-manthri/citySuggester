const logout = document.querySelector('#logout');
var loading = "";
var img;

//Function to reset a field
resetField = (field)=>{
    field.value=null;
}


//Auth status change 
auth.onAuthStateChanged(usr => {
    user = usr;
    if (user) {

        isUserLogged = true;
        user.getIdTokenResult().then((idTokenResult) => {
            //console.log(idTokenResult)
            user.admin = idTokenResult.claims.admin;
            NavUI(user).then(()=>{
                render()
            });
        }).catch(err => { console.log(err) })
    }
    else {
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
            //console.log(dataURL)
            //console.log(output)
            invokeLoadImage(dataURL);
        };
        reader.readAsDataURL(input.files[0]);
    }
    else {
        invokeLoadImage("assets/user2.png")
    }

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

//Email Verifcation
handleVerify = ()=>{
    document.getElementById("overlay").style.display = "block";
    auth.onAuthStateChanged(usr=>{
        if(usr){
        const verify = document.querySelector(".verifyEmail");
        usr.sendEmailVerification().then(() => {
            //console.log("success")
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="green">Verification link is sent!</font>', classes: 'rounded white' });
            verify.innerHTML = "";
        }).catch(error => {
            console.log(error)
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="red">Please try again</font>', classes: 'rounded white' });
        })
        }
    })                
}

//Invoke Home page on Load
invokeHome = () => {
    const bodyMain = document.querySelector(".main");
    const verify = document.querySelector(".verifyEmail");
     // Logged in content
    const loggedInHTML = `
                        <center>
                        <img src="assets/smiley.png" style="width: 150px; height: 150px;">
                        <br><br>
                        <h5> You have logged in successfully </h5>
                        </center>
                        `;
    // Verification of Email content 
    const verfiyEmail = `
                        <center>
                            <form id="verification">
                                <button class="btn #263238 blue-grey darken-4 z-depth-0" onclick="handleVerify()">Verify Email</button>
                            </form>
                        </center>

                        `;
    const loggedOutHTML = `
                            <center>
                            <h4>Welcome! Please Login/Signup</h4>
                            </center>
                        `;
    auth.onAuthStateChanged(usr=>{
        if(usr){
            bodyMain.innerHTML = loggedInHTML;
            if(!usr.emailVerified){
                verify.innerHTML = verfiyEmail;
            } else{
                verify.innerHTML = "";
            }
        } else{
            bodyMain.innerHTML = loggedOutHTML;
            verify.innerHTML = "";
        }
    })
}

//Invoke Login form on load
invokeLogin = () => {
    const loginForm = document.querySelector("#login-form");
    //Login
    if (loginForm) {
        
        loginForm.addEventListener("submit", (e) => {
            console.log("inside login button")
            document.getElementById("overlay").style.display = "block";
            e.preventDefault();
            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;
            var loader = document.querySelector(".login-loading")
            loader.innerHTML = loading;
            

            //Logging User(asynchronous)
            auth.signInWithEmailAndPassword(email, password).then(credential => {
                document.getElementById("overlay").style.display = "none";
                window.location.hash="#"
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
}

//Invoke Signup Form on load
invokeSignup = () => {
    const signupForm = document.querySelector("#signup-form");
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
                        window.location.hash = "#"

                    }).catch((error) => {
                        const signupForm = document.querySelector("#signup-form");
                        var loader = document.querySelector(".signup-loading")
                        document.getElementById("overlay").style.display = "none";
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
}

//Invoke Account page on Load
invokeAccount = () => {
    const accountDetails = document.querySelector(".account-details");
    const bio = document.querySelector(".bio");
    const imgPlace = document.querySelector(".uploadedImage");
    auth.onAuthStateChanged(user=>{
        if(user){
            db.collection('users').doc(user.uid).get().then(doc => {
                const bioDetails = `
                    <div> <h5><i>${doc.data().bio}</i> <img src="assets/edit2.png" class="modal-trigger" data-target="modal-edit-bio" style="width:35px; height:35px; cursor:pointer;"> </h5> <br></br>
                    </div>
                `;
                if(bio)
                bio.innerHTML = bioDetails;
            });

            storageRef = storage.ref(user.email);
            storageRef.getDownloadURL().then((url) => {
                imgContent = `
                        <div class="center-align">
                            <img src=${url} style="width:130px; height:100px"> <img src="assets/edit2.png" class="modal-trigger" data-target="modal-edit-img" style="width:35px; height:35px; cursor:pointer" onclick="handleEdit(${user.email},2)">
                        <div>
                    `;
                if(imgPlace)
                imgPlace.innerHTML = imgContent;
            }).catch(error => {
                console.log(error);
            });
            // Details of logged user
            const userDetails = `
                    <div> <h6> <b>Email</b>: <i>${user.email}</i> </h6> <br></br>
                        <h6> <b>Account-Verified</b>: <i>${user.emailVerified}</i></h6>
                    </div>
                `;
        
            if(accountDetails)
            accountDetails.innerHTML = userDetails;
        } else {
            if(accountDetails) accountDetails.innerHTML = '';
            if(imgPlace) imgPlace.innerHTML = '';
            if(bio) bio.innerHTML = ''; 
        }

    })
}

//Invoke Admin form after load
invokeAdmin = () => {
    const adminForm = document.querySelector('.admin-actions');
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
}

//Load image in signup
invokeLoadImage = (url) => {
    let output = document.querySelector('.image-preview');
    output.innerHTML = `
                        <img src=${url}>
                       `;
}

