import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  TextColorDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { Dipositivo } from 'src/app/model/dispositivo.model';
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
@Component({
  selector: 'app-dispositivo',
  standalone: true,
  imports: [ProgressComponent,AvatarComponent,CommonModule,CardBodyComponent,CardComponent,RowComponent,ColComponent,IconDirective,TableDirective,NgxPaginationModule,HttpClientModule,InputGroupComponent,InputGroupTextDirective,FormControlDirective,ButtonDirective],
  providers:[DipositivoService,ModeloService,MarcaService,CategoriaService],
  templateUrl: './dispositivo.component.html',
  styleUrl: './dispositivo.component.scss'
})
export class DispositivoComponent {
   dispositivos: Dipositivo[] = [];
   marcas:Marca[]=[];
   modelos:Modelo[]=[];
   categorias:Categoria[]=[];
   p: number = 1;
   showTable: boolean = true;
  toggleView() {
    this.showTable = !this.showTable;
  }
  constructor(private serdispo:DipositivoService , private sermarca:MarcaService, private sermodelo:ModeloService, private sercateg:CategoriaService ,private router: Router){
    //private sermarca:MarcaService, private sermodelo:ModeloService, private sercateg:CategoriaService
  }
  
  ngOnInit() {
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


}
