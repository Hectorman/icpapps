module.exports = {

  friendlyName: 'Editar beneficio',


  description: 'Muestra la página de edición de beneficios',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/editar-beneficio',
    },

    redirect: {
      description: 'No tienes comisiones.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

      beneficio = await Beneficio.findOne( { id: this.req.param('id') } );

      var nombresPlanta = await Planta.find(),
          suggestions = [],
          dataLookup = {};

      for(var i = 0; i < nombresPlanta.length; i++) {

          suggestions.push({
              value: nombresPlanta[i].fullName.toLowerCase(),
              data: nombresPlanta[i].id
          })

      }

      dataLookup.suggestions = suggestions;
      
      return {
        beneficio: beneficio,
        dataLookup: dataLookup
      };

  }


};
