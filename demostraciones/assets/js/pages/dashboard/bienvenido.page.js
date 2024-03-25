parasails.registerPage('bienvenido', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');
  
  },
  mounted: async function() {
    document.body.classList.add('mounted');

    makeChart( '.avance-chart', this.avanceRealTotalPercent );
    makeChart( '.up-chart', this.avanceUp );
    makeChart( '.mid-chart', this.avanceMid );
    makeChart( '.down-chart', this.avanceDown );

    var todayTs = Date.parse( new Date() ),
        labels = [];

    for( var i = 1; i < 9; i++ ) {

      labels.push( 'hace ' + i + ( i > 1 ? ' días' : 'día' ) );

    }

    console.log( todayTs );

    this.makeTendencia();

    // new Chartist.Line('.line-chart', {
    //     labels: labels,
    //     series: [
    //       [6, 12, 14, 8, 4, 24, 11, 23]
    //     ]
    //   }, {
    //     low: 0,
    //     showArea: true
    // });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    makeTendencia: function() {

      console.log( this.actividades );

      var spotlight = {},
          labels = [],
          series = [];

      for (let index = 0; index < this.actividades.length; index++) {
        const comision = this.actividades[index];

        const fechaComision = comision.createdAt,
              mesComision = moment( fechaComision ).format('YYYY/MM');

        var greenLight = true;

        if ( greenLight ) {

          console.log( comision );

          if ( !spotlight[ mesComision ] ) {

            spotlight[ mesComision ] = 1;

          } else {

            spotlight[ mesComision ]++;

          }

        }
        
      }

      console.log( spotlight );

      for (const mes in spotlight) {
        if (Object.hasOwnProperty.call(spotlight, mes)) {
          const cantidad = spotlight[mes];

          labels.push( mes );
          series.push( cantidad );
          
        }
      }

      console.log( labels );
      console.log( series );

      new Chartist.Line('.line-chart', {
        labels: labels,
        series: [
          series
        ]
      }, {
        low: 0,
        showArea: true
      });

    },

  }
});
