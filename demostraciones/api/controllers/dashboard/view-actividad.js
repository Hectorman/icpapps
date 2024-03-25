module.exports = {


  friendlyName: 'View detalle actividad',


  description: 'Muestra y permite editar actividad asociada a una demostración',


  exits: {

    redirect: {
      description: 'No tienes permisos para ver esta página.',
      responseType: 'redirect'
    },

    success: {
      viewTemplatePath: 'pages/dashboard/actividad',
      description: 'Muestra la vista de información de la actividad'
    },

  },


  fn: async function ( exits ) {

    var demo = await Demo.findOne({
      id: this.req.param('demo')
    }).populate('integrantes').populate('actividades');

    if ( demo.lider !== this.req.session.userId ) {
      throw {redirect: '/nueva-demostracion'};
    }

    var nombresActividades = await NombreActividad.find();

    var totals = await sails.helpers.getDemoStats( demo );

    demo.avanceRealTotal = Math.floor( totals.avanceRealTotal );
    demo.colorClass = totals.colorClass;
    demo.totalActividadesValidas = totals.totalActividadesValidas;
    demo.avanceDiligenciadas = ( totals.totalActividadesDiligenciadas / nombresActividades.length ) * 100;
     
    sails.log.info( totals.totalActividadesDiligenciadas );

    return {
      demo: demo,
      initialOrdenActividad: this.req.param('actividad'),
      nombresActividades: nombresActividades
    };

  }


};
