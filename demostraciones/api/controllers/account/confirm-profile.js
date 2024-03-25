module.exports = {


  friendlyName: 'Confirm profile',


  description: 'Confirm the profile for the logged-in user.',


  inputs: {

    celular: {
      type: 'string'
    },

  },


  exits: {



  },


  fn: async function (inputs) {

    // Save to the db
    await User.updateOne({id: this.req.me.id })
    .set({
      celular: inputs.celular,
      profileConfirmed: true
    });

  }

};
