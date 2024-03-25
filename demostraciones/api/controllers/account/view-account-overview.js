module.exports = {

  friendlyName: 'View account overview',


  description: 'Display "Account Overview" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/account/account-overview',
    }

  },


  fn: async function () {

     // Get the user ID  out of the session.
     var userId = this.req.session.userId;

     var userRegistro = await User.findOne({
        id: userId
     }).populate('registro');

    // If billing features are enabled, include our configured Stripe.js
    // public key in the view locals.  Otherwise, leave it as undefined.
    return {
      populatedUser: userRegistro
    };

  }


};
