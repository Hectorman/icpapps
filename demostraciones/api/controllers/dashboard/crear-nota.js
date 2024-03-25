module.exports = {

  friendlyName: 'Crear nota',

  description: 'Agrega una nueva nota al experimento.',

  inputs: {

    nota: {
      type: 'string',
      required: true
    },

    idExperimento: {
      type: 'number',
      required: true
    }

  },

  exits: {

    success: {
      description: 'Nota agregada exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    var newNota = await Nota.create({
        nota: inputs.nota,
        owner: inputs.idExperimento
    }).fetch();

    return exits.success( newNota );

  }

};
