const loggedOutComps = document.querySelectorAll(".logged-out");
const loggedInComps = document.querySelectorAll(".logged-in");
const adminComps = document.querySelectorAll(".admin");
let isUserLogged = false;
let user;
let root = document.getElementById('root');

// Function to render Navbar
async function NavUI(user){
    if (isUserLogged) {
        if (user.admin) {
            adminComps.forEach(item => item.style.display = "block");
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

//Initializing the Modals
document.addEventListener('DOMContentLoaded', function () {

    //Initializing the modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

});

//Function to render content
render = ()=>{
    let hash = window.location.hash
    if(hash === '#' || hash === ''){
        root.innerHTML = home;
        invokeHome();
    } else if(hash === '#login') {
        root.innerHTML = login;
        invokeLogin();
    } else if(hash === '#signup') {
        root.innerHTML = signup;
        invokeSignup();
    } else if(hash === '#account') {
        root.innerHTML = account;
        invokeAccount();
    } else if(hash === '#admin') {
        root.innerHTML = admin;
        invokeAdmin();
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
  
// On DOM Load
  window.addEventListener("DOMContentLoaded", function(ev) {
    //console.log("DOMContentLoaded event");
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
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

// On Reload
  window.onbeforeunload = ()=>{
    //   NavUI(user)
    document.getElementById("overlay").style.display = "block";
  }

