module.exports = {

  friendlyName: 'Update Usuario',

  description: 'Actualiza la info del usuario.',

  inputs: {

    id: {

      type: 'number',
      required: true

    }

  },

  exits: {



  },

  fn: async function (inputs) {

    var userPlanta = await Planta.findOne({ id: inputs.id }).populate('owner');

    if ( userPlanta.owner ) {

      await User.updateOne({id: userPlanta.owner.id })
      .set({
        password: 'cambio pendiente'
      });

    }

    return userPlanta;

  }



};

