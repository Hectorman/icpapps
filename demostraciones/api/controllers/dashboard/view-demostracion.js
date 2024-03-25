module.exports = {


  friendlyName: 'View detalle demostracion',


  description: 'Detalle informacion general',


  exits: {

    redirect: {
      description: 'No tienes permisos para ver esta página.',
      responseType: 'redirect'
    },

    success: {
      viewTemplatePath: 'pages/dashboard/demostracion',
      description: 'Muestra la vista de infomración de la demostración'
    },

  },


  fn: async function ( exits ) {

    var demo = await Demo.findOne({
      id: this.req.param('id')
    }).populate('integrantes').populate('actividades');

    if ( demo.lider !== this.req.session.userId ) {
      throw {redirect: '/nueva-demostracion'};
    }

    var nombresPlanta = await Planta.find(),
        nombresActividades = await NombreActividad.find(),
        suggestions = [],
        dataLookup = {};

    for(var i = 0; i < nombresPlanta.length; i++) {

      suggestions.push({
        value: nombresPlanta[i].fullName.toLowerCase(),
        data: nombresPlanta[i].fullName.toLowerCase()
      })

    }

    dataLookup.suggestions = suggestions;

    var totals = await sails.helpers.getDemoStats( demo );

    demo.avanceRealTotal = totals.avanceRealTotal;
    demo.colorClass = totals.colorClass;
    demo.avanceDiligenciadas = ( totals.totalActividadesDiligenciadas / nombresActividades.length ) * 100;
    
    return {
      demo: demo,
      dataLookup: dataLookup
    };

  }


};
