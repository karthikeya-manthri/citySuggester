const home=`
          <div class = "main" style="margin-top: 200px;"></div><br>
          `;
const admin = `
          <div id="modal-admin" class="grey lighten-3" style="
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;
          text-align: center;width: 1000px;height: 90%;top:0;bottom: 0;left: 0;right: 0;margin: auto;
          ">
              <div class="center-align">
                <br /><br />
                <h4>Add an Admin</h4><br />
              </div>
            <form class="center-align admin-actions container" style="margin:40px auto;max-width: 500px;">
              <div class="input-field">
                <input type="email" id="admin-email" autocomplete="off" required />
              <label for="signup-email">Email address</label>
              </div><button class="btn blue-grey darken-4">Make Admin</button>
              <br>
              <div class="admin-loading">
              </div>
            </form>
          </div>
          `;
const signup = `
              <div id="modal-signup" class="grey lighten-3" style="
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;
              text-align: center;width: 1000px;height: auto;top:0;bottom: 0;left: 0;right: 0;margin: auto;
              ">
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
                  <div class="image-preview">
                    <img src="assets/user2.png">
                  </div>
                  <div class="file-field input-field">
                    <div class="btn">
                      <span>upload Image</span>
                      <input type="file" onchange="loadFile(event,1)" accept="image/x-png,image/gif,image/jpeg" id="signup-file">
                    </div>
                    <div class="file-path-wrapper">
                      <input class="file-path validate" type="text">
                    </div>
                    <!-- <div class="image-preview"></div> -->
                  </div>
                  <div class="center-align">
                    <button class="btn #263238 blue-grey darken-4 z-depth-0"  >Sign up</button>
                  </div>
                </form>
              </div>
              </div>
              `;
const login = `
              <div id="modal-login" class="grey lighten-3" style="
              box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;
              text-align: center;width: 1000px;height: 90%;top:0;bottom: 0;left: 0;right: 0;margin: auto;
              ">
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
                  <div style="text-align: right">
                    <a class="waves-effect waves-red btn-flat modal-trigger" data-target="modal-forgot">Forgot Password?</a>
                  </div>
                  <div class="login-loading">
                  </div>
                </form>
              </div>
              </div>

              `;
const account = `
                <div id="modal-account" class="grey lighten-3" style="
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);transition: 0.3s;
                text-align: center;width: 1000px;height: 90%;margin-top: -200px;bottom: 0;left: 0;right: 0;margin: auto;
                ">
                  <div class="center-align container">
                    <br /><br />
                  <h5><b> &nbsp &nbsp Profile Photo <img src="assets/edit2.png" class="modal-trigger" data-target="modal-edit-img" style="width:27px; height:27px; cursor:pointer;"> </b></h5>
                  <div class="uploadedImage">
                  </div>
                  <br />
                  <h5><b> About you  <img src="assets/edit2.png" class="modal-trigger" data-target="modal-edit-bio" style="width:27px; height:27px; cursor:pointer"> </b> </h5>
                  <div class="bio"></div>
                  
                  <div class="account-details"></div>
                  </div>
                </div>
                `;