module.exports = {


  friendlyName: 'Nivel de Madurez',


  description: 'Actualizar el nivel de madurez de la demostración',


  inputs: {

    id: {
       type: 'number',
       required: true
    },

    nivel: {
      type: 'number',
      required: true
    }

  },

  exits: {



  },

  fn: async function (inputs) {

    await Demo.updateOne({id: inputs.id })
    .set({
       modeloMadurez: inputs.nivel
    });

  }

};
