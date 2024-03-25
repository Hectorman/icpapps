module.exports = {

  friendlyName: 'Gracias',


  description: 'Mensaje que se muestra al terminar de subir la comisión',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/gracias',
    },

    redirect: {
      description: 'No tienes comisiones.',
      responseType: 'redirect'
    },

  },


  fn: async function ( exits ) {

   var user = await User.findOne({
      id: this.req.session.userId
   });

   var params = {}

   if ( !user.isSuperAdmin ) params.owner = this.req.session.userId;

   var convenios = await Convenio.find().where( params ).sort('createdAt DESC'),
       filteredItems = [];

   var getParams = {
      gerencia: this.req.param('gerencia'),
      inicio: this.req.param('inicio'),
      vigencia: this.req.param('vigencia'),
      aliado: this.req.param('aliado')
   }

   var moment = require('moment');

   if ( getParams.gerencia && getParams.inicio && getParams.vigencia && getParams.aliado ) {

      for (let index = 0; index < convenios.length; index++) {
         const element = convenios[index];

         var compuertas = 0;

         // gerencia

         if ( element.gerencia == getParams.gerencia ) compuertas++;

         // año

         if ( element.campos && element.campos['Fecha de Inicio'] ) {

            var anioEl = moment( element.campos['Fecha de Inicio'], 'DD/MM/YYYY' ).format('YYYY');

            if ( anioEl == getParams.inicio ) compuertas++;

         }

         // vigencia 

         if ( element.campos && element.campos['Fecha de Finalización'] ) {

            var elmom = moment( element.campos['Fecha de Finalización'], 'DD/MM/YYYY' );

            if ( getParams.vigencia == 'vigente' && elmom.isAfter( moment() ) ) {

               compuertas++;

            } else if ( getParams.vigencia == 'cerrado' && elmom.isBefore( moment() ) ) {

               compuertas++;

            }

         }

         // aliado

         if ( element.campos && element.campos['ALIADOS'] ) {

            if ( element.campos['ALIADOS'] == getParams.aliado ) compuertas++;

         }

         if ( compuertas == 4 ) filteredItems.push( element );

      }

   }

    if ( !convenios.length && !user.isSuperAdmin ) {

      throw {redirect: '/nuevo-convenio'};

    }

     return {
       convenios: filteredItems.length ? filteredItems : convenios
     };

  }


};
