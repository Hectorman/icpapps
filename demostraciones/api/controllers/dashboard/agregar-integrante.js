module.exports = {

  friendlyName: 'Crear o actualizar integrante',

  description: 'Agrega un nuevo integrante a la demostración',

  inputs: {

    nombre: {
      type: 'string',
      required: true
    },

    idDemo: {
      type: 'number',
      required: true
    },

    idIntegrante: {
       type: 'number'
    }

  },

  exits: {

    success: {
      description: 'Integrante agregado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    if ( inputs.idIntegrante ) {

        var existent = await Integrante.updateOne({id: inputs.idIntegrante })
        .set({
            nombre: inputs.nombre
        });

        sails.log.info( existent );

        return exits.success( existent );
     
    } else {

        var newIntegrante = await Integrante.create({
            nombre: inputs.nombre,
            lider: inputs.idDemo
        }).fetch();

        return exits.success(newIntegrante);

    }

  }

};
