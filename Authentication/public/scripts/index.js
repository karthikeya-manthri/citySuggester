const loggedOutComps = document.querySelectorAll(".logged-out");
const loggedInComps = document.querySelectorAll(".logged-in");
const adminComps = document.querySelectorAll(".admin");
let isUserLogged = false;
let user;
let root = document.getElementById('root');

// Function to render Navbar
const NavUI = (user) => {
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
    }
}

//Function to render content
const render = () => {
    let hash = window.location.hash
    switch (hash) {
        case '#':
            root.innerHTML = home;
            invokeHome();
            break;
        case '#login':
            root.innerHTML = login;
            invokeLogin();
            break;
        case '#signup':
            root.innerHTML = signup;
            invokeSignup();
            break;
        case '#account':
            root.innerHTML = account;
            invokeAccount();
            break;
        case '#admin':
            root.innerHTML = admin;
            invokeAdmin();
            break;
        default:
            root.innerHTML = home;
            invokeHome();
    }
    return true
}


let publicHash = ['#login', '#signup']
let privateHash = ['#about', '#admin', '#account']

// Detecting the hash changes and routing appropriately
window.addEventListener("hashchange", () => {
    if (isUserLogged) {
        //console.log("in if")
        if (publicHash.includes(window.location.hash)) {
            window.location.hash = "#"
            render()
        }
        render()
        NavUI(user)
    }
    else {
        //console.log("in else")
        if (privateHash.includes(window.location.hash)) {
            window.location.hash = "#"
            render()
        }
        render()
        NavUI(false)
    }
})

// On DOM Load
window.addEventListener("DOMContentLoaded", function (ev) {
    //console.log("DOMContentLoaded event");
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
    if (isUserLogged) {
        render()
        NavUI(user)
    }
    else {
        render()
        NavUI(false)
    }
})
