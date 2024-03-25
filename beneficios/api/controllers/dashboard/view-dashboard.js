module.exports = {

  friendlyName: 'Dashboard',


  description: 'Metricas del director',


  exits: {

   success: {
      viewTemplatePath: 'pages/dashboard/dashboard',
   }

  },

  fn: async function ( exits ) {

      var beneficios = await Beneficio.find().sort('createdAt DESC');

      var series = [0,0,0];

      for (let index = 0; index < beneficios.length; index++) {
         const element = beneficios[index];

         if ( element.tipologia == 'Investigación científica' ) series[0]++;

         if ( element.tipologia == 'Desarrollo tecnológico' ) series[1]++;

         if ( element.tipologia == 'Innovación tecnológica' ) series[2]++;
         
      }

      return {
         beneficio: false,
         beneficios: beneficios,
         series: series
      };
  }

};
