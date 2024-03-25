parasails.registerPage('dashboard', {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {

   listaGerencias: [
      { valor: 'GEI' },
      { valor: 'GDL' },
      { valor: 'GST' },
      { valor: 'GLI' },
      { valor: 'DCI' },
      { valor: 'ICP' }
   ],

   listaAnios: [],

   listaAliados: [],

   totals: {}

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝

  beforeMount: function() {

    // Attach any initial data from the server.

    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');

    for (let index = 0; index < this.convenios.length; index++) {
      const element = this.convenios[index];

      if ( element.campos && element.campos['Fecha de Inicio'] ) {

         var fecha = moment( element.campos['Fecha de Inicio'], 'DD/MM/YYYY' );

         console.log( fecha );

         if ( fecha.isValid() && this.listaAnios.indexOf( fecha.format('YYYY') ) == -1 ) this.listaAnios.push( fecha.format('YYYY') )

      }

      if ( element.campos && element.campos['ALIADOS'] ) {

         if ( this.listaAliados.indexOf( element.campos['ALIADOS'] ) == -1 ) this.listaAliados.push( element.campos['ALIADOS'] )

      }

    }

  },

   mounted: async function() {

   document.body.classList.add('mounted');
   console.log( this );

   this.streamChart = makeChart( '.stream-chart' );

   this.recursoChart = this.makeRChart( '.recurso-chart' );

   this.filterConvenios();
   
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

   methods: {

      openList: function(e) {

         var $target = $(e.target),
            $parent = $target.parents('.list-wrapper').length ? $target.parents('.list-wrapper') : $target;

         $('body').removeClass('toggleSidebar');

         $parent.toggleClass('open');

      },

      toggleSidebar: function(e) {

         $('.list-wrapper').removeClass('open');

         $('body').toggleClass('toggleSidebar');

      },

      showList: function() {

         var selectedGerencia = $('.filterByGerencia').val(),
             selectedYear = $('.filterByYear').val(),
             selectedEstado = $('.filterByEstado').val(),
             selectedAliado = $('.filterByAliado').val();

         window.location = '/mis-convenios/' + selectedGerencia + '/' + selectedYear + '/' + selectedEstado + '/' + selectedAliado;

      },

      filterConvenios: function(e) {

         var filteredItems = [],
             selectedGerencia = $('.filterByGerencia').val(),
             selectedYear = $('.filterByYear').val(),
             selectedEstado = $('.filterByEstado').val(),
             selectedAliado = $('.filterByAliado').val();

         for (let index = 0; index < this.convenios.length; index++) {
            const element = this.convenios[index];

            var compuertas = 0;

            // gerencia

            if ( element.gerencia == selectedGerencia ) compuertas++;

            // año

            if ( element.campos && element.campos['Fecha de Inicio'] ) {

               var anioEl = moment( element.campos['Fecha de Inicio'], 'DD/MM/YYYY' ).format('YYYY');

               if ( anioEl == selectedYear ) compuertas++;

            }

            // vigencia 

            if ( element.campos && element.campos['Fecha de Finalización'] ) {

               var elmom = moment( element.campos['Fecha de Finalización'], 'DD/MM/YYYY' );

               if ( selectedEstado == 'vigente' && elmom.isAfter( moment() ) ) {

                  compuertas++;

               } else if ( selectedEstado == 'cerrado' && elmom.isBefore( moment() ) ) {

                  compuertas++;

               }

            }

            // aliado

            if ( element.campos && element.campos['ALIADOS'] ) {

               if ( element.campos['ALIADOS'] == selectedAliado ) compuertas++;

            }

            if ( compuertas == 4 ) filteredItems.push( element );

         }

         this.updateTotals( filteredItems );

      },

      updateTotals: function( convenios ) {

         console.log( convenios );

         var vueObj = this;

         this.totals.numConvenios = convenios.length || 0;

         this.totals.UP = 0;
         this.totals.MID = 0;
         this.totals.DOWN = 0;

         this.totals.recurso = {};

         this.totals.productosTecnologicos = 0;

         this.totals.inversionTotal = 0;

         for (let index = 0; index < convenios.length; index++) {
            const element = convenios[index];

            if ( element.propiedad ) {

               // streams

               var elStream = element.propiedad['Segmento de Propiedad Intelectual'];

               if ( elStream ) this.totals[ elStream ]++;

               // recurso humano

               addUpRecurso( element );

               // productos tecnológicos

               var elProductos = element.propiedad['Productos Tecnológicos'];

               if ( elProductos && elProductos.length ) {

                  for (let index = 0; index < elProductos.length; index++) {
                     const producto = elProductos[index];

                     if ( producto !== '' ) this.totals.productosTecnologicos++;
                     
                  }

               }

            }

            // Inversión total

            addUpInversion( element );

         }

         function addUpRecurso( element ) {

            var campos = ['Doctor', 'Maestria', 'Especialista', 'Profesional', 'Tecnólogo'];

            for (let index = 0; index < campos.length; index++) {
               const titulo = campos[index];

               if ( !vueObj.totals.recurso[ titulo ] ) vueObj.totals.recurso[ titulo ] = 0;

               if ( element.propiedad[ titulo ] ) {

                  for (let i = 0; i < element.propiedad[ titulo ].length; i++) {
                     const humano = element.propiedad[ titulo ][i];

                     if ( humano !== '' ) vueObj.totals.recurso[ titulo ]++;
                     
                  }
   
               }
               
            }

         }

         function addUpInversion( element ) {

            var campos = [
               'Total Aportes ECP Especie',
               'Total Aportes ECP Dinero',
               'TOTAL APORTES ECOPETROL',
               'Total Aportes Aliado Especie',
               'Total Aportes Aliado Dinero',
               'Total Aportes Aliados',
               'Valor de Adicionales Convenio',
               'Valor Desembolsado Ecopetrol'
            ];

            for (let index = 0; index < campos.length; index++) {
               const campo = campos[index];

               if ( element.campos[ campo ] ) {

                  console.log( campo, element.campos[ campo ] )

                  if ( element.campos[ campo ] !== '' ) {

                     vueObj.totals.inversionTotal +=  ( element.campos[ campo ] * 1);

                  }

               }
               
            }

         }

         this.updateStreamChart();

         this.updateRecursoChart();

         console.log( this.totals );

         this.$forceUpdate();

      },

      updateStreamChart: function() {

         var vueObj = this;

         var $parent = $('.stream-chart');

         function getPercent( val ) {

            return ( ( ( ( val / vueObj.totals.numConvenios ) * 100 ) / 100 ) * 70 ) || 0;

         }

         this.streamChart.update({
            series: [
               getPercent( this.totals['UP'] ),
               getPercent( this.totals['MID'] ),
               getPercent( this.totals['DOWN'] )
            ]
         });

         var $counter = $parent.parents('.graph-wrapper').find('.count');

         if ( !vueObj.totals.numConvenios ) {
            
            $parent.parents('.graph-wrapper').addClass('cero');

         } else {

            $parent.parents('.graph-wrapper').removeClass('cero');

         }

         $counter.prop('Counter',0).animate({
            Counter: vueObj.totals.numConvenios
         }, {
               duration: 2000,
               easing: 'swing',
               step: function (now) {
                  $counter.text(Math.ceil(now));
               }
         });

      },

      makeRChart: function( selector ) {

         var chart = new Chartist.Bar( selector, {
            labels: ['Doctorado', 'Maestría', 'Especialista', 'Profesional', 'Tecnólogo'],
            series: [
              [0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0]
            ]
          }, {
            stackBars: true,
            axisY: {
              labelInterpolationFnc: function(value) {
                return value;
              }
            }
          });

          chart.on('draw', function(data) {
            if(data.type == 'bar') {
                data.element.animate({
                    y2: {
                        dur: '.5s',
                        from: data.y1,
                        to: data.y2
                    }
                });
            }
        });

          return chart;

      },

      updateRecursoChart: function(){

         var vueObj = this;

         var labels = [],
             series = [];

         for (const key in vueObj.totals.recurso) {
            if (vueObj.totals.recurso.hasOwnProperty(key)) {
               const element = vueObj.totals.recurso[key];

               labels.push( key )
               series.push( element )
               
            }
         }

         var maxNumer = getMaxOfArray( series );

         maxNumer += Math.floor( maxNumer * (0.4) );

         if ( !series.length ) series = [0,0,0,0,0]

         this.recursoChart.update({
            labels: labels,
            series: [
               series,
               series.map(function( val ){ return maxNumer - val })
            ]
         });

         function getMaxOfArray(numArray) {
            return Math.max.apply(null, numArray);
         }

      },

      moneyFormat: function( val ) {

         var formatter = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
         });

         return formatter.format( val );

      }

   }

});

