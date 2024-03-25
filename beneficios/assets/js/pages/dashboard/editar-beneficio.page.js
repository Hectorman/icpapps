parasails.registerPage('editar-beneficio', {
   //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
   //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
   //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
   data: {
      // Main syncing/loading state for this page.
      syncing: false,

      formStep: 0,

      // Form data
      formData: { /* … */ },

      // For tracking client-side validation errors in our form.
      // > Has property set to `true` for each invalid property in `formData`.
      formErrors: { /* … */ },

      // Server error state for the form
      cloudError: '',

      lastIndex: false,

      contenidoInicial: [
         {
            nombre: 'Objetivo General',
            campo: 'objetivoGeneral'
         },
         {
            nombre: 'Objetivos Específicos',
            campo: 'objetivosEspecificos'
         },
         {
            nombre: 'Tipología del proyecto',
            campo: 'tipologia'
         },
         {
            nombre: 'Líder del Proyecto',
            campo: 'lider'
         },
         {
            nombre: 'Valor Vigencias',
            campo: 'valorVigencias'
         },
         {
            nombre: 'Revisión Autoridad Técnica',
            campo: 'aprobadoGerencia'
         },
         {
            nombre: 'Revisión Comité',
            campo: 'aprobadoComite'
         },
         {
            nombre: 'TI-F 027 Formato Guía para Postular Proyectos a Obtener Beneficios',
            campo: 'archivoUno'
         },
         {
            nombre: 'TI-F 028 Formato Guía para Presupuesto del Proyecto a Obtener Beneficios Tributarios',
            campo: 'archivoDos'
         },
         {
            nombre: 'Aprobación final',
            campo: 'aprobadoFinal'
         }
      ],

   },

   computed: {

      

   },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {

   moment.locale('es');

    // Attach raw data exposed by the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');

      
     this.updateProgress();
      

   },
   mounted: async function() {
      document.body.classList.add('mounted');
      console.log( this.beneficio );

      var vueObj = this;

      if ( this.beneficio.objetivoGeneral ) this.formData.objetivoGeneral = this.beneficio.objetivoGeneral;   
      if ( this.beneficio.objetivosEspecificos ) this.formData.objetivosEspecificos = this.beneficio.objetivosEspecificos;
      if ( this.beneficio.tipologia ) this.formData.tipologia = this.beneficio.tipologia;
      if ( this.beneficio.investigacion ) this.formData.investigacion = this.beneficio.investigacion;
      if ( this.beneficio.innovacion ) this.formData.innovacion = this.beneficio.innovacion;
      if ( this.beneficio.desarrollo ) this.formData.desarrollo = this.beneficio.desarrollo;
      if ( this.beneficio.lider ) this.formData.lider = this.beneficio.lider;

      if ( this.beneficio.valorVigencias ) this.formData.valorVigencias = JSON.parse( this.beneficio.valorVigencias );

      if ( this.beneficio.archivoUno ) { 
         
         this.formData.archivoUno = JSON.parse( this.beneficio.archivoUno );

      } else {

         this.beneficio.archivoUno = [];

      }

      if ( this.beneficio.archivoDos ) { 
         
         this.formData.archivoDos = JSON.parse( this.beneficio.archivoDos );

      } else {

         this.beneficio.archivoDos = [];

      }

      $('html').on('click', 'a.image-link', function(e){

         $.magnificPopup.open({
            items: {
              src: $(this).attr('href')
            },
            type: 'image'
          }, 0);

          e.preventDefault();

      })

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

            vueObj.formData.lider = suggestion.value;
         },
         autoSelectFirst: true
      });

   },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

   agregarVigencia: function(e) {

      if ( !this.formData.valorVigencias ) this.formData.valorVigencias = [];

      this.formData.valorVigencias.push( ['', ''] );

      console.log( this.formData.valorVigencias );

      this.$forceUpdate();

      e.preventDefault();

   },

   formatMoney: function( value ) {

      var formatter = new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
      });
       
      return formatter.format( value );

   },

   formatVigencia: function(e) {

      var $input = $(e.target),
          vigenciaIndex = $input.data('index');

      this.formData.valorVigencias[vigenciaIndex][1] = this.formatMoney( this.formData.valorVigencias[vigenciaIndex][1].replace(/\D/g,'').replaceAll('.', '').replaceAll('$', '') );

      this.$forceUpdate();

   },

   fechaFromNow: function( date ) {

      return moment( date ).fromNow();

   },

   editContenido: function(e) {

      $('#archivoUno').val('');
      $('#archivoDos').val('');

      var $parent = $(e.target).parents('.check-row').length ? $(e.target).parents('.check-row') : $(e.target);

      if ( this.beneficio[ this.contenidoProgreso[0].campo ] ) {

         this.contenidoCompletado.splice( this.lastIndex, 0, this.contenidoProgreso[0] );

      } else {

         this.contenidoPendiente.unshift( this.contenidoProgreso[0] )

      }

      this.lastIndex = this.getElIndexByTitulo( this.contenidoCompletado, $parent.find('h2').text() );

      this.contenidoProgreso = this.contenidoCompletado.splice( this.lastIndex, 1 );

      console.log( this.contenidoProgreso )

      this.$forceUpdate();

   },

   getElIndexByTitulo: function( elements, titulo ) {

      for (let index = 0; index < elements.length; index++) {
         const element = elements[index];

         if ( element.nombre == titulo ) return index;
         
      }

   },

   updateProgress: function( e ) {

      if ( e ) e.preventDefault();

      this.contenidoProgreso = false,

      this.contenidoPendiente = [];

      this.contenidoCompletado = [];

      for (let index = 0; index < this.contenidoInicial.length; index++) {
         const element = this.contenidoInicial[index];

         if ( !this.beneficio[ element.campo ] || ( this.beneficio[ element.campo ] && element.campo == 'valorVigencias' && !this.beneficio[ element.campo ].length ) ) {

            if ( !this.contenidoProgreso ) {

               this.contenidoProgreso = [ element ]

            } else {

               this.contenidoPendiente.push( element )

            }

         } else {

            this. contenidoCompletado.push( element )

         }
         
      }

      console.log( this.contenidoInicial )
      console.log( this.contenidoPendiente )
      console.log( this.contenidoProgreso )

      this.$forceUpdate();
      
   },

   submittedForm: async function( data ) {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)

      this.beneficio = cloudResult;

      //this.beneficio.valorVigencias = JSON.parse( this.beneficio.valorVigencias );

      $('#archivoUno').val('');
      $('#archivoDos').val('');

      this.updateProgress();

   },

   handleParsingForm: function() {

      this.formErrors = {};

      var argins = this.formData,
          errors = 0;

      argins.id = this.beneficio.id;

      //argins.valorVigencias = JSON.stringify( argins.valorVigencias );

      if ( this.contenidoProgreso[0].nombre == 'Revisión Autoridad Técnica' ) {

         argins.estado = 'pendiente por asignar autoridad técnica';

      }

      // if ( this.contenidoProgreso[0].nombre == 'Revisión Autoridad Técnica' ) {

      //    argins.estado = 'pendiente de aprobación gerencia';

      // } 

      if ( this.contenidoProgreso[0].nombre == 'Revisión Comité' ) {

         argins.estado = 'pendiente de aprobación comité';

      }
      
      if ( this.contenidoProgreso[0].nombre == 'Aprobación final' ) {

         argins.estado = 'pendiente de aprobación final';

      }

      if ( this.contenidoProgreso[0].campo == 'archivoUno' ) {

         if ( this.beneficio.archivoUno ) {

            argins.archivoUno = this.beneficio.archivoUno;

            // argins.filenameUno = this.beneficio.filenameUno;

            // argins.fechaUno = this.beneficio.fechaUno;

         } else {

            this.formErrors.archivoUno = 'Debes seleccionar un archivo';

            errors++;

         }

      }

      if ( this.contenidoProgreso[0].campo == 'archivoDos' ) {

         if ( this.beneficio.archivoDos ) {

            argins.archivoDos = this.beneficio.archivoDos;

            argins.filenameDos = this.beneficio.filenameDos;

            argins.fechaDos = this.beneficio.fechaDos;

         } else {

            this.formErrors.archivoDos = 'Debes seleccionar un archivo';

            errors++;

         }

      }

      if ( errors ) return false;

      console.log( argins );

      return argins;
   },

   fakeUpload: function() {

      $('#input-file').trigger('click');

   },

   fileChange: function(e) {

      this.formErrors = {};

      console.log( 'wat' );

      if ( this.contenidoProgreso[0].campo == 'archivoUno' && ( 
           this.getFileNameWithExt( e ) !== 'doc' &&
           this.getFileNameWithExt( e ) !== 'docx'
      )) {

         this.formErrors.archivoUno = 'Debes seleccionar un documento de Word';

         this.$forceUpdate();

         return false;

      }

      if ( this.contenidoProgreso[0].campo == 'archivoDos' && this.getFileNameWithExt( e ) !== 'xlsx' ) {

         this.formErrors.archivoDos = 'Debes seleccionar un documento de excel';

         this.$forceUpdate();

         return false;

      }

      this.submitFile();

   },

   submitFile: function() {

      var vueObj = this,
          $form =  $('#file-form'),
          data = new FormData( $form[0] );

      $.ajax({
         type: "POST",
         url: $form.attr('action'),
         data: data,
         cache: false,
         contentType: false,
         processData: false,
         method: 'POST',
         success: function( data ) {

            $('#archivoUno').val( '' );
            $('#archivoDOS').val( '' ); 

            console.log( data );

            if ( data.files.length ) {
            
               if ( vueObj.contenidoProgreso[0].campo == 'archivoUno' ) {

                  console.log( 'archivo uno' )

                  $('#archivoUno').val( data.files[0].filename ); 

                  vueObj.beneficio.archivoUno.push(
                     {
                        ruta: data.files[0].fd.split("\\").pop(),
                        fileName: data.files[0].filename,
                        date: moment().format()
                     }
                  );
         
               }
               
               if ( vueObj.contenidoProgreso[0].campo == 'archivoDos' ) {

                  console.log( 'archivo dos' );

                  $('#archivoDos').val( data.files[0].filename ); 

                  vueObj.beneficio.archivoDos.push(
                     {
                        ruta: data.files[0].fd.split("\\").pop(),
                        fileName: data.files[0].filename,
                        date: moment().format()
                     }
                  );
         
               }

               vueObj.$forceUpdate();

            }

         }
      });

   },

   getFileNameWithExt: function(event) {

      if (!event || !event.target || !event.target.files || event.target.files.length === 0) {
        return;
      }
    
      const name = event.target.files[0].name;
      const lastDot = name.lastIndexOf('.');
    
      const fileName = name.substring(0, lastDot);
      const ext = name.substring(lastDot + 1);
    
      return ext;
      
   }

}
});
