module.exports = {

  friendlyName: 'Borrar Integrante',

  description: 'Eliminar integrante de la base de datos',

  inputs: {

    id: {
       type: 'number',
       required: true
    }

  },

  exits: {

    success: {
      description: 'Integrante borrado exitósamente',
    },

    error: {
        description: 'El integrante no existe.',
        responseType: 'badRequest'
    }

  },

  fn: async function (inputs, exits) {

    var IntegranteEliminado = await Integrante.destroyOne({id: inputs.id});

    if ( IntegranteEliminado ) {

        return exits.success( 'borrado' );

    } else {

        return exits.error( 'El integrante no existe.' );

    }

  }

};
