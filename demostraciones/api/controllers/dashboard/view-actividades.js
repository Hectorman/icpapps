module.exports = {


  friendlyName: 'Ver actividades',


  description: 'Despliega la lista de actividades',


  exits: {

    redirect: {
      description: 'No tienes permisos para ver esta página.',
      responseType: 'redirect'
    },

    success: {
      viewTemplatePath: 'pages/dashboard/actividades',
      description: 'Muestra la lista de actividades'
    },

  },


  fn: async function ( exits ) {

    var demo = await Demo.findOne({
      id: this.req.param('demo')
    }).populate('integrantes').populate('actividades');

    var demoLider = await User.findOne({
      id: demo.lider
    })

    var nombresActividades = await NombreActividad.find();

    var totals = await sails.helpers.getDemoStats( demo );

    demo.avanceRealTotal = totals.avanceRealTotal
    demo.colorClass = totals.colorClass;

    var result = {
      demo: demo,
      demoLider: demoLider ? demoLider : false,
      nombresActividades: nombresActividades,
      experimentos: []
    }

    for( var i = 0; i < demo.actividades.length; i++ ) {

      var avancesActividad = await Avance.find({
        owner: demo.actividades[i].id
      });

      if ( avancesActividad.length ) demo.actividades[i].avances = avancesActividad;

      if ( demo.actividades[i].orden == 2 ) {

        var experimentos = await Experimento.find({
          owner: demo.actividades[i].id
        }).populate('notas');

        if ( experimentos.length ) result.experimentos = experimentos;

      }

    }
     
    return result;

  }


};
