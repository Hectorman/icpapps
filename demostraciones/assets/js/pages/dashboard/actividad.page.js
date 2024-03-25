parasails.registerPage('actividad', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

    owlNav: '',

    owlInit: false,

    ordenActividad: 1,

    currentActivity: false,

    transcurrido: 0,

    avanceActualInicial: 0,

    chartInstance: false,

    listaNotas: [],

    cuentaActividades: []
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach raw data exposed by the server.
    _.extend(this, SAILS_LOCALS);
    

    this.formData.aplica = true;
    //this.ordenActividad = this.initialOrdenActividad;

    for (let index = 1; index < 26; index++) {
      
      this.cuentaActividades.push( index );
      
    }

  },
  mounted: async function() {
    document.body.classList.add('mounted');

    console.log(this);

    var self = this;

    this.owlNav = $('.owl-carousel').owlCarousel({
        margin:0,
        nav: false,
        dots: false,
        mouseDrag: false,
        singleItem: true,
        responsive:{
            0:{ 
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        },
        onInitialized: function(){

          self.owlInit = true;

        }
    });

    $('.datepicker-input').datepicker({
      language: 'es',
      autoClose: true,
      dateFormat: 'yyyy/m/d',
      onSelect: function(formattedDate, date, inst) {

        self.formData[ inst.$el[0].dataset.name ] = formattedDate;

        self.updateDates();

      }
    });

    $('.datepicker-exp').datepicker({
      language: 'es',
      autoClose: true,
      dateFormat: 'yyyy/m/d'
    });

    this.setCurrentActivity( this.initialOrdenActividad );

    console.log( this.demo.avanceDiligenciadas );

    this.chartInstance = makeChart( '.ct-chart', this.demo.avanceDiligenciadas );

  },

  virtualPagesRegExp: /^\/actividad\/?([^\/]+)?\/?/,
  afterNavigate: async function(virtualPageSlug){

    console.log( virtualPageSlug );

    if ( this.owlInit ) this.setCurrentActivity( virtualPageSlug, 300 );

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    activityClick: function(e) {

      if ( this.syncing ) return;

      var $this = $(e.target);

      if ( !$this.hasClass('nombre-act') ) $this = $this.parents('.nombre-act');

      var orden = $this.find('span').text();

      console.log( orden );

      this.gotoActivity( orden );

    },

    saltarActividad: function(e) {

      this.gotoActivity( $(e.target).val() );

    },

    crearExperimento: async function(e) {

      if ( this.syncing ) return;

      this.syncing = true;

      e.preventDefault();

      var $this = $(e.target),
          $form = $this.parents('.exp-form'),
          errors = false,
          expData = {
            nombre: $form.find('input[name="nombre-experimento"]').val(),
            fechaInicial: $form.find('input[name="fecha-inicial"]').val(),
            fechaFinal: $form.find('input[name="fecha-final"]').val(),
            idActividad: this.currentActivity.id
          }

      $form.children('.text-danger').hide();

      $form.find('input').each(function(){

        var $this = $(this);

        if ( $this.val() == '' ) {

          errors = true;
          $this.parents('.form-group').find('.text-danger').fadeIn();

        } else {

          $this.parents('.form-group').find('.text-danger').hide();

        }

      });

      if ( errors ) {

        this.syncing = false;

        return;

      }
      
      console.log( expData );

      var result = await Cloud['crearExperimento'].with( expData ).tolerate((err)=>{
          
        if ( err ) $form.children('.text-danger').fadeIn();

        this.syncing = false;

      });

      if ( result ) {

        if ( !this.currentActivity.experimentos ) this.currentActivity.experimentos = []

        this.currentActivity.experimentos.push( result );

        $form.slideUp(function(){
          $form.find('input').val('');
          $form.find('.text-danger').hide();
        });

        this.syncing = false;

      }

    },

    abrirNotas: function(e) {

      var $this = $(e.target),
          index = $this.parents('.exp-form').index(),
          expObj = this.currentActivity.experimentos[ index ],
          hideForm = $this.hasClass('hide-form');

      console.log( $this );

      this.listaNotas = expObj.notas;

      $('#notas-popup h2').text( expObj.nombre );
          
      $('#agregarNota').data('index', index);

      if ( hideForm ) {

        $('#notas-popup .nota-form').hide();

      } else {

        $('#notas-popup .nota-form').show();

      }

      $.magnificPopup.open({
        items: {
          src: '#notas-popup',
          type: 'inline',
        },
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
          beforeOpen: function() {
              this.st.mainClass = 'mfp-zoom-out';
          },
          open: function() {
            setTimeout(function(){
              if ( !hideForm ) {
                $('.mfp-wrap').animate({
                    scrollTop:  $('.nota-form textarea').offset().top
                }, 300, function(){
                  $('.nota-form textarea').focus();
                });
              }
            }, 350);
          }
        }
      });

      e.preventDefault();

    },

    abrirAvances: function(e) {

      var $this = $(e.target),
          hideForm = $this.hasClass('hide-form');

      if ( hideForm ) {

        $('#avances-popup .avance-form').hide();

      } else {

        $('#avances-popup .avance-form').show();

      }

      console.log( this.currentActivity );

      $.magnificPopup.open({
        items: {
          src: '#avances-popup',
          type: 'inline',
        },
        removalDelay: 500, //delay removal by X to allow out-animation
        callbacks: {
          beforeOpen: function() {
              this.st.mainClass = 'mfp-zoom-out';
          },
          open: function() {
            setTimeout(function(){
              // if ( !hideForm ) {
                $('.mfp-wrap').animate({
                    scrollTop:  $('.avance-form textarea').offset().top
                }, 300, function(){
                  $('.avance-form textarea').focus();
                });
              // }
            }, 350);
          }
        }
      });

      e.preventDefault();

    },

    borrarExperimento: function(e) {

      if ( this.syncing ) return;

      //this.syncing = true;

      e.preventDefault();

      console.log( this.currentActivity );  
      
      var $this = $(e.target),
          $form = $this.parents('.exp-form'),
          expToDelete = this.currentActivity.experimentos[ $form.index() ];

      console.log( expToDelete );

      var self = this;

      Swal.fire({
        title: 'Eliminar experimento',
        text: "¿Está seguro que quiere eliminar este experimento?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar experimento!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          
          self.eliminarExperimento( expToDelete.id, $form.index() );

        }
      });
      
    },

    eliminarExperimento: async function( idExperimento, index ) {

      var result = await Cloud['borrarExperimento'].with( {id: idExperimento} ).tolerate((err)=>{
          
        if ( err ) {
          
          alert('Ocurrió un error, inténtalo de nuevo más tarde');

          this.$forceUpdate();

        }

      });

      if ( result ) {

        this.currentActivity.experimentos.splice(index, 1);

        this.$forceUpdate();

        Swal.fire(
          'Experimento eliminado!',
          'Experimento eliminado exitósamente.',
          'success'
        )

      };

    },

    agregarNota: async function(e) {

      if ( this.syncing ) return;

      this.syncing = true;

      e.preventDefault();

      var $this = $(e.target),
          $form = $this.parents('.nota-form'),
          expObj = this.currentActivity.experimentos[ $this.data('index') ]
          notaData = {
            nota: $form.find('textarea[name="nota"]').val(),
            idExperimento: expObj.id
          };

      console.log( expObj );

      $form.find('.text-danger').hide();

      if ( !notaData.nota ) {
        
        $('.nota-error').fadeIn();

        return;

      };

      var result = await Cloud['crearNota'].with( notaData ).tolerate((err)=>{
          
        if ( err ) $form.find('.server-error').fadeIn();

        this.syncing = false;

      });

      if ( result ) {

        $form.find('textarea[name="nota"]').val('').focus();

        if ( !expObj.notas ) expObj.notas = [];

        expObj.notas.push( result );

        this.listaNotas = expObj.notas;

        this.syncing = false;

      }

    },

    agregarAvance: async function(e) {

      if ( this.syncing ) return;

      this.syncing = true;

      e.preventDefault();

      var $this = $(e.target),
          $form = $this.parents('.avance-form'),
          avanceData = {
            avance: $form.find('textarea[name="avance"]').val(),
            idActividad: this.currentActivity.id,
            idLider: this.demo.lider
          };

      $form.find('.text-danger').hide();

      if ( !avanceData.avance ) {
        
        $('.avance-error').fadeIn();

        this.syncing = false;

        return;

      };

      var result = await Cloud['crearAvance'].with( avanceData ).tolerate((err)=>{
          
        if ( err ) $form.find('.server-error').fadeIn();

        this.syncing = false;

      });

      if ( result ) {

        $form.find('textarea[name="avance"]').val('').focus();

        console.log( result );

        if ( !this.currentActivity.avances ) this.currentActivity.avances = [];

        this.currentActivity.avances.push( result );

        $.magnificPopup.close();

        this.syncing = false;

      }

    },

    cerrarNotas: function() {

      $.magnificPopup.close();

    },

    cerrarAvances: function() {

      $.magnificPopup.close();

    },

    cerrarCrearExperimento: function() {

      var $form = $('#new-exp');

      $form.slideUp(function(){
        $form.find('input').val('');
        $form.find('.text-danger').hide();
      });

    },

    abrirCrearExperimento: function(e) {

      e.preventDefault();

      var $form = $('#new-exp');

      $form.slideDown();

      $([document.documentElement, document.body]).animate({
          scrollTop: $form.offset().top
      }, 600, function(){
        $form.find('input[name="nombre-experimento"]').focus();
      });
      

    },

    gotoActivity: function( orden ){

      $('body').addClass('custom-syncing');

      this.syncing = true;

      if ( orden > this.nombresActividades.length ) return;

      if ( this.owlInit ) {
        
        this.goto('/actividad/' + orden + '/' + this.demo.id);
      
      }

    },

    updateDates: function (){

      var $fechaInicial = $('.fecha-inicial'),
          $fechaFinal = $('.fecha-final'),
          datepickerFinal = $fechaFinal.datepicker().data('datepicker'),
          datepickerInicial = $fechaInicial.datepicker().data('datepicker');

      console.log( this.formData );

      if ( this.formData.fechaInicial ) {

        var initTimestamp = Date.parse( this.formData.fechaInicial.replace(new RegExp('/', 'g'), ',') );

        datepickerFinal.update('minDate', 
          new Date( initTimestamp )
        );

      } else {

        datepickerFinal.update('minDate', false);

      }

      if ( this.formData.fechaFinal ) {

        var finalTimestamp = Date.parse( this.formData.fechaFinal.replace(new RegExp('/', 'g'), ',') );

        datepickerInicial.update('maxDate',
          new Date( finalTimestamp )
        );

      } else {

        datepickerInicial.update('maxDate', false);

      }

      if ( this.formData.fechaInicial && this.formData.fechaFinal ) {

        var timeDif = finalTimestamp - initTimestamp,
            diasAsignados = timeDif / ( 1000 * 60 * 60 * 24 ) + 1,
            todayTimestamp = Date.parse( new Date() ),
            transcurrido = 0;

        $('.dias-asignados').text( diasAsignados > 1 ? diasAsignados + ' días asignados' : diasAsignados + ' día asignado' );

        if ( todayTimestamp > initTimestamp && todayTimestamp < finalTimestamp ) {

          transcurrido = Math.floor( ( ( todayTimestamp - initTimestamp ) / timeDif ) * 100 );

        } else if ( todayTimestamp < initTimestamp ) {

          transcurrido = 0;

        } else if ( todayTimestamp > finalTimestamp ) {

          transcurrido = 100;

        }

        $('.transcurrido').text( transcurrido );
        $('.bar > div').css('width', transcurrido + '%');

        this.transcurrido = transcurrido;

      } else {

        this.transcurrido = 0;

        $('.dias-asignados').text('0 días asigandos');
        $('.transcurrido').text( 0 );
        $('.bar > div').css('width', '0%');

        $('.cumplimiento').text( '0%' );

      }

      this.updateCumplimiento();

      this.$forceUpdate();

    },

    updateCumplimiento: function(){

      var $cumplimiento = $('.cumplimiento'),
          $wrapper = $cumplimiento.parents('.equipo-wrapper');

      $wrapper.removeClass('green yellow orange red color');

      if ( this.transcurrido ) {

        var cumplimiento = Math.floor( ( this.formData.avanceReal / this.transcurrido ) * 100 );

        $cumplimiento.text( cumplimiento + '%' );

        if ( cumplimiento >= 100 ) {

          $wrapper.addClass('green color');

        } else if ( cumplimiento > 95 ) {

          $wrapper.addClass('yellow color');

        } else if ( cumplimiento > 90 ) {

          $wrapper.addClass('orange color');

        } else { 

          $wrapper.addClass('red color');

        }

      } else {

        $cumplimiento.text( '0%' );

      }

    },

    avanceRealChange: function(e) {

      this.updateCumplimiento();

    },

    updateAvanceTotal: function() {

      var diligenciadas = 0,
          avance = 0;

      for ( var j = 0; j < this.demo.actividades.length; j++ ) {

        var actividad = this.demo.actividades[j];

        if ( !actividad.aplica || ( actividad.fechaInicial && actividad.fechaFinal ) || actividad.sistemaPrueba || actividad.notasAvance || actividad.riesgosyAlertas ) {

          diligenciadas++;

        }

      }

      avance = ( diligenciadas / this.nombresActividades.length ) * 100,
      newconvertedAvance = ( avance / 100 ) * 70;

      this.demo.avanceDiligenciadas = avance;

      this.$forceUpdate();

      if ( newconvertedAvance ) {

        $('.graph-wrapper').removeClass('cero');

      }

      this.chartInstance.update({
        series: [newconvertedAvance, 70 - newconvertedAvance]
      });
      
      console.log( newconvertedAvance );

    },

    setCumplimientoColor: function( $elem, cumplimiento ) {

      $elem.removeClass('green-graph yellow-graph orange-graph red-graph');

      if ( cumplimiento >= 100 ) {

        $elem.addClass('green-graph');

      } else if ( cumplimiento > 95 ) {

        $elem.addClass('yellow-graph');

      } else if ( cumplimiento > 90 ) {

        $elem.addClass('orange-graph');

      } else {

        $elem.addClass('red-graph');

      }

    },

    dateFromNumberToString( date ) {

      var fechaObj = new Date( date );
        
      return fechaObj.getFullYear() + '/' + ( fechaObj.getMonth() + 1 ) + '/' + fechaObj.getDate();
              

    },

    setCurrentActivity: async function ( virtualPageSlug, speed ) {

      if ( virtualPageSlug === this.ordenActividad ){

        this.syncing = false;

        return;

      }

      this.cerrarCrearExperimento();

      var $form = $('.form-uno');

      $form.addClass('notrans');

      var result = await Cloud['getActivity'].with({

        idDemo: this.demo.id,
        ordenActividad : virtualPageSlug
        
      }).tolerate((err)=>{
          
        if ( err ) alert('El servidor no responde, inténtalo de nuevo más tarde');

        this.goto('/actividad/' + this.ordenActividad + '/' + this.demo.id);

        $form.removeClass('notrans');
      
      });

      $form.removeClass('notrans');

      if ( result ) {

        console.log(result);

        var activeOffset = $(window).width() > 600 ? 2 : 1;

        this.owlNav.trigger('to.owl.carousel', [virtualPageSlug - activeOffset, speed || 0]);
        
        this.ordenActividad = virtualPageSlug * 1;

        var $activityTitles = $('.demo-infotabs nav .owl-item')

        $activityTitles.find('.nombre-act').removeClass('active');
        
        $activityTitles.eq( virtualPageSlug - 1 ).find('.nombre-act').addClass('active');

        var self = this;

        console.log( $('.tab-content .tab.active') ); 

        $('.tab-content .tab.active').fadeOut(function(){

          if ( typeof result === 'object' ) {

            console.log( result ); 

            self.avanceActualInicial = result.avanceReal; 
            
            self.currentActivity = result;

            self.formData.descripcion = result.descripcion;

            self.formData.aplica = result.aplica;

            self.formData.sistemaPrueba = result.sistemaPrueba;

            self.formData.avanceReal = result.avanceReal;

            self.formData.avances = result.avances;

            if ( result.fechaInicial ) {

              var fechaInicialObj = new Date( result.fechaInicial ),
                  fechaInicialStr = fechaInicialObj.getFullYear() + '/' + ( fechaInicialObj.getMonth() + 1 ) + '/' + fechaInicialObj.getDate();
              
              self.formData.fechaInicial = fechaInicialStr;

              $('.fecha-inicial').datepicker().data('datepicker').selectDate( fechaInicialObj );
              
            } else {

              self.formData.fechaInicial = '';

              $('.fecha-inicial').datepicker().data('datepicker').clear();

            }

            if ( result.fechaFinal ) {

              var fechaFinalObj = new Date( result.fechaFinal ),
                  fechaFinalStr = fechaFinalObj.getFullYear() + '/' + ( fechaFinalObj.getMonth() + 1 ) + '/' + fechaFinalObj.getDate();
              
              self.formData.fechaFinal = fechaFinalStr;

              $('.fecha-final').datepicker().data('datepicker').selectDate( fechaFinalObj );
              
            } else {

              self.formData.fechaFinal = '';

              $('.fecha-final').datepicker().data('datepicker').clear();

            }

            self.formData.observaciones = result.observaciones;

            self.formData.ayudaPaLoQueViene = result.ayudaPaLoQueViene;

            self.formData.ponerseAlDia = result.ponerseAlDia;

            self.formData.notasAvance = result.notasAvance;

            self.formData.riesgosyAlertas = result.riesgosyAlertas;

          } else if ( result === 'no existe' ) {

            console.log('no existe');

            self.avanceActualInicial = 0;

            self.currentActivity = false;

            self.formData.descripcion = '';

            self.formData.aplica = true;

            self.formData.sistemaPrueba = '';

            self.formData.avanceReal = 0;

            self.formData.fechaInicial = '';

            self.formData.fechaFinal = '';

            self.formData.observaciones = '';

            self.formData.ayudaPaLoQueViene = '';

            self.formData.ponerseAlDia = '';

            self.formData.notasAvance = '';

            self.formData.riesgosyAlertas = '';

            self.formData.avances = [];

          }

          var $this = $(this);

          $this.removeClass('active');

          document.body.classList.add('beforeMount');

          $('.tab-content .tab:first-child').addClass('active').fadeIn();

          $('body').removeClass('custom-syncing');

          self.syncing = false;

          console.log( self.formData );

          self.updateDates();

        }); 

      }
    
    },

    getActivityIndexByOrden: function( orden ) {

      for( var i = 0; i < this.demo.actividades.length; i++ ) {

        if ( this.demo.actividades[i].orden == orden ) return i

      } 

      return false;

    },

    handleParsingForm: function() {

      this.formErrors = {};

      var argins = this.formData;

      argins.idDemo = this.demo.id;

      argins.ordenActividad = this.ordenActividad;

      argins.nombreActividad = this.nombresActividades[ this.ordenActividad - 1 ].nombre;

      if ( this.currentActivity ) {

        argins.idActividad = this.currentActivity.id

      } else {

        argins.idActividad = false;

      }

      var $activeTab = $('.tab-content .tab.active');

      if ( $activeTab.index() == 1 && ( !argins.fechaInicial || !argins.fechaFinal ) ) {

        if ( !argins.fechaInicial ) this.formErrors.fechaInicial = true;

        if ( !argins.fechaFinal ) this.formErrors.fechaFinal = true;

        return;
      }

      console.log( JSON.stringify( argins ) );

      return argins;

    },

    submittedForm: async function( ) {

      console.log( this.transcurrido );

      this.syncing = true;

      var self = this;

      console.log(this.ordenActividad );

      if ( this.ordenActividad == 1 || !this.formData.aplica || this.ordenActividad > 23 ) {

        if ( this.ordenActividad == 25 ) {

          console.log('orden 25');

          this.goto('/resumen/' + this.demo.id);

        } else {

          console.log('orden menor de 25');

          this.goto('/actividad/' + ( (this.ordenActividad * 1)  + 1 ) + '/' + this.demo.id);

        }

      } else {

        console.log( globalResponse );

        this.currentActivity = globalResponse;

        var $activeTab = $('.tab-content .tab.active');

        if ( $activeTab.index() == 2 ) {

          this.goto('/actividad/' + ( ( this.ordenActividad * 1 ) + 1 ) + '/' + this.demo.id);

        } else {

          $activeTab
          .removeClass('active')
          .fadeOut(function(){
            self.syncing = false;
            $(this).next()
              .addClass('active')
              .fadeIn();

          });

        }

      } 

      var activityIndex = this.getActivityIndexByOrden( this.ordenActividad );

      if ( activityIndex !== false ) {
      
        this.demo.actividades[ activityIndex ] = globalResponse;

      } else {

        this.demo.actividades.push( globalResponse );

      }

      this.updateAvanceTotal();

    },

    prevTab: function(e) {

      e.preventDefault();

      var $currentTab = $(e.target).parents('.tab'),
          $tabs = $('.tab-content .tab'),
          index = $currentTab.index();

      if ( index < 1 ) {

        this.gotoActivity( this.ordenActividad - 1 );

        return;

      }

      $currentTab.removeClass('active');

      $currentTab.fadeOut(function(){

        $tabs.eq( index - 1 ).addClass('active').fadeIn();

      });

      e.preventDefault();

    },

    aplicaChange: function(e) {

      var $this = $(e.target),
          $form = $this.parents('form');

      if ( $this.is(':checked') && $this.val() == 'true' ) {

        this.formData.aplica = true;

        setTimeout(function(){

          $form.find('textarea').focus();

        }, 200);

      } else {

        this.formData.aplica = false;

      }

      this.$forceUpdate();

    },

  }
});
