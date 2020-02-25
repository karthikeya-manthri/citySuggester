const home=`
          <div class = "main"></div><br>
          `;
const admin = `
          <div id="modal-admin" class="contentPage grey lighten-3 " >
              <div class="center-align">
                <br /><br />
                <h4>Add an Admin</h4><br />
              </div>
            <form class="adminStyle center-align admin-actions container" >
              <div class="input-field">
                <input type="email" id="admin-email" autocomplete="off" required />
              <label for="signup-email">Email address</label>
              </div><button class="btn blue-grey darken-4">Make Admin</button>
              <br>
            </form>
          </div>
          `;
const signup = `
              <div id="modal-signup" class="grey lighten-3 contentPage">
              <div class="container">
                <br />
                <h4>Sign up</h4>
                <form id="signup-form">
                  <div class="input-field">
                  <input type="email" id="signup-email" autocomplete="off" required />
                  <label for="signup-email">Email address</label>
                  </div>
                  <div class="input-field">
                  <input type="password" id="signup-password" autocomplete="off" required />
                  <label for="signup-password">Choose password</label>
                  </div>
                  <div class="input-field">
                  <input type="password" id="signup-confirm-password" autocomplete="off" required />
                  <label for="signup-confirm-password">Confirm password</label>
                  </div>
                  <div class="password-match"></div>
                  <div class="input-field">
                  <input type="text" id="signup-bio" autocomplete="off" required />
                  <label for="signup-bio">Write about yourself..</label>
                  </div>
                  <div class="center-align"><h6>Upload Image:</h6></div>
                  <div class="file-field input-field">
                    <div>
                        <div class="image-preview">
                          <img src="assets/user3.png" alt="user-image">
                        </div>
                        <input type="file" onchange="loadFile(event,1)" accept="image/x-png,image/gif,image/jpeg" id="signup-file">
                        <div class="file-path-wrapper">
                          <input class="hide file-path validate" type="text" >
                        </div>
                    </div>
                  </div>
                  <div class="center-align">
                  <button class="btn #263238 blue-grey darken-4 z-depth-0"  >Sign up</button>
                  </div>   
                </form>
              </div>
              </div>
              `;
const login = `
              <div id="modal-login" class="grey lighten-3 contentPage" >
                <br /><br />
                <h4>Login</h4><br />
                <div class="container center-align">
                <form id="login-form">
                  <div class="input-field">
                  <input type="email" id="login-email" autocomplete="off" required />
                  <label for="login-email">Email address</label>
                  </div>
                  <div class="input-field">
                  <input type="password" id="login-password" autocomplete="off" required />
                  <label for="login-password">Your password</label>
                  </div>
                  <button class="btn #263238 blue-grey darken-4 z-depth-0">Login</button>
                  <br><br>
                  <div class="rightStyle">
                    <a class="waves-effect waves-red btn-flat modal-trigger" data-target="modal-forgot">Forgot Password?</a>
                  </div>
                </form>
              </div>
              </div>

              `;
const account = `
                <div id="modal-account" class="grey lighten-3 contentPage">
                  <div class="center-align container">
                    <br /><br />
                  <h5><b> &nbsp &nbsp Profile Photo <img src="assets/edit2.png" alt="edit-icon" class="editIcon modal-trigger" data-target="modal-edit-img"> </b></h5>
                  
                  <div class="uploadedImage">
                  </div>
                  <br />
                  <h5><b> About you  <img src="assets/edit2.png" alt="edit-icon" class="editIcon modal-trigger" data-target="modal-edit-bio"> </b> </h5>
                  <div class="bio"></div>
                  <div class="account-details"></div>
                  </div>
                </div>
                `;