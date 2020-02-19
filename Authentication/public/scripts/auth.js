const logout = document.querySelector('#logout');
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
var loadFile = (file, type) => {
    var input = file.target;

    if (input.files.length) {
        if (file.target)
            img = file.target.files[0];
            //console.log(img)
        //console.log(file.target.files[0]);
        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            //console.log(dataURL)
            //console.log(output)
            invokeLoadImage(dataURL,type);
        };
        reader.readAsDataURL(input.files[0]);
    }
    else {
        invokeLoadImage("assets/user2.png",type)
    }

}


//Logout
if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        //Logging out user(asynchronous)
        document.getElementById("overlay").style.display = "block";
        auth.signOut().then(() => {
            window.location.hash = "#"
            //console.log("User Successfully logged out");
            document.getElementById("overlay").style.display = "none";
            loginForm.reset();
            signupForm.reset(); 
            location.reload()
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
        document.getElementById("overlay").style.display = "block";
        const email = forgotForm['forgotPass-email'].value;
        const modal = document.querySelector("#modal-forgot");
        auth.sendPasswordResetEmail(email).then(() => {
            forgotForm.reset();
            M.Modal.getInstance(modal).close();
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="green">Reset link has been sent!</font>', classes: 'rounded white' });
        }).catch((error) => {
            //M.Modal.getInstance(modal).close();
            document.getElementById("overlay").style.display = "none";
            forgotForm.reset();
            M.toast({ html: '<font color="red">Email does not exist</font>', classes: 'rounded white' });
        });
    });
}


//Update Bio
const updateBio = document.querySelector("#edit-bio-form");
if (updateBio) {
    updateBio.addEventListener("submit", (e) => {
        e.preventDefault();
        document.getElementById("overlay").style.display = "block";
        const newBio = updateBio['edit-bio'].value;
        const modal = document.querySelector("#modal-edit-bio");
        if(newBio){
        auth.onAuthStateChanged(usr=>{
            db.collection("users").doc(usr.uid).set({
                bio: newBio,
            }).then(()=>{
                updateBio.reset();
                M.Modal.getInstance(modal).close();
                document.getElementById("overlay").style.display = "none";
                M.toast({ html: '<font color="green">Bio Updated Sucessfully!</font>', classes: 'rounded white' });
                location.reload();
            }).catch((err)=>{
                document.getElementById("overlay").style.display = "none";
                M.toast({ html: '<font color="green">Please Try Again</font>', classes: 'rounded white' });
            });
        })} else{
            document.getElementById("overlay").style.display = "none";
            M.toast({ html: '<font color="red">Please write something.</font>', classes: 'rounded white' });
        }
        
    });
}


//Update Image
auth.onAuthStateChanged(usr=>{
    const updateImage = document.querySelector("#edit-image-form");
    if(updateImage) {
        updateImage.addEventListener("submit",(e) => {
            e.preventDefault();
            const modal = document.querySelector("#modal-edit-img");
            document.getElementById("overlay").style.display = "block";
            storageRef = storage.ref(usr.uid);
            if(img){
            storageRef.put(img).then(() => {
                document.getElementById("overlay").style.display = "none";
                M.toast({ html: '<font color="green">Image Updated Sucessfully!</font>', classes: 'rounded white' });
                M.Modal.getInstance(modal).close();
                updateImage.reset();
                location.reload();
            }) .catch(err=>{
                document.getElementById("overlay").style.display = "none";
                M.toast({ html: '<font color="red">Please Try Again</font>', classes: 'rounded white' });
            })} else{
                document.getElementById("overlay").style.display = "none";
                M.toast({ html: '<font color="red">Please Select an Image</font>', classes: 'rounded white' });
            }
        });
}


});

//Email Verifcation
// handleVerify = ()=>{
//     document.getElementById("overlay").style.display = "block";
//     auth.onAuthStateChanged(usr=>{
//         if(usr){
//         const verify = document.querySelector(".verifyEmail");
//         usr.sendEmailVerification().then(() => {
//             //console.log("success")
//             document.getElementById("overlay").style.display = "none";
//             M.toast({ html: '<font color="green">Verification link is sent!</font>', classes: 'rounded white' });
//             verify.innerHTML = "";
//         }).catch(error => {
//             console.log(error)
//             document.getElementById("overlay").style.display = "none";
//             M.toast({ html: '<font color="red">Please try again</font>', classes: 'rounded white' });
//         })
//         }
//     })                
// }

//Invoke Home page on Load
invokeHome = () => {
    const bodyMain = document.querySelector(".main");
     // Logged in content
    const loggedInHTML = `
                        <center>
                        <img class="homeImg" src="assets/smiley.png" alt="smiley">
                        <br><br>
                        <h5> You have logged in successfully </h5>
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
        } else{
            bodyMain.innerHTML = loggedOutHTML;
        }
    })
}

//Invoke Login form on load
invokeLogin = () => {
    const loginForm = document.querySelector("#login-form");
    //Login
    if (loginForm) {
        
        loginForm.addEventListener("submit", (e) => {
            // console.log("inside login button")
            document.getElementById("overlay").style.display = "block";
            e.preventDefault();
            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;
            

            //Logging User(asynchronous)
            auth.signInWithEmailAndPassword(email, password).then(credential => {
                document.getElementById("overlay").style.display = "none";
                window.location.hash="#"
                //Closing the login modal and resetting the form
                // console.log("logged in")
                loginForm.reset();
                window.location.hash = "#";
                
            }).catch((error) => {
                //if credentials are wrong / doesn't exist.
                // M.Modal.getInstance(modal).close();
                document.getElementById("overlay").style.display = "none";
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
                    //Signing up the user (asynchronous)
                    auth.createUserWithEmailAndPassword(email, password).then(Credential => {
                        //console.log(Credential.user.emailVerified);
                        //Closing the login modal and resetting the form
                        window.location.hash = "#"
                        storageRef = storage.ref(Credential.user.uid);
                        storageRef.put(img)
                        db.collection("users").doc(Credential.user.uid).set({
                            bio: signupForm['signup-bio'].value,
                        });
                        Credential.user.sendEmailVerification().then(()=>{
                            signupForm.reset();
                            document.getElementById("overlay").style.display = "none";

                    }).catch((error) => {
                        console.log(error);
                        document.getElementById("overlay").style.display = "none";
                    });;
                }).catch(error => {
                    console.log(error,"error")
                        const signupForm = document.querySelector("#signup-form");
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
    document.getElementById("overlay").style.display = "block";
    auth.onAuthStateChanged(user=>{
        if(user){
            
            db.collection('users').doc(user.uid).get().then(doc => {
                const bioDetails = `
                    <div> <h5><i>${doc.data().bio}</i> </h5> <br></br>
                    </div>
                `;
                if(bio)
                bio.innerHTML = bioDetails;
            });

            storageRef = storage.ref(user.uid);
            storageRef.getDownloadURL().then((url) => {
                imgContent = `
                        <div class="center-align">
                            <img src=${url} alt="user-image">
                        <div>
                    `;
                if(imgPlace)
                imgPlace.innerHTML = imgContent;
                document.getElementById("overlay").style.display = "none";
            }).catch(error => {
                console.log(error);
                document.getElementById("overlay").style.display = "none";
            });
            // Details of logged user
            const userDetails = `
                    <div> <h6> <b>Email</b>: <i>${user.email}</i> </h6>
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
invokeLoadImage = (url,type) => {
    let output = document.querySelector('.image-preview'); 
    let outputEdit = document.querySelector('.image-preview-edit');
    if(type === 1){
        output.innerHTML = `
                        <img src=${url} alt="user-image">
                       `;
    } else{ 
        outputEdit.innerHTML = `
                            <img src=${url} alt="user-image">
                        `;

    }
}

