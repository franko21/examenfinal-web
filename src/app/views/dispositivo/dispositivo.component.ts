import { Component,NgModule,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AvatarComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  InputGroupComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  
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
    ReactiveFormsModule

     
  ],
  providers:[DipositivoService,ModeloService,MarcaService,CategoriaService],
  templateUrl: './dispositivo.component.html',
  styleUrl: './dispositivo.component.scss'
})
export class DispositivoComponent implements OnInit {
   public dispositivo:Dispositivo=new Dispositivo();
   public titulo: string = "Dispositivo";
   dispositivos: Dispositivo[] = [];
   marcas:Marca[]=[];
   modelos:Modelo[]=[];
   categorias:Categoria[]=[];
   p: number = 1;
   showTable: boolean = true;
  toggleView() {
    this.showTable = !this.showTable;
     this.titulo="Dispositivo"
  }
  constructor(private serdispo:DipositivoService , private sermarca:MarcaService, private sermodelo:ModeloService, private sercateg:CategoriaService ,private router: Router){
    //private sermarca:MarcaService, private sermodelo:ModeloService, private sercateg:CategoriaService
  }
  ngOnInit(): void {
    this.listardispo();
    this.listarmode();
    this.listarcategorias();
    this.listarmarcas();   
  }
  listardispo() {
    this.serdispo.listar().subscribe(
      dispositivos => {
        this.dispositivos = dispositivos;   
      },
      error => {
        console.error('Error al listar dispositivos:', error);
      }
    );
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

  crearDispositivo() {
    if (this.validateForm()) {
      //////////
    this.serdispo.crear(this.dispositivo).subscribe(
      () => { 
        if(this.titulo=="Ingresar dispostivo"){
          Swal.fire({
            icon: 'success',
            title: '¡Dispositivo creado con éxito!',
            text: 'EXITO',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }else{
          Swal.fire({
            icon: 'success',
            title: '¡Dispositivo Editado con éxito!',
            text: 'EXITO',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
        this.toggleView();
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
      }
    );
    //////
      
    }
     
 
  }

  editardispo(dispo:Dispositivo){
    this.dispositivo =dispo; 
    this.toggleView();
    this.titulo="Editar dispostivo"
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
        this.serdispo.eliminar(dispo.id_dispositivo!).subscribe(
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
   
  }
  cancelar(): void{
  this.toggleView();
  this.vaciarcampos();
  }
  
  btncrear(): void{
    this.toggleView();
    this.titulo="Ingresar dispostivo"
    }
    validateForm(): boolean {
      // Verificar si los campos obligatorios están llenos
      if (
        !this.dispositivo ||
        !this.dispositivo.nombre ||
        !this.dispositivo.categoria ||
        !this.dispositivo.modelo ||
        !this.dispositivo.numero_serie// ||
        //!this.dispositivo.disponible
      ) {
        Swal.fire('¡Error!', 'Por favor, completa todos los campos obligatorios.', 'error');
        return false;
      }
      return true;
    }

}
