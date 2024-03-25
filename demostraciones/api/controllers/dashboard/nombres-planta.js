module.exports = {

  friendlyName: 'Nombres planta',

  description: 'Devuelve la lista de nombres de la planta del icp',

  inputs: {


  },

  exits: {

    success: {
      description: 'La actividad existe',
    },

    noActividad: {
      description: 'Sin datos de la actividad'
    },

  },

  fn: async function (inputs, exits) {

    var planta = await planta.find(),
        result = [];

    for(var i = 0; i < planta.length; i++) {

      result.push({
        value: planta[i].fullName,
        data: planta[i].fullName
      })

    }

    return {
      "query": "Unit",
      "suggestions": result
    };

  }

};
