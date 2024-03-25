module.exports = {

  friendlyName: 'Actualiza un convenio',

  description: 'Crea un nuevo convenio',

  inputs: {

   id: {
      type: 'string'
   },

   propiedad: {
      type: 'json'
   }

  },
  exits: {

    success: {
      description: 'Convenio actualizado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

      var convenio = await Convenio.updateOne({id: inputs.id })
      .set({
         propiedad: inputs.propiedad,
      });

     return exits.success( convenio );

  }

};

