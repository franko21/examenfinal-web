import { Component,NgModule,OnInit } from '@angular/core';
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
  ProgressBarDirective, ProgressBarComponent
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
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
   public titulo: string = "Dispositivo";
   dispositivos: Dispositivo[] = [];
   dispositivosfiltro: Dispositivo[] = [];
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

  position = 'top-end';
  visible = false;
  percentage = 0;

  position2 = 'top-end';
  visible2 = false;
  percentage2 = 0;

  filteredDispositivos() {
    if (!this.searchText) {
      return this.dispositivos;
    }

    return this.dispositivos.filter(dispositivo => {
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
  constructor(private serdispo:DipositivoService , private sermarca:MarcaService, private sermodelo:ModeloService, private sercateg:CategoriaService ,private router: Router,fb:FormBuilder,private serzona:Zona_seguraService){
  }
  ngOnInit(): void {
    this.listardispo();
    this.listarmode();
    this.listarcategorias();
    this.listarmarcas();
    this.listarZonas();
  }
  listardispo() {
    this.serdispo.listar().subscribe(
      dispositivos => {
        this.dispositivos = dispositivos;
         this.filtradispovinculado();
         console.log("aqui prestamos")
         console.log(this.dispositivos[0].prestamos)


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

  filtrarModelosPorMarcaid() {
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
    if (this.validateForm()) {
      //////////
    this.serdispo.crear(this.dispositivo).subscribe(
      () => {
        if(this.titulo=="Ingresar dispostivo"){
          // Swal.fire({
          //   icon: 'success',
          //   title: '¡Dispositivo creado con éxito!',
          //   text: 'EXITO',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // });
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
          this.toggleToast();
        }
        this.toggleView();
        this.showTablem=true;
        this.showTablec=true;
        this.vaciarcampos();
        this.listardispo();
      },
      error => {
        console.error('Error al crear dispositivo:', error);
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Error',
        //   text: 'Hubo un problema al crear el dispositivo. Inténtalo de nuevo más tarde.',
        //   confirmButtonColor: '#d33',
        //   confirmButtonText: 'OK'
        // });
        this.toggleToast2();
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
    if (this.dispositivo && this.categoriaselet&&this.modeloselet&&this.dispositivoSeleccionado&&this.zonaSeleccionado) {
      if(this.titulo=="Ingresar dispostivo"){
      this.dispositivo=this.dispositivoSeleccionado;
      this.dispositivo.categoria = this.categoriaselet;
      this.dispositivo.modelo = this.modeloselet;
      this.dispositivo.zona_segura=this.zonaSeleccionado;
      this.dispositivo.nombre=this.nombredispo;
      this.dispositivo.disponible=this.disponible;
      this.dispositivo.vinculado=true;

      }else{
      this.dispositivo.categoria = this.categoriamod;
      this.dispositivo.modelo = this.modelomod;
      this.dispositivo.zona_segura= this.zonamod;

      }

    }
    console.log(this.categoriaselet);
    console.log(this.modeloselet);

  }
  asigparaedit() {
    if (this.dispositivo) {
      if (this.dispositivo.categoria&&this.dispositivo.modelo?.marca?.id_marca&&this.dispositivo.zona_segura) {
        this.categoriamod = this.dispositivo.categoria;
        this.zonamod=this.dispositivo.zona_segura;
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
            Swal.fire(
              '¡Eliminado!',
              'El dispositivo ha sido eliminado.',
              'success'
            );
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
  this.modelomod=new Modelo();
  this.categoriamod=new Categoria();
  this.modelosfiltro= [];
  this.nombredispo="";
  this.id_marca=0;

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
      // Verificar si los campos obligatorios están llenos
      if (
        !this.dispositivo ||
        !this.dispositivo.nombre ||
        !this.dispositivo.categoria ||
        !this.dispositivo.modelo ||
        !this.dispositivo.numSerie// ||
        //!this.dispositivo.disponible
      ) {
        Swal.fire('¡Error!', 'Por favor, completa todos los campos obligatorios.', 'error');
        return false;
      }
      return true;
    }

}
