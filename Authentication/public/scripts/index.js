// Content Divs
const loggedOutComps = document.querySelectorAll(".logged-out");
const loggedInComps = document.querySelectorAll(".logged-in");
const adminComps = document.querySelectorAll(".admin");
const accountDetails = document.querySelector(".account-details");
const bodyMain = document.querySelector(".main");
const verify = document.querySelector(".verifyEmail");
const bio = document.querySelector(".bio");
const imgPlace = document.querySelector(".uploadedImage");

var imgContent;

const NavUI = (user) => {
    if (user) {
        if (user.admin) {
            adminComps.forEach(item => item.style.display = "block");
        }
        db.collection('users').doc(user.uid).get().then(doc => {
            const bioDetails = `
                <div> <h5><i>${doc.data().bio}</i> </h5> <br></br>
                </div>
            `;
            bio.innerHTML = bioDetails;
        });

        storageRef = storage.ref(user.email);
        storageRef.getDownloadURL().then((url) => {
            imgContent = `
                    <div class="center-align">
                        <img src=${url} style="width:130px; height:100px">
                    <div>
                `;
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
                        <button class="btn #263238 blue-grey darken-4 z-depth-0">Verify Email</button>
                    </form>
                </center>
            
            `;
        accountDetails.innerHTML = userDetails;
        bodyMain.innerHTML = loggedInHTML;


        // If user logged
        if (user) {
            // Is the email verified?
            if (!user.emailVerified) {
                //console.log("Ver Ver",verfiyEmail)
                verify.innerHTML = verfiyEmail;
            }
        }


        //Toggling the nav bar components wrt login status
        loggedInComps.forEach(item => {
            item.style.display = 'block';
        });
        loggedOutComps.forEach(item => {
            item.style.display = 'none';
        });
    }
    else {

        //Logout content
        const loggedOutHTML = `
                <center>
                <h4>Welcome! Please Login/Signup</h4>
                </center>
            `;
        accountDetails.innerHTML = '';
        bodyMain.innerHTML = loggedOutHTML;
        verify.innerHTML = '';
        imgPlace.innerHTML = '';

        //toggling the nav bar components wrt login status
        loggedInComps.forEach(item => {
            item.style.display = 'none';
        });
        adminComps.forEach(item => item.style.display = "none");
        loggedOutComps.forEach(item => {
            item.style.display = 'block';
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {

    //Initializing the modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

});