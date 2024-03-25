parasails.registerPage('demostracion', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // listaDepartamentos: [
    //   { valor: 'DMD' },
    //   { valor: 'SMD' },
    //   { valor: 'LMD' },
    //   { valor: 'DUP' },
    //   { valor: 'ICP' },
    //   { valor: 'LUP' },
    //   { valor: 'DCI' },
    //   { valor: 'SUP' },
    //   { valor: 'GEI' },
    //   { valor: 'IAI' },
    //   { valor: 'GLI' },
    //   { valor: 'GST' }
    // ],

    // listaGerencias: [
    //   { valor: 'GEI' },
    //   { valor: 'GDL' },
    //   { valor: 'GST' },
    //   { valor: 'GLI' },
    //   { valor: 'DCI' }
    // ],

    listaGerencias: {
      DCI: ['DCI'],
      GDL: ['DUP','GDL','DMD'],
      GEI: ['GEI'],
      GLI: ['GLI','IAI','LMD','LUP'],
      GST: ['GST','SMD','SUP'],
      ISP: ['ISP']
    },

    areasImplementacion: [
      { valor: 'UP' },
      { valor: 'MID' },
      { valor: 'DOWN' }
    ],

    nivelesData: [
      'Observación de principios básicos',
      'Concepto de la tecnología formulado',
      'Prueba experimental de concepto',
      'Validación de concepto en laboratorio',
      'Validación de prototipo en ambiente relevante',
      'Demostración de prototipo en ambiente relevante',
      'Demostración de tecnología en ambiente operativo',
      'Sistema completo y qualificado. Tecnología documentada',
      'Sistema en operación / Tecnología demostrada'
    ],

    savedIntes: false,

    // Form data
    formData: { /* … */ },

    modeloData: {},

    modeloErrors: {},

    madurezData: {},

    madurezErrors: {},

    savedIntesArray: [],

    integranteData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    integranteErrors: {},

    // Server error state for the form
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach raw data exposed by the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');

    this.formData.nombreLider = this.demo.nombreLider.toLowerCase();
    this.formData.nombreJefe = this.demo.nombreJefe.toLowerCase();
    this.formData.gerencia = this.demo.gerencia;
    this.formData.departamento = this.demo.departamento;
    this.formData.areaImplementacion = this.demo.areaImplementacion;

    this.modeloData.modelo = this.demo.modeloDesarrollo || 'interno';
    this.modeloData.nombreAliado = this.demo.nombreAliado;

    this.madurezData.nivel = this.demo.modeloMadurez;

    if ( this.demo.integrantes.length ) {
    
      this.savedIntes = true;

    }

    var intesToAdd = 3 - this.demo.integrantes.length;

    if ( intesToAdd ) {

      for (var i = 0; i < intesToAdd; i++) {

        Vue.set(this.demo.integrantes, this.demo.integrantes.length, {
          nombre: '',
          nosaved: true,
          showform: true
        });

      }

    }

    this.savedIntesArray = this.demo.integrantes.filter(function( item ) {
      
       if ( !item.nosaved ) return true;

       return false;

    });

    console.log( this.savedIntesArray );

  },
  mounted: async function() {
    document.body.classList.add('mounted');

    var vueObj = this;

    if ( this.demo.modeloDesarrollo == 'codesarrollo' ) {
    
      $('.nombre-aliado-row').show();

    }

    $('.modelo-codesarrollo').on('change', function(){

      if ( $(this).is(':checked') ) $('.nombre-aliado-row').show();

    });

    $('.modelo-interno').on('change', function(){

      if ( $(this).is(':checked') ) $('.nombre-aliado-row').hide();

    });

    if ( this.madurezData.nivel ) {

      $('.nivel-opt').eq( this.madurezData.nivel - 1 ).addClass('active');

    }

    makeChart( '.ct-chart', this.demo.avanceDiligenciadas );
   
    $('.autocomplete-nombre').autocomplete({
        lookup: function (query, done) {

            var result = vueObj.dataLookup.suggestions.filter(function( item ){

              return item.value.toLowerCase().indexOf( query.toLowerCase() ) > -1;

            });

            done({
              suggestions : result
            });
        },
        onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);

            vueObj.formData.nombreJefe = suggestion.value;
        },
        minChars: 3
    });

    console.log(this);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    autoSelectDepartamento: function(e) {

      this.me.gerencia = $(e.target).val();

      this.formData.departamento = this.listaGerencias[ this.me.gerencia ][0];

      console.log( this.me.gerencia );

      this.$forceUpdate();

    },

    nivelRadioChange: function (e) {

      var $this = $(e.target),
          $parent = $this.parents('.nivel-opt');

      if ( $this.is(':checked') ) $parent.addClass('active').siblings().removeClass('active');

    },

    etiqueteClick: function(e) {

      var $this = $(e.target),
          $parent = $this.parents('.nivel-opt');

      $parent.addClass('active').siblings().removeClass('active');

      this.madurezData.nivel = $parent.index() + 1;

      this.$forceUpdate();

    },

    agregarIntegrantes: function(e) {

      $.magnificPopup.open({
        items: {
          src: '#integrantes-popup', // can be a HTML string, jQuery object, or CSS selector
          type: 'inline'
        }
      });

      e.preventDefault();

    },

    agregarOtroIntegrante: function(e) {

      Vue.set(this.demo.integrantes, this.demo.integrantes.length, {
        nombre: '',
        nosaved: true,
        showform: true
      });

      this.$forceUpdate();

      console.log( this.demo.integrantes );

      e.preventDefault();

    },

    submittedForm: async function() {

      $('.detalles-demostracion-tab').fadeOut(function(){

        $('.modelo-desarrollo-tab').fadeIn();

      });

      $('.demo-infotabs nav li:nth-child(2)').addClass('active').siblings().removeClass();
    },

    prevTab: function(e) {

      var $currentTab = $(e.target).parents('.tab'),
          $tabs = $('.tab-content .tab'),
          index = $currentTab.index();

      $currentTab.fadeOut(function(){

        $tabs.eq( index - 1 ).fadeIn();

      });

      $('.demo-infotabs nav li').eq( index - 1 ).addClass('active').siblings().removeClass();

      e.preventDefault();

    },

    agregarIntegrante: async function(e) {

      e.preventDefault();

      var $form = $(e.target),
          index = $form.index(),
          nuevoNombre = $form.find('input[name="nombre"]').val();

      this.integranteData.idDemo = this.demo.id;
      this.integranteData.idIntegrante = this.demo.integrantes[index].id;
      this.integranteData.nombre = nuevoNombre;
      this.demo.integrantes[index].nombre = nuevoNombre;

      if ( !this.parsingIntegrante( $form, nuevoNombre ) ) return;

      this.syncing = true;

      var result = await Cloud['agregarIntegrante'].with( this.integranteData );

      this.demo.integrantes[index].nosaved = false;
      this.demo.integrantes[index].showform = false;
      this.demo.integrantes[index].id = result.id;
      this.savedIntesArray.push( result );
      this.savedIntes = true;

      console.log( this.savedIntesArray );

      this.syncing = false;

    },

    modeloSubmitted: async function() {

      var self = this;

      this.syncing = true;

      $('.modelo-desarrollo-tab').fadeOut(function(){

        self.syncing = false;

        $('.madurez-tab').fadeIn();

      });

      $('.demo-infotabs nav li:nth-child(3)').addClass('active').siblings().removeClass();

    },

    madurezSubmitted: async function() {

      this.syncing = true;

      window.location = '/actividad/1/' + this.demo.id; 

    },

    isThereIntes: function(){

      for (var i = 0; i < this.demo.integrantes.length; i++) {
        
        if ( !this.demo.integrantes[i].nosaved ) {

          return true;

        } 

      }

      return;

    },

    borrarIntegrante: async function(e){

      e.preventDefault();

      var $form = $(e.target).parents('.add-inte-form'),
          index = $form.index(),
          integrante = this.demo.integrantes[index];

      if ( integrante.id ) {

        var result = await Cloud['borrarIntegrante'].with( {id: integrante.id} );

        console.log( result );

        this.savedIntesArray.splice(index, 1);

      }

      this.demo.integrantes.splice(index, 1);

      this.savedIntes = this.isThereIntes();

      console.log( this.savedIntes );

      this.$forceUpdate();

    },

    integranteChange: function(e) {

      var $form = $(e.target).parents('.add-inte-form'),
          index = $form.index(),
          nuevoNombre = $form.find('input[name="nombre"]').val();

      this.demo.integrantes[index].nombre = nuevoNombre;

    },

    editInte: async function(e) {

      var $form = $(e.target).parents('.add-inte-form'),
          index = $form.index();

      this.demo.integrantes[index].showform = true;

      this.$forceUpdate();

      console.log( this.demo.integrantes[index] );

      e.preventDefault();

    },

    parsingIntegrante: function( $form, nombre ) {
      // Clear out any pre-existing error messages.
      this.integranteErrors = {};

      $form.find('.text-danger').hide();

      // Validate nombreLider:
      if(!nombre) {
        $form.find('.integranteErrors-nombre').show();
        return;
      } else if ( !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚ ]+$/) ) {
        $form.find('.integranteErrors-nombre').show();
        return;
      } else if ( nombre.length < 6 ) {
        $form.find('.integranteErrors-nombreCorto').show();
        return;
      }

      return true;
    },

    handleMadurezParsing: function() {

      this.madurezErrors = {};

      var argins = this.madurezData,
          $form = $('.madurez-form');

      $form.find('.text-danger').hide();

      // Validate nombreLider:
      if(!argins.nivel) {
        this.madurezErrors.nivel = true;
        $form.find('.madurezErrors-nivel').show();
        return;
      }

      argins.id = this.demo.id;

      console.log( argins );

      return argins;

    },

    handleModeloParsing: function() {

      this.modeloErrors = {};

      var argins = this.modeloData,
          $form = $('.modelo-desarrollo-form');

      $form.find('.text-danger').hide();

      // Validate nombreLider:
      if( argins.modeloDesarrollo == 'codesarrollo' ) {
        if(!argins.nombreAliado) {
          this.modeloErrors.nombreAliado = true;
          $form.find('.modeloErrors-nombreAliado').show();
          return;
        } else if ( !argins.nombreAliado.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/) ) {
          this.modeloErrors.nombreAliado = true;
          $form.find('.modeloErrors-nombreAliado').show();
          return;
        } else if ( argins.nombreAliado.length < 6 ) {
          this.modeloErrors.nombreAliadoCorto = true;
          $form.find('.modeloErrors-nombreAliadoCorto').show();
          return;
        }
      }

      argins.id = this.demo.id;

      return argins;

    },

    handleParsingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.formData,
          $form = $('.detalles-demostracion-form');

      $form.find('.text-danger').hide();

      // Validate nombreLider:
      // if(!argins.nombreLider) {
      //   this.formErrors.nombreLider = true;
      //   $form.find('.formErrors-nombreLider').show();
      //   return;
      // } else if ( !argins.nombreLider.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]+$/) ) {
      //   this.formErrors.nombreLider = true;
      //   $form.find('.formErrors-nombreLider').show();
      //   return;
      // } else if ( argins.nombreLider.length < 6 ) {
      //   $form.find('.formErrors-nombreLiderCorto').show();
      //   this.formErrors.nombreLiderCorto = true;
      //   return;
      // }

      // Validate nombreJefe:
      // if(!argins.nombreJefe) {
      //   this.formErrors.nombreJefe = true;
      //   $form.find('.formErrors-nombreJefe').show();
      //   return;
      // } else if ( !argins.nombreJefe.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]+$/) ) {
      //   this.formErrors.nombreJefe = true;
      //   $form.find('.formErrors-nombreJefe').show();
      //   console.log( this.formErrors );
      //   return;
      // } else if ( argins.nombreJefe.length < 6 ) {
      //   this.formErrors.nombreJefeCorto = true;
      //   $form.find('.formErrors-nombreJefeCorto').show();
      //   return;
      // }

      console.log( this.formErrors );

      if(!argins.areaImplementacion) {
        this.formErrors.areaImplementacion = true;
        $form.find('.formErrors-areaImplementacion').show();
        return;
      }

      argins.id = this.demo.id;

      return argins;
    }

  }
});
