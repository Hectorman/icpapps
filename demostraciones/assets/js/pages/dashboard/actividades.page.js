parasails.registerPage('actividades', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    
    activeSidebar: false,

    metaChart: false,

    listaNotas: false

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount', 'has-rightbar', 'fixed-nav');
  
  },
  mounted: async function() {
    document.body.classList.add('mounted');

    console.log( this.demo );

    var vueObj = this;

    this.renderActividades();

    $(window).on('load', function(){

      vueObj.makeMetaChart();

    });

    var diligenciadas = 0,
          avance = 0;

    for ( var j = 0; j < this.demo.actividades.length; j++ ) {

      var actividad = this.demo.actividades[j];

      if ( !actividad.aplica || ( actividad.fechaInicial && actividad.fechaFinal ) || actividad.sistemaPrueba || actividad.notasAvance || actividad.riesgosyAlertas ) {

        diligenciadas++;

      }

    }

    avance = ( diligenciadas / this.nombresActividades.length ) * 100;
    
    if ( this.me.isSuperAdmin ) {

      //makeChart( '.ct-chart', this.demo.avanceRealTotal );

    } else {

      // $('.avance-label .count').html( avance );

      // makeChart( '.ct-chart', avance );

    }


  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    getActivityTotals: function( actividad ){

        var tTrans = this.getTrans( actividad.fechaInicial, actividad.fechaFinal ),
            tPlan = actividad.fechaFinal - actividad.fechaInicial;
            tTransPercent = ( tTrans / tPlan ) * 100,
            cumplimiento = tTrans ? ( actividad.avanceReal / tTransPercent ) * 100 : 0;

        return {
          tiempoTranscurridoTs: tTrans,
          tiempoPlanificadoTs: tPlan,
          porcentajeTranscurrido: Math.floor( tTransPercent ),
          cumplimiento: Math.floor( cumplimiento ),
          diasAsignados: tPlan / ( 1000 * 60 * 60 * 24 )
        }

    },

    showDetail: function(e) {

      var $this = $(e.target),
          $actividad = $this.parents('.actividad-item'),
          $defSidebar = $('.integrantes-sidebar'),
          $secSidebar = $('.actividad-detail'),
          orden = $actividad.find('.orden').text(),
          actividadObj = this.getActivityByOrden( orden ),
          pageThis = this;

      console.log( $defSidebar.offset().top );

      if ( $this.hasClass('active') ) {

        this.activeSidebar = false;

        $this.removeClass('active');

        $secSidebar.fadeOut(function(){

          $defSidebar.fadeIn();

        });

      } else {

        if ( !this.activeSidebar ) {

          $('html, body').animate({
            scrollTop: $defSidebar.offset().top - 20
          }, 600);
  
        } else {
  
          $('html, body').animate({
            scrollTop: $secSidebar.offset().top - 20
          }, 600);
  
        }
       
        $actividad.parent().siblings().find('.btt-wrapper.active').removeClass('active');      

        $this.addClass('active');

        $secSidebar.find('.nombre-actividad').text( actividadObj.nombre );

        $secSidebar.find('.observaciones').text( orden > 1 ? actividadObj.observaciones : actividadObj.sistemaPrueba );

        var $chart = $('#chart'),
            $avance = $('.actividad-detail .avance'),
            $bar = $secSidebar.find('.bar > div'),
            vueObj = this;
        
        if ( actividadObj.fechaFinal && actividadObj.fechaInicial ) {

          $chart.show();
          $avance.show();
        
          var activityTotals = this.getActivityTotals( actividadObj );

          $secSidebar.find('.avance-percent span').text( activityTotals.porcentajeTranscurrido );
          $secSidebar.find('.dias-asignados').text( activityTotals.diasAsignados );
          
          if ( !this.activeSidebar ) {

            $secSidebar.removeClass('green yellow orange red');

            $secSidebar.addClass( vueObj.getColorClass( activityTotals.cumplimiento ) );

            $defSidebar.fadeOut(function(){

              $secSidebar.fadeIn(function(){

                updateCharts()

              });

            });

          } else {

            updateCharts()

          }

        } else {

          if ( !this.activeSidebar ) {

            $defSidebar.fadeOut(function(){

              $secSidebar.fadeIn();

            });

          }

          vueObj.metaChart.updateSeries([0,0,0]);
          $bar.css('width', 0);

          $chart.hide();
          $avance.hide();

        }

        function updateCharts() {
 
          vueObj.metaChart.updateSeries([
            activityTotals.porcentajeTranscurrido, 
            actividadObj.avanceReal, 
            activityTotals.cumplimiento < 100 ? activityTotals.cumplimiento : 100
          ], true);

          $bar.css('width', activityTotals.porcentajeTranscurrido + '%');

        }

        this.activeSidebar = true;

      }


    },

    makeMetaChart: function() {

      var options = {
          chart: {
              height: 350,
              type: 'radialBar',
          },
          plotOptions: {
              radialBar: {
                  offsetY: -10,
                  startAngle: 0,
                  endAngle: 270,
                  hollow: {
                      margin: 10,
                      size: '35%',
                      background: 'transparent',
                      image: undefined,
                  },
                  track: {
                      show: true,
                      startAngle: undefined,
                      endAngle: undefined,
                      background: 'rgba(255,255,255,.06)',
                      strokeWidth: '100%',
                      opacity: 1,
                      margin: 10, 
                      dropShadow: {
                          enabled: false,
                          top: 0,
                          left: 0,
                          blur: 3,
                          opacity: 0.5
                      }
                  },
                  dataLabels: {
                      name: {
                          show: false,
                          
                      },
                      value: {
                          show: false,
                      }
                  }
              }
          },
          colors: ['#b2d910', '#b2d910', '#b2d910'],
          stroke: {
            lineCap: 'round',
            width: 5
          },
          series: [0,0,0],
          labels: ['Avance Actividad', 'Avance Real', 'Cumplimiento'],
          legend: {
              show: true,
              floating: true,
              fontSize: '13px',
              position: 'left',
              color: '#fff',
              fontFamily: 'Avenir Next LT Pro',
              offsetX: 0,
              offsetY: 10,
              labels: {
                  useSeriesColors: false,
                  colors: '#fff'
              },
              markers:false,
              itemMargin: {
                  horizontal: 1
              }
          },
          responsive: [{
              breakpoint: 480,
              options: {
                  legend: {
                      show: false
                  }
              }
          }]
      }

      this.metaChart = new ApexCharts(
          document.querySelector("#chart"),
          options
      );
      
      this.metaChart.render();

    },

    getTrans: function( fechaInicial, fechaFinal ) {

      var todayTs = Date.parse( new Date() ); 

      if ( todayTs < fechaInicial ) {

        return 0;

      } else

      if ( todayTs > fechaFinal ) {

        return fechaFinal - fechaInicial

      } else {

        return todayTs - fechaInicial;

      }

    },

    getColorClass: function( cumplimiento ) {

      if ( cumplimiento >= 100 ) {

        return 'green';

      } else if ( cumplimiento > 95 ) {

        return 'yellow';

      } else if ( cumplimiento > 90 ) {

        return 'orange';

      } else {

        return 'red';

      }

    },

    getActivityByOrden: function( orden ) {   

      for( var i = 0; i < this.demo.actividades.length; i++ ) {

        if ( orden * 1 == this.demo.actividades[i].orden ) {

          return this.demo.actividades[i];

        }

      }

      return;

    },

    navClick: function(e){

      var $button = $(e.target),
          $parent = $button.parent(),
          $after = $parent.children('.after'),
          parentOffset = $parent.offset().left,
          offset = $button.offset().left,
          index = $button.index();

      if ( $button.hasClass('active') ) return;

      $button.addClass('active').siblings('.active').removeClass('active');

      $after.css('left', ( offset - parentOffset ) + 'px');

      if ( index == 1 ) {

        $('.actividades-list').fadeOut(function(){

          $('.informacion-general').fadeIn();

        });

      } else {

        $('.informacion-general').fadeOut(function(){

          $('.actividades-list').fadeIn();

        });

      }

    },

    dateFromNumberToString( date ) {

      var fechaObj = new Date( date );
        
      return fechaObj.getFullYear() + '/' + ( fechaObj.getMonth() + 1 ) + '/' + fechaObj.getDate();
              

    },

    showExp: function( e ) {

      var $this = $(e.target),
          $parent = $this.parents('.actividad-item'),
          isOpen = $parent.hasClass('open');

      if ( !isOpen ) {

        $parent.addClass('open');

      }

      $('.exp-list').slideToggle(function(){

        if ( isOpen ) {

          $parent.removeClass('open');
  
        }

      });

    },

    prettyDate( timestamp ) {

      moment.locale('es');

      return moment( timestamp ).format('DD/MM/YYYY')

    },

    abrirNotas: function(e) {

      e.preventDefault();

      var $this = $(e.target),
          index = $this.parents('.exp-form').index(),
          expObj = this.experimentos[ index ];

      console.log( expObj );

      this.listaNotas = expObj.notas;

      $('#notas-popup h2').text( expObj.nombre );

      $.magnificPopup.open({
        items: {
          src: '#notas-popup',
          type: 'inline',
        },
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
          beforeOpen: function() {
              this.st.mainClass = 'mfp-zoom-out';
          }
        }
      });

    },

    renderActividades: function(){

      for( var i = 0; i < this.nombresActividades.length; i++ ) {

        var orden = this.nombresActividades[i].orden,
            $actividad = $('.actividades-list .actividad-item').eq( orden - 1 ),
            $cumplimiento = $actividad.find('.cumpli-box'),
            actividadObj = this.getActivityByOrden( orden );
  
        if ( orden == 1 ) $cumplimiento.css('opacity', 0);
  
        if ( actividadObj ) {
  
          if ( actividadObj.aplica ) {
  
            if ( actividadObj.fechaInicial && actividadObj.fechaFinal ) {
  
              var todayTs = Date.parse( new Date() ),
                  cumplimiento = this.getActivityTotals( actividadObj ).cumplimiento; 
  
              if ( todayTs > actividadObj.fechaInicial ) {
  
                $cumplimiento.html('Cumplimiento ' + cumplimiento + '%');
  
                $cumplimiento.addClass( this.getColorClass( cumplimiento ) );
  
              } else {
  
                if ( orden > 1 )  $cumplimiento.html('Sin iniciar');
  
              }
  
            } else {
  
              $cumplimiento.html('Sin fechas asignadas');
  
            }
  
            $actividad.addClass('has-detail');
  
          } else {
  
            $cumplimiento.html('No aplica');
  
          }
  
        }
  
      }

    }

  }
});
