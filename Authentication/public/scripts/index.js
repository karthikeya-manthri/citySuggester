// Content Divs
const loggedOutComps = document.querySelectorAll(".logged-out");
const loggedInComps = document.querySelectorAll(".logged-in");
const adminComps = document.querySelectorAll(".admin");
const accountDetails = document.querySelector(".account-details");
const bodyMain = document.querySelector(".main");
const verify = document.querySelector(".verifyEmail");
const bio = document.querySelector(".bio");
const imgPlace = document.querySelector(".uploadedImage");
const rootDiv = document.getElementById('root');
const adminDiv = document.getElementById('modal-admin');
const loginDiv = document.getElementById('modal-login');
const signupDiv = document.getElementById('modal-signup');
const accountDiv = document.getElementById('modal-account');
const bioDiv = document.getElementById('modal-bio');
var imgContent;

// Function to render Navbar
async function NavUI(user){
    //console.log("inside NavUI render")
    if (isUserLogged) {
        if (user.admin) {
            adminComps.forEach(item => item.style.display = "block");
        }
        db.collection('users').doc(user.uid).get().then(doc => {
            const bioDetails = `
                <div> <h5><i>${doc.data().bio}</i> <img src="assets/edit2.png" style="width:35px; height:35px; cursor:pointer;" onclick="handleEdit(${user.uid},1)"> </h5> <br></br>
                </div>
            `;
            if(bio)
            bio.innerHTML = bioDetails;
        });

        storageRef = storage.ref(user.email);
        storageRef.getDownloadURL().then((url) => {
            imgContent = `
                    <div class="center-align">
                        <img src=${url} style="width:130px; height:100px"> <img src="assets/edit2.png" style="width:35px; height:35px; cursor:pointer" onclick="handleEdit(${user.email},2)">
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
        if(accountDetails)
        accountDetails.innerHTML = userDetails;
        if(bodyMain)
        bodyMain.innerHTML = loggedInHTML;


        // If user logged
        if (user) {
            // Is the email verified?
            if (!user.emailVerified) {
                //console.log("Ver Ver",verfiyEmail)
                if(verify)
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

        return true
    }
    else {

        //Logout content
        //console.log("inside logout")
        const loggedOutHTML = `
                <center>
                <h4>Welcome! Please Login/Signup</h4>
                </center>
            `;
        if(accountDetails)
        accountDetails.innerHTML = '';
        if(bodyMain){
            //console.log("yes")
        bodyMain.innerHTML = loggedOutHTML;
        //console.log(bodyMain.innerHTML)
        }
        if(verify)
        verify.innerHTML = '';
        if(imgPlace)
        imgPlace.innerHTML = '';

        //toggling the nav bar components wrt login status
        loggedInComps.forEach(item => {
            item.style.display = 'none';
        });
        adminComps.forEach(item => item.style.display = "none");
        loggedOutComps.forEach(item => {
            item.style.display = 'block';
        });
        return true;
    }
}

document.addEventListener('DOMContentLoaded', function () {

    //Initializing the modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

});

//Function to render content
render = ()=>{
    let hash = window.location.hash
    //console.log(hash.length)
    //console.log(home)
    if(hash.length == 0 || hash.length == 1){
        bodyMain.classList.remove("visuallyhidden")
        verify.classList.remove("visuallyhidden")
        loginDiv.classList.add("visuallyhidden")
        signupDiv.classList.add("visuallyhidden")
        adminDiv.classList.add("visuallyhidden")
        accountDiv.classList.add("visuallyhidden")
        
    }
    else if(hash === "#login"){
        bodyMain.classList.add("visuallyhidden")
        verify.classList.add("visuallyhidden")
        loginDiv.classList.remove("visuallyhidden")
        signupDiv.classList.add("visuallyhidden")
        adminDiv.classList.add("visuallyhidden")
        accountDiv.classList.add("visuallyhidden")
       
    }
    else if(hash === "#signup"){
        bodyMain.classList.add("visuallyhidden")
        verify.classList.add("visuallyhidden")
        loginDiv.classList.add("visuallyhidden")
        signupDiv.classList.remove("visuallyhidden")
        adminDiv.classList.add("visuallyhidden")
        accountDiv.classList.add("visuallyhidden")
        
    }
    else if(hash === "#about") {
        bodyMain.classList.add("visuallyhidden")
        verify.classList.add("visuallyhidden")
        loginDiv.classList.add("visuallyhidden")
        signupDiv.classList.add("visuallyhidden")
        adminDiv.classList.add("visuallyhidden")
        accountDiv.classList.add("visuallyhidden")
        
    }
    else if(hash === "#admin") {
        bodyMain.classList.add("visuallyhidden")
        verify.classList.add("visuallyhidden")
        loginDiv.classList.add("visuallyhidden")
        signupDiv.classList.add("visuallyhidden")
        adminDiv.classList.remove("visuallyhidden")
        accountDiv.classList.add("visuallyhidden")
    }    
    else if(hash === "#account") {
        bodyMain.classList.add("visuallyhidden")
        verify.classList.add("visuallyhidden")
        loginDiv.classList.add("visuallyhidden")
        signupDiv.classList.add("visuallyhidden")
        adminDiv.classList.add("visuallyhidden")
        accountDiv.classList.remove("visuallyhidden")    
    }

    return true
  }
  

let publicHash = ['#login','#signup']
let privateHash = ['#about','#admin','#account']

// Detecting the hash changes and routing appropriately
window.addEventListener("hashchange",()=>{
    if(isUserLogged){
        //console.log("in if")
        if(publicHash.includes(window.location.hash)){
            window.location.hash = "#"
            render()
        }
        NavUI(user).then(()=>{
            render()
        })}
    else{
        //console.log("in else")
        if(privateHash.includes(window.location.hash)){
            window.location.hash = "#"
            render()
        }
        NavUI(false).then(()=>{
            render()
        })}
  })
  
  window.addEventListener("DOMContentLoaded", function(ev) {
    //console.log("DOMContentLoaded event");
    if(isUserLogged){
    NavUI(user).then(()=>{
      render()
    })}
    else{
    NavUI(false).then(()=>{
        render()
      })
    } 
    })
