module.exports = {

  friendlyName: 'Ver detalle beneficio',


  description: 'Muestra la página de creación de beneficios',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/beneficio',
    },

    redirect: {
      description: 'No tienes comisiones.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

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

      // Get the user ID  out of the session.
      var userId = this.req.session.userId;

      var user = await User.findOne({
         id: userId
       }).populate('registro');

      var params = {}; 

      if ( !user.isSuperAdmin ) params.asignadoA = user.registro[0].id;

      var beneficios = await Beneficio.find().where( params ).sort('createdAt DESC');

      var nombreFuncionario = false;

      var beneficio = false;

      if ( this.req.param('id') ) {
   
         beneficio = await Beneficio.findOne( { id: this.req.param('id') } );
      
      } else if ( beneficios.length ) {

         throw {redirect: '/beneficio/' + beneficios[0].id };

      }

      if ( beneficio && beneficio.asignadoA ) {

         var funcionario = await Planta.findOne({
            id: beneficio.asignadoA
         });  

         nombreFuncionario = funcionario.fullName;

      }

      return {
        beneficio: beneficio,
        beneficios: beneficios,
        dataLookup: dataLookup,
        nombreFuncionario: nombreFuncionario
      };

  }


};
