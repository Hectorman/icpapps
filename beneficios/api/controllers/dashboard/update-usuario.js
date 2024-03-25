module.exports = {

  friendlyName: 'Update Usuario',

  description: 'Actualiza la info del usuario.',

  inputs: {

   id: {
      type: 'number',
      required: true
   },
   gerencia: {
      type: 'string'

   },
   isGerente: {
      type: 'boolean'
   },
   isDirector: {
      type: 'boolean'
   }

  },


  exits: {



  },

  fn: async function (inputs) {

    var userPlanta = await Planta.findOne({ id: inputs.id }).populate('owner');

    var isSuperAdmin = inputs.isGerente || inputs.isDirector ? true : false;

    // Save to the db
    var usuario = await Planta.updateOne({id: inputs.id })
    .set({
      gerencia: inputs.gerencia,
      isGerente: inputs.isGerente,
      isDirector: inputs.isDirector,
      isSuperAdmin: isSuperAdmin
    });

    if ( userPlanta.owner ) {

      await User.updateOne({id: userPlanta.owner.id })
      .set({
        isGerente: inputs.isGerente,
        isDirector: inputs.isDirector,
        isSuperAdmin: isSuperAdmin
      });

    }

    return userPlanta;

  }

};

