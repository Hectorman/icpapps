module.exports = {


  friendlyName: 'Modelo de desarrollo',


  description: 'Actualizar modelo de desarrollo de demostración',


  inputs: {

    id: {
       type: 'number',
       required: true
    },

    modelo: {
      type: 'string',
      required: true
    },

    nombreAliado: {
       type: 'string'
    }

  },


  exits: {



  },


  fn: async function (inputs) {

    await Demo.updateOne({id: inputs.id })
    .set({
       modeloDesarrollo: inputs.modelo,
       nombreAliado: inputs.nombreAliado
    });

  }

};
