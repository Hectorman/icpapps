module.exports = {

  friendlyName: 'Crear nota',

  description: 'Agrega una avance a la actividad.',

  inputs: {

    avance: {
      type: 'string',
      required: true
    },

    idActividad: {
      type: 'number',
      required: true
    },

    idLider: {
        type: 'number',
        required: true
    }

  },

  exits: {

    success: {
      description: 'Avance agregado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    var newAvance = await Avance.create({
        avance: inputs.avance,
        owner: inputs.idActividad
    }).fetch();

    var liderDemostracion = await User.findOne({ id: inputs.idLider });

    await sails.helpers.sendSmptEmail.with({ 
        emailAddress: liderDemostracion.emailAddress,
        subject: 'Nuevo avance',
        message: 'Se ha registrado un nuevo avance en una de las demostraciones a su cargo.'
    });

    return exits.success( newAvance );

  }

};
