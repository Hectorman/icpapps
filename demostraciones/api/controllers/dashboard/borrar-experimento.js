module.exports = {

  friendlyName: 'Borrar Experimento',

  description: 'Borra el experimento',

  inputs: {

    id: {
      type: 'number'
    }

  },

  exits: {

    success: {
      description: 'Experimento borrado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    sails.log( inputs.id );

    var deletedExperimento = await Experimento.destroy({ id: inputs.id }).fetch();

    return exits.success(deletedExperimento);

  }

};

