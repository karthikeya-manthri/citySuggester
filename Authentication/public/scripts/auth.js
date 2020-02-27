let loadingScreen = document.getElementById("overlay");

//Function to reset a field
const resetField = (field) => {
    field.value = null;
}

const getUserState = () => {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            //console.log("ss",usr);
            resolve(user);
            if (!user) { reject({}) }
        })
    })
}


//Auth status change 
auth.onAuthStateChanged(usr => {
    user = usr;
    if (user) {
        isUserLogged = true;
        user.getIdTokenResult().then((idTokenResult) => {
            //console.log(idTokenResult)
            user.admin = idTokenResult.claims.admin;
            render()
            NavUI(user)
        }).catch(err => { console.log(err) })
    }
    else {
        isUserLogged = false;
        user = null;
        render()
        NavUI(false)
    }
});



//Password requirement checker
const checkPassword = (str) => {
    // at least six characters
    var re = /.{6,}/;
    return re.test(str);
}

//Function to load the image
let img;
const loadFile = (file, type) => {
    var input = file.target;
    if (input.files.length) {
        if (file.target)
            img = file.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            var dataURL = reader.result;
            invokeLoadImage(dataURL, type);
        };
        reader.readAsDataURL(input.files[0]);
    }
    else {
        if (type === 'SIGNUP')
            invokeLoadImage("assets/user3.png", type)
        else
            invokeLoadImage("assets/user2.png", type)
    }

}


//Logout
const logout = document.querySelector('#logout');
if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        //Logging out user(asynchronous)
        loadingScreen.style.display = "block";
        auth.signOut().then(() => {
            window.location.hash = "#"
            //console.log("User Successfully logged out");
            loadingScreen.style.display = "none";
            loginForm.reset();
            signupForm.reset();
            location.reload()
        }).catch((err) => {
            loadingScreen.style.display = "none";
        })
    })
}



//Forgot Password
const forgotForm = document.querySelector("#forgot-form");
if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loadingScreen.style.display = "block";
        const email = forgotForm['forgotPass-email'].value;
        const modal = document.querySelector("#modal-forgot");
        auth.sendPasswordResetEmail(email).then(() => {
            forgotForm.reset();
            M.Modal.getInstance(modal).close();
            loadingScreen.style.display = "none";
            M.toast({ html: '<font color="green">Reset link has been sent!</font>', classes: 'rounded white' });
        }).catch((error) => {
            //M.Modal.getInstance(modal).close();
            loadingScreen.style.display = "none";
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
        loadingScreen.style.display = "block";
        const newBio = updateBio['edit-bio'].value;
        const modal = document.querySelector("#modal-edit-bio");
        if (newBio) {
            getUserState().then(usr => {
                db.collection("users").doc(usr.uid).set({
                    bio: newBio,
                }).then(() => {
                    updateBio.reset();
                    M.Modal.getInstance(modal).close();
                    loadingScreen.style.display = "none";
                    M.toast({ html: '<font color="green">Bio Updated Sucessfully!</font>', classes: 'rounded white' });
                    location.reload();
                }).catch((err) => {
                    loadingScreen.style.display = "none";
                    M.toast({ html: '<font color="green">Please Try Again</font>', classes: 'rounded white' });
                });
            })
        } else {
            loadingScreen.style.display = "none";
            M.toast({ html: '<font color="red">Please write something.</font>', classes: 'rounded white' });
        }

    });
}


//Update Image
getUserState().then(usr => {
    const updateImage = document.querySelector("#edit-image-form");
    if (updateImage) {
        updateImage.addEventListener("submit", (e) => {
            e.preventDefault();
            const modal = document.querySelector("#modal-edit-img");
            loadingScreen.style.display = "block";
            storageRef = storage.ref(usr.uid);
            if (img) {
                storageRef.put(img).then(() => {
                    loadingScreen.style.display = "none";
                    M.toast({ html: '<font color="green">Image Updated Sucessfully!</font>', classes: 'rounded white' });
                    M.Modal.getInstance(modal).close();
                    updateImage.reset();
                    location.reload();
                }).catch(err => {
                    loadingScreen.style.display = "none";
                    M.toast({ html: '<font color="red">Please Try Again</font>', classes: 'rounded white' });
                })
            } else {
                loadingScreen.style.display = "none";
                M.toast({ html: '<font color="red">Please Select an Image</font>', classes: 'rounded white' });
            }
        });
    }


});

//Email Verifcation
// handleVerify = ()=>{
//     loadingScreen.style.display = "block";
//     getUserState().then(usr=>{
//         if(usr){
//         const verify = document.querySelector(".verifyEmail");
//         usr.sendEmailVerification().then(() => {
//             //console.log("success")
//             loadingScreen.style.display = "none";
//             M.toast({ html: '<font color="green">Verification link is sent!</font>', classes: 'rounded white' });
//             verify.innerHTML = "";
//         }).catch(error => {
//             console.log(error)
//             loadingScreen.style.display = "none";
//             M.toast({ html: '<font color="red">Please try again</font>', classes: 'rounded white' });
//         })
//         }
//     })                
// }

//Invoke Home page on Load
const invokeHome = () => {
    const bodyMain = document.querySelector(".main");
    // Logged in content
    const loggedInHTML = `
                        <div class="center-align">
                            <img class="homeImg" src="assets/smiley.png" alt="smiley">
                            <br><br>
                            <h5> You have logged in successfully </h5>
                        </div>            
                        `;
    const loggedOutHTML = `
                        <div class="center-align">
                            <h4>Welcome! Please Login/Signup</h4>
                        </div>
                        `;
    getUserState().then(usr => {
        if (usr) {
            bodyMain.innerHTML = loggedInHTML;
        } else {
            bodyMain.innerHTML = loggedOutHTML;
        }
    })
}

//Invoke Login form on load
const invokeLogin = () => {
    const loginForm = document.querySelector("#login-form");
    //Login
    if (loginForm) {

        loginForm.addEventListener("submit", (e) => {
            // console.log("inside login button")
            loadingScreen.style.display = "block";
            e.preventDefault();
            const email = loginForm['login-email'].value;
            const password = loginForm['login-password'].value;


            //Logging User(asynchronous)
            auth.signInWithEmailAndPassword(email, password).then(credential => {
                loadingScreen.style.display = "none";
                window.location.hash = "#"
                //Closing the login modal and resetting the form
                // console.log("logged in")
                loginForm.reset();
                window.location.hash = "#";

            }).catch((error) => {
                //if credentials are wrong / doesn't exist.
                // M.Modal.getInstance(modal).close();
                loadingScreen.style.display = "none";
                if (error.code === "auth/wrong-password") {
                    resetField(document.getElementById("login-password"))
                    M.toast({ html: '<font color="red">Please re-check Password</font>', classes: 'rounded white' });
                }
                else {
                    loginForm.reset();
                    M.toast({ html: '<font color="red">Please re-check Email</font>', classes: 'rounded white' });
                }
            });
        });
    }
}

//Invoke Signup Form on load
const invokeSignup = () => {
    const signupForm = document.querySelector("#signup-form");
    // Signup
    //console.log("inside invoke", signupForm);
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            //console.log("inside");
            loadingScreen.style.display = "block";
            //User info
            const email = signupForm['signup-email'].value;
            const password = signupForm['signup-password'].value;
            const confirmPassword = signupForm['signup-confirm-password'].value;
            if (!checkPassword(password)) {
                resetField(document.getElementById('signup-password'))
                resetField(document.getElementById('signup-confirm-password'))
                loadingScreen.style.display = "none";
                M.toast({ html: '<font color="red">Password length should atleast be 6</font>', classes: 'rounded white' });
                return;
            }
            //if passwords doesn't match
            if (password !== confirmPassword) {
                resetField(document.getElementById('signup-password'))
                resetField(document.getElementById('signup-confirm-password'))
                loadingScreen.style.display = "none";
                M.toast({ html: '<font color="red">Passwords does not match</font>', classes: 'rounded white' });
                return;
            }
            //if passwords match
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
                Credential.user.sendEmailVerification().then(() => {
                    signupForm.reset();
                    M.toast({ html: '<font color="green">Verification email sent!</font>', classes: 'rounded white' });
                    loadingScreen.style.display = "none";

                }).catch((error) => {
                    console.log(error);
                    loadingScreen.style.display = "none";
                });;
            }).catch(error => {
                console.log(error, "error")
                const signupForm = document.querySelector("#signup-form");
                loadingScreen.style.display = "none";
                console.log("error", error);
                const signError = document.querySelector(".signup-error");
                if (error.code == "auth/invalid-email") {
                    signupForm.reset();
                    invokeLoadImage("assets/user3.png", "SIGNUP")
                    M.toast({ html: '<font color="red">Invalid Email please re-check.</font>', classes: 'rounded white' });
                }
                else if (error.code == "auth/weak-password") {
                    resetField(document.getElementById('signup-password'))
                    resetField(document.getElementById('signup-confirm-password'))
                    M.toast({ html: '<font color="red">Password length should be atleast 6</font>', classes: 'rounded white' });

                }
                else if (error.code == "auth/email-already-in-use") {
                    signupForm.reset();
                    invokeLoadImage("assets/user3.png", "SIGNUP")
                    M.toast({ html: '<font color="red">Email already in use</font>', classes: 'rounded white' });
                }
                else {
                    signError.innerHTML = "";
                }
            })
        })
    }
}

//Invoke Account page on Load
const invokeAccount = () => {
    const accountDetails = document.querySelector(".account-details");
    const bio = document.querySelector(".bio");
    const imgPlace = document.querySelector(".uploadedImage");
    loadingScreen.style.display = "block";
    getUserState().then(user => {
        if (user) {

            db.collection('users').doc(user.uid).get().then(doc => {
                const bioDetails = `
                    <div> <h5><i>${doc.data().bio}</i> </h5> <br></br>
                    </div>
                `;
                if (bio)
                    bio.innerHTML = bioDetails;
            });

            storageRef = storage.ref(user.uid);
            storageRef.getDownloadURL().then((url) => {
                imgContent = `
                        <div class="center-align">
                            <img class="profilePhoto" src=${url} alt="user-image">
                        <div>
                    `;
                if (imgPlace)
                    imgPlace.innerHTML = imgContent;
                loadingScreen.style.display = "none";
            }).catch(error => {
                console.log(error);
                loadingScreen.style.display = "none";
            });
            // Details of logged user
            const userDetails = `
                    <div> <h6> <b>Email</b>: <i>${user.email}</i> </h6>
                        <h6> <b>Account-Verified</b>: <i>${user.emailVerified}</i></h6>
                    </div>
                `;
            if (accountDetails)
                accountDetails.innerHTML = userDetails;
        } else {
            if (accountDetails) accountDetails.innerHTML = '';
            if (imgPlace) imgPlace.innerHTML = '';
            if (bio) bio.innerHTML = '';
        }

    })
}

//Invoke Admin form after load
const invokeAdmin = () => {
    const adminForm = document.querySelector('.admin-actions');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const adminEmail = document.querySelector('#admin-email').value;
            const addAdminRole = functions.httpsCallable('addAdminRole');
            loadingScreen.style.display = "block";
            addAdminRole({ email: adminEmail }).then(result => {
                loadingScreen.style.display = "none";
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
                loadingScreen.style.display = "none";
                adminForm.reset()
                M.toast({ html: '<font color="red">Please Try Again!</font>', classes: 'rounded white' });
            })
        });
    }
}

//Load image in signup
const invokeLoadImage = (url, type) => {
    let output = document.querySelector('.image-preview');
    let outputEdit = document.querySelector('.image-preview-edit');
    if (type === "SIGNUP") {
        output.innerHTML = `
                        <img src=${url} alt="user-image">
                       `;
    } else {
        outputEdit.innerHTML = `
                            <img src=${url} alt="user-image">
                        `;

    }
}

const handleEditBioClick = () => {
    loadingScreen.style.display = "block";
    getUserState().then(usr => {
        db.collection('users').doc(usr.uid).get().then(doc => {
            document.getElementById("edit-bio").value = doc.data().bio;
            loadingScreen.style.display = "none";
        })
    });
}

const handleEditImgClick = () => {
    loadingScreen.style.display = "block";
    let editImg = document.querySelector(".image-edit");
    getUserState().then(user => {
        storageRef = storage.ref(user.uid);
        storageRef.getDownloadURL().then((url) => {
            imgContent = `
                        <img src=${url} alt="user-image">
                `;
            editImg.innerHTML = imgContent;
            loadingScreen.style.display = "none";
        }).catch(error => {
            console.log(error);
            imgContent = `
                        <img src="./assets/user2.png" alt="user-image">
            `;
            editImg.innerHTML = imgContent;
            loadingScreen.style.display = "none";
        });
    });
}
