import { Component,ElementRef,NgModule,OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule,FormBuilder,FormGroup, ReactiveFormsModule,Validators,AbstractControl, NgForm } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  AvatarComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  InputGroupComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TableDirective,
  FormFeedbackComponent,
  ToastBodyComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToasterComponent,
  ProgressBarDirective,
  ProgressBarComponent
} from '@coreui/angular';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { IconDirective,IconSetService } from '@coreui/icons-angular';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { MarcaService } from 'src/app/service/marca.service';
import { ModeloService } from 'src/app/service/modelo.service';
import { CategoriaService }from 'src/app/service/categoria.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Marca } from 'src/app/model/marca.model';
import { Modelo } from 'src/app/model/modelo.model';
import { Categoria } from 'src/app/model/categoria.model';
import { HttpClientModule } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import Swal from 'sweetalert2';
import { Zona_segura } from 'src/app/model/zona_segura';
import { Zona_seguraService } from 'src/app/service/Zona_segura.service';
import autoTable, { CellInput, RowInput } from 'jspdf-autotable'; // Asegúrate de importar CellInput y RowInput
import * as icons from '@coreui/icons';
@Component({
  selector: 'app-dispositivo',
  standalone: true,
  imports: [
    ProgressComponent,
    AvatarComponent,
    CommonModule,
    CardBodyComponent,
    CardComponent,
    RowComponent,
    ColComponent,
    IconDirective,
    TableDirective,
    NgxPaginationModule,
    HttpClientModule,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    FormFeedbackComponent,
    ToastBodyComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToasterComponent,
    ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent, ButtonDirective
  ],
  providers:[DipositivoService,ModeloService,MarcaService,CategoriaService],
  templateUrl: './dispositivo.component.html',
  styleUrl: './dispositivo.component.scss'
})
export class DispositivoComponent implements OnInit {
   public dispositivo:Dispositivo =new Dispositivo();
   public dispositivoSeleccionado:Dispositivo | null =new Dispositivo();
   public zonaSeleccionado:Zona_segura | null =new Zona_segura();
   public categoriaselet: Categoria | null = new Categoria();
   public modeloselet: Modelo | null = new Modelo();
   public categoriamod: Categoria = new Categoria();
   public modelomod: Modelo = new Modelo();
   public zonamod: Zona_segura = new Zona_segura();
   public marcaselect: Marca | null = new Marca();
   public marca: Marca = new Marca();
   public modelo: Modelo = new Modelo();
   public titulo: string = "Dispositivos";
   dispositivos: Dispositivo[] = [];
   dispositivosfiltro: Dispositivo[] = [];
   dispovincu: Dispositivo[] = [];
   marcas:Marca[]=[];
   modelos:Modelo[]=[];
   modelosfiltro:Modelo[]=[];
   categorias:Categoria[]=[];
   zonaseg:Zona_segura[]=[];
   Seleccionado: string ='';
   p: number = 1;
   showTable: boolean = true;
   showTablem: boolean = true;
   showTablec: boolean = true;
   registerForm: FormGroup;
   browserDefaultsValidated: boolean = false;
   showTooltip3: boolean = false;
   modelosOriginales: any[];
   nombredispo:String=""
   disponible: boolean;
   id_marca:number;
  searchText: string = '';
  @ViewChild('content', { static: false }) content!: ElementRef; 
  position = 'top-end';
  visible = false;
  percentage = 0;
  position2 = 'top-end';
  visible2 = false;
  percentage2 = 0;
  position3 = 'top-end';
  visible3 = false;
  percentage3 = 0;

  generatePDF() {

    const doc = new jsPDF();
  
    // Encabezado
    const imageWidth = 90;  
    const imageHeight = 40;  
    const imageURL = '../../../assets/images/jedanklogofondoo.jpg';  // Ruta de tu imagen
    doc.addImage(imageURL, 'JPEG', 20, 8, imageWidth, imageHeight);
  
    // Título de la tabla debajo de la imagen
    const titleY = 15 + imageHeight + 5; // Ajusta la posición Y para que esté debajo de la imagen con un pequeño margen
    doc.text('Listado de Dispositivos', 20, titleY);
  
    // Definir las columnas de la tabla
    const columns = ['Codigo', 'Marca', 'Modelo', 'Categoria', '# de Serie', 'Nombre'];
  
    // Mapear los datos para generar las filas
    const rows: RowInput[] = this.dispovincu.map(dispositivo => {
      const row: CellInput[] = [
        dispositivo.idDispositivo?.toString() || '', // Ajusta según el nombre de tu propiedad en Dispositivo
        dispositivo.modelo?.marca?.nombre?.toString() || '',
        dispositivo.modelo?.nombre?.toString() || '',
        dispositivo.categoria?.nombre?.toString() || '',
        dispositivo.numSerie?.toString() || '',
        dispositivo.nombre?.toString() || '',
      ];
      return row;
    });
  
    // Agregar el texto "Número de Dispositivos:" en la esquina superior derecha
    const totalPages = this.dispovincu.length;
    const pageNumberStr = `Número de Dispositivos: ${this.dispovincu.length}`;
    for (let i = 1; i <= totalPages; i++) {
      // Ir a la página i
      doc.setPage(i);
      // Esquina superior derecha
      doc.setFontSize(10); // Tamaño de letra más pequeño
      doc.text(pageNumberStr, doc.internal.pageSize.getWidth() - doc.getTextWidth(pageNumberStr) - 15, 10);
    }
  
    // Generar la tabla debajo del título
    const tableStartY = titleY + 10; // Ajusta la posición Y para que esté debajo del título con un pequeño margen
    autoTable(doc, {
      head: [columns],
      body: rows,
      theme: 'striped',
      headStyles: {
        fillColor: '#343a40',
        textColor: '#ffffff'
      },
      startY: tableStartY
    });
  
    // Generar el blob y abrir en una nueva pestaña
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
  

  filteredDispositivos() {
    if (!this.searchText) {
      return this.dispovincu;
    }

    return this.dispovincu.filter(dispositivo => {
      return (
        dispositivo?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        dispositivo.numSerie?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        dispositivo.categoria?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        dispositivo.modelo?.nombre?.toLowerCase().includes(this.searchText.toLowerCase())||
        dispositivo.modelo?.marca?.nombre?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }
  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
  toggleToast2() {
    this.visible2 = !this.visible2;
  }

  onVisibleChange2($event: boolean) {
    this.visible2 = $event;
    this.percentage2 = !this.visible2 ? 0 : this.percentage2;
  }

  onTimerChange2($event: number) {
    this.percentage2 = $event * 25;
  }


  toggleToast3() {
    this.visible3 = !this.visible3;
  }

  onVisibleChange3($event: boolean) {
    this.visible2 = $event;
    this.percentage3 = !this.visible3 ? 0 : this.percentage3;
  }

  onTimerChange3($event: number) {
    this.percentage3 = $event * 25;
  }

  toggleView() {
    this.showTable = !this.showTable;
     this.titulo="Dispositivo"
  }
  toggleViewm() {
    this.showTablem = !this.showTablem;
     this.titulo="Dispositivo"

  }
  toggleViewc() {
    this.showTablec = !this.showTablec;
     this.titulo="Dispositivo"

  }
  constructor(private serdispo:DipositivoService , private sermarca:MarcaService, private sermodelo:ModeloService, private sercateg:CategoriaService ,private router: Router,fb:FormBuilder,private serzona:Zona_seguraService,public iconSet: IconSetService){

  }
  ngOnInit(): void {
    this.listardispo();
    this.listarmode();
    this.listarcategorias();
    this.listarmarcas();
    this.listarZonas();
  }

  vincular() {
    if (this.dispositivoSeleccionado?.modelo?.marca) {
      this.marca = this.dispositivoSeleccionado?.modelo.marca;
      this.modelo= this.dispositivoSeleccionado?.modelo;
    }
  }
  listardispo() {
    this.serdispo.listar().subscribe(
      dispositivos => {
        this.dispositivos = dispositivos;
         this.filtradispovinculado();
         this.filtradispovinculadotrue();
 


      },
      error => {
        console.error('Error al listar dispositivos:', error);
      }
    );
  }


  filtradispovinculado() {
    console.log("dispositivos org antes del filtro:");
    console.log(this.dispositivos);
    if (this.dispositivos) {
      this.dispositivosfiltro = this.dispositivos.filter(dispositivo => dispositivo.vinculado ==false);
      console.log("dispositivos despues del filtro:");
    console.log(this.dispositivosfiltro);
    } else {

    }
  }

  filtradispovinculadotrue() {
    console.log("dispositivos org antes del filtro:");
    console.log(this.dispositivos);
    if (this.dispositivos) {
      this.dispovincu = this.dispositivos.filter(dispositivo => dispositivo.vinculado ==true);
      console.log("dispositivos despues del filtro:");
    console.log(this.dispositivosfiltro);
    } else {

    }
  }
  onSubmit1(form: NgForm): void {
    if (form.valid) {
      // Procesar el formulario
    } else {
      // Mostrar errores
    }
  }

  seleccion(){
  console.log(this.dispositivoSeleccionado)
  }

  filtrarModelosPorMarca() {
    console.log("Modelos org antes del filtro:");
    console.log(this.modelos);
    if (this.marcaselect && this.marcaselect.nombre) {
      this.modelosfiltro = this.modelos.filter(modelo => modelo.marca?.nombre === this.marcaselect?.nombre);
      console.log("Nombre de marca");
      console.log(this.marcaselect.nombre);
      console.log("Modelosfiltro despues del filtro:");
    console.log(this.modelosfiltro);
    } else {

    }
  }

  filtrarModelosPorMarcaparaedicion() {
    
    console.log("Modelos org antes del filtro para editar:");
    console.log(this.modelos);
    this.dispositivo.modelo?.marca?.nombre
    if (this.dispositivo?.nombre) {
      this.modelosfiltro = this.modelos.filter(modelo => modelo.marca?.nombre === this.dispositivo.modelo?.marca?.nombre);
      console.log("Nombre de marca");
      console.log("Nombre de marca");
      console.log(this.dispositivo.modelo?.marca?.nombre);
    console.log(this.modelosfiltro);
    } else {

    }
  }

  filtrarModelosPorMarcaid() {
    console.log("Modelos org antes del filtro:");
    console.log(this.modelos);
    console.log("Modelo seleccionado");
    console.log(this.modelomod.id_modelo);

    if (this.id_marca ) {
      this.modelosfiltro = this.modelos.filter(modelo => modelo.marca?.id_marca === this.id_marca);
      console.log("Id de marca");
      console.log(this.id_marca);
      console.log("Modelosfiltro despues del filtro:");
    console.log(this.modelosfiltro);
    } else {

    }
  }
    
  isFieldEmpty(): boolean {
    // Devuelve true si el campo contiene solo espacios vacíos o está vacío
    console.log("numero de caracters");
    console.log(this.nombredispo.length);
    return this.nombredispo.length===0;
  }
isNombreInvalid(form: NgForm): boolean {
  const nombreControl = form.controls['nombre'];
  if (nombreControl) {
    const nombreValue = nombreControl.value;
    // Verifica si el campo está vacío o contiene solo espacios
    return !nombreValue || nombreValue.trim().length === 0;
  }
  return true; // Si no se puede obtener el control, se considera inválido
}

  longitid0(): boolean {
   
    if( this.nombredispo.length==0){
      console.log("se supone que es 0")
      console.log(this.nombredispo)
    }else{
      console.log("direfente de 0")
      console.log(this.nombredispo)
    }
    return this.nombredispo.length==0;
  }


  isSubmitDisabled(myForm: NgForm): boolean {
    return myForm.invalid || this.isFieldEmpty();
  }

  trimStart(event: any): void {
    const value = event.target.value;
    event.target.value = value.trimStart();
    this.nombredispo = event.target.value;
  }

  onInput(event: any): void {
    let value = event.target.value;
    
    // Eliminar espacios en blanco al inicio del campo
    if (value.length > 0 && value[0] === ' ') {
      value = value.trimStart();
    }
    
    // Limitar la longitud total del campo a 100 caracteres
    if (value.length > 100) {
      value = value.substring(0, 100); // Recorta el valor a los primeros 100 caracteres
      event.preventDefault(); // Consumir el evento para evitar que se ingrese más texto
    }
    
    // Actualizar el modelo nombredispo con el valor modificado
    this.nombredispo = value;
  }
  
  

  filtrarModelosPorMarcaidini() {
    console.log("Modelos org antes del filtro:");
    console.log(this.modelos);
    if (this.id_marca ) {
      this.modelosfiltro = this.modelos.filter(modelo => modelo.marca?.id_marca === this.id_marca);
      console.log("Id de marca");
      console.log(this.id_marca);
      console.log("Modelosfiltro despues del filtro:");
    console.log(this.modelosfiltro);
    } else {

    }
  }
 modelonull(){
  this.modeloselet=null;
 }

  listarmode() {
    this.sermodelo.listar().subscribe(
      modelos => {
        this.modelos = modelos;
      },
      error => {
        console.error('Error al listar modelos:', error);
      }
    );
  }
  listarmarcas() {
    this.sermarca.listar().subscribe(
      marcas => {
        this.marcas = marcas;
      },
      error => {
        console.error('Error al listar marcas:', error);
      }
    );
  }


  listarcategorias() {
    this.sercateg.listar().subscribe(
      categorias => {
        this.categorias = categorias;
      },
      error => {
        console.error('Error al listar categorías:', error);
      }
    );
  }
  listarZonas() {
    this.serzona.listar().subscribe(
      zonas => {
        this.zonaseg = zonas;
      },
      error => {
        console.error('Error al listar zonas:', error);
      }
    );
  }

  crearDispositivo() {
    this.asignacatmar()
    console.log(this.categoriaselet);
    console.log(this.modeloselet);
    console.log(this.marcaselect);
    console.log(this.dispositivo);
    console.log(this.modelomod);
    if (this.validateForm()) {
      //////////
    this.serdispo.crear(this.dispositivo).subscribe(
      () => {
        if(this.titulo=="Ingresar dispostivo"){
          // Swal.fire({
           //  icon: 'success',
           // title: '¡Dispositivo creado con éxito!',
           // text: 'EXITO',
           // confirmButtonColor: '#3085d6',
           //  confirmButtonText: 'OK'
           //});
          this.toggleToast();
        }else{
          console.log(this.dispositivo);
          // Swal.fire({
          //   icon: 'success',
          //   title: '¡Dispositivo Editado con éxito!',
          //   text: 'EXITO',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // });
          this.toggleToast2();
        }
        this.toggleView();
        this.showTablem=true;
        this.showTablec=true;
        this.vaciarcampos();
        this.listardispo();
      },
      error => {
        console.error('Error al crear dispositivo:', error);
         Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el dispositivo. Inténtalo de nuevo más tarde.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
       //this.toggleToast2();
      }
    );
    }

  }

  editardispo(dispo: Dispositivo) {
    this.dispositivo = structuredClone(dispo); // Utilizar structuredClone para una copia profunda
    this.asigparaedit();
    this.showTablem = false;
    this.toggleView();
   
    this.titulo = "Editar dispostivo";
  }


  asignacatmar() {
    if (this.dispositivo && this.categoriaselet&&this.dispositivoSeleccionado&&this.zonaSeleccionado) {
      if(this.titulo=="Ingresar dispostivo"){
      this.dispositivo=this.dispositivoSeleccionado;
      this.dispositivo.categoria = this.categoriaselet;
      //this.dispositivo.modelo = this.modelo;
      this.dispositivo.zonaSegura=this.zonaSeleccionado;
      this.dispositivo.nombre = this.nombredispo.trim();
      this.dispositivo.disponible=this.disponible;
      this.dispositivo.vinculado=true;
      }else{  
      console.log("se supone que se esta modificando")  
      console.log("aqui el nuevo modelo") 
      console.log(this.modelomod.nombre) 
      this.dispositivo.categoria = this.categoriamod;
      this.dispositivo.modelo = this.modelomod;
      this.dispositivo.zonaSegura= this.zonamod;
      this.dispositivo.nombre= this.dispositivo.nombre?.trim();
      }

    }
    console.log(this.categoriaselet);
    console.log(this.modeloselet);

  }
  asigparaedit() {
    if (this.dispositivo) {
      this.filtrarModelosPorMarcaparaedicion();
      if (this.dispositivo.categoria&&this.dispositivo.modelo?.marca?.id_marca&&this.dispositivo.zonaSegura) {
        this.categoriamod = this.dispositivo.categoria;
        this.zonamod=this.dispositivo.zonaSegura;
        this.id_marca=this.dispositivo.modelo?.marca?.id_marca
      }
      if (this.dispositivo.modelo) {
       this.modelomod = this.dispositivo.modelo;
      }
    }
    console.log(this.categoriaselet);
    console.log(this.modeloselet);
  }

 eliminardispo(dispo:Dispositivo){
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serdispo.eliminar(dispo.idDispositivo!).subscribe(
          () => {
            this.toggleToast3();
            this.listardispo(); // Actualizar la lista de dispositivos después de eliminar uno
          },
          (error) => {
            console.error('Error al eliminar dispositivo:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar el dispositivo. Inténtalo de nuevo más tarde.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }

  vaciarcampos(): void {
  this.dispositivo = new Dispositivo();
  this.categoriaselet= new Categoria();
  this.modeloselet =new Modelo();
  this.marca=new Marca();
  this.modelo=new Modelo();
  this.modelomod=new Modelo();
  this.categoriamod=new Categoria();
  this.modelosfiltro= [];
  this.nombredispo="";
  this.id_marca=0;
  this.disponible=false;


  }
  cancelar(): void{
  this.toggleView();
  this.showTablec=true;
  this.showTablem=true;
  this.vaciarcampos();
  }

  cancelarm(): void{
    this.toggleView();
    this.vaciarcampos();
    }

  btncrear(): void{
    this.categoriaselet = null;
    this.modeloselet=null;
    this.marcaselect=null;
    this.dispositivoSeleccionado=null;
    this.zonaSeleccionado=null;
    this.toggleView();
    this.toggleViewc();
    this.titulo="Ingresar dispostivo"
    }
    validateForm(): boolean {
      // Verificar si el campo 'nombre' está vacío o contiene solo espacios en blanco
      if (!this.dispositivo.nombre || this.dispositivo.nombre.trim() === "") {
        Swal.fire('¡Error!', 'Por favor, no ingrese espacios vacíos en el nombrezz', 'error');
        console.log("aqui el nombre")
        console.log(this.dispositivo.nombre)
        return false;
      }
      return true;
    }

}
