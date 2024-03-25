module.exports = {

  friendlyName: 'Crear experimento',

  description: 'Agrega un nuevo experimento a la actividad',

  inputs: {

    nombre: {
      type: 'string',
      required: true
    },

    fechaInicial: {
      type: 'string',
      required: true
    },

    fechaFinal: {
      type: 'string',
      required: true
    },

    idActividad: {
      type: 'number',
      required: true
    }

  },

  exits: {

    success: {
      description: 'Experimento agregado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    var newExperimento = await Experimento.create({
        nombre: inputs.nombre,
        fechaInicial:  Date.parse( inputs.fechaInicial.replace(new RegExp('/', 'g'), ',') ),
        fechaFinal: Date.parse( inputs.fechaFinal.replace(new RegExp('/', 'g'), ',') ),
        owner: inputs.idActividad
    }).fetch();

    return exits.success(newExperimento);

  }

};
