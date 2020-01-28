const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data,context)=>{
    if(context.auth.token.admin !== true){
        adminForm.reset();
        M.toast({html: '<font color="red">Please re-check Email</font>', classes: 'rounded white'});
        return {error:'only admins can add other admins !'}
    }

    //Get the user and add custom claims to them (admin)
    return admin.auth().getUserByEmail(data.email).then((user)=>{
        return admin.auth().setCustomUserClaims(user.uid, {
            admin:true
        });
    }).then(()=>{
        return {
            message: `Success! ${data.email} has been made an admin`
        }
    }).catch(err=>{
            // console.log(err);
            return err;
    });
});

