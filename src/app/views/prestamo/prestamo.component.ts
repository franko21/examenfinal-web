import {DatePipe, NgClass, NgFor, NgIf, NgStyle} from '@angular/common';
import { Component,NgModule,OnInit } from '@angular/core';
import{Prestamo} from '../../model/prestamo.model';
import{PrestamoService} from '../../service/prestamo.service';
import{HistoricoService} from '../../service/historico.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {IconDirective, IconSetService} from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  GutterDirective,
  FormFeedbackComponent,
  ToastBodyComponent,
  ToastComponent,
  ToastHeaderComponent,
  ToasterComponent,
  ProgressBarDirective,
  ProgressComponent,
  ProgressBarComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent, ModalBodyComponent
} from '@coreui/angular';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { PersonaService } from 'src/app/service/persona.service';
import { DipositivoService } from 'src/app/service/dispositivo.service';
import { Persona } from 'src/app/model/persona.model';
import { UsuarioService } from 'src/app/service/usuario.service';
import { Zona_segura } from 'src/app/model/zona_segura';
import { Dispositivo } from 'src/app/model/dispositivo.model';
import { Usuario } from 'src/app/model/usuario.model';
import { environment } from 'src/enviroments/environment';
import { NgxPaginationModule } from 'ngx-pagination';
import * as icons from '@coreui/icons';
import { jsPDF } from 'jspdf';
import autoTable, { CellInput, RowInput } from 'jspdf-autotable';
import { Historico } from 'src/app/model/historico.model';







@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [NgFor, HttpClientModule, NgIf, ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, ReactiveFormsModule, HttpClientModule, NgxPaginationModule, GutterDirective, FormFeedbackComponent, DatePipe, ToasterComponent, ToastComponent, ToastHeaderComponent, ToastBodyComponent, ProgressBarDirective, ProgressComponent, ProgressBarComponent, ButtonDirective, FormsModule, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalBodyComponent, NgClass, NgStyle],
  providers:[PrestamoService,PersonaService,DipositivoService,UsuarioService,DatePipe],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {
  selectedPrestamo: any;
  mostrarFormularioIngreso = false;
  mostrarFormularioEditar = false;
  prestamos:Prestamo[]=[];
  prestamo:Prestamo=new Prestamo;
  personas:Persona[]=[];
  dispositivos:Dispositivo[]=[];
  historicos:Historico[]=[];
  finalizarForm: FormGroup;
  filaEditada: number | null = null;
  registerForm: FormGroup;
  registerFormIn: FormGroup;
  usuario:Usuario;
  hoy: Date = new Date();
  idusu:number;
  p: number = 1; // Página actual para la paginación
  searchText: string = '';
  public visible3 = false;
  filteredPrestamosList: any[] = [];


  position = 'top-end';
  visible = false;
  percentage = 0;

  position2 = 'top-end';
  visible2 = false;
  percentage2 = 0;
  filtroEstado: string = 'todos'; // Variable para almacenar el estado seleccionado en el select
  fechaInicio: string = '';
  fechaFin: string = '';

  ngOnInit():void {
    this.usuarioService.getUsuarioByUsername(environment.username).subscribe(
      usu=>{
        this.idusu=usu.id_usuario;
      }
    )
    this.prestamoService.getPrestamos().subscribe(
      prestamo => {
        this.prestamos = prestamo.sort((a, b) => {
          if (a.finalizado !== b.finalizado) {
            return a.finalizado ? 1 : -1;
          }
          // Si son iguales en finalizado, ordenar por fecha de devolución ascendente
          const fechaDevolucionA = new Date(a.fecha_finalizacion);
          const fechaDevolucionB = new Date(b.fecha_finalizacion);
          return fechaDevolucionA.getTime() - fechaDevolucionB.getTime();

        }); // @ts-ignore
      }
    );
    this.personaService.getPersonas().subscribe(
      persona=>{
        this.personas=persona;
      }
    )
    this.dispoService.listar().subscribe(
      dipo=>{
        this.dispositivos=dipo.filter(dispositivo => dispositivo.disponible);
      }
    )
  }
  constructor(private datePipe:DatePipe,private usuarioService:UsuarioService, private dispoService:DipositivoService, private personaService:PersonaService,private prestamoService: PrestamoService,private historicoService:HistoricoService,private router:Router,private fb:FormBuilder,private iconSet: IconSetService){
    this.registerForm = this.fb.group({
      beneficiario: ['', Validators.required],
      dispositivo: ['', Validators.required],
      fecha: ['', Validators.required],
      motivo: ['', Validators.required],
      finalizado: ['', Validators.required],
      estado_devolucion:['', Validators.required],
      // Otros campos del formulario
    });
    this.registerFormIn = this.fb.group({
      beneficiario: ['', Validators.required],
      dispositivo: ['', Validators.required],
      fecha: ['', Validators.required],
      motivo: ['',Validators.required],
    });
    this.finalizarForm = this.fb.group({
      estado_devolucion: ['', Validators.required],
    });
    // @ts-ignore
    this.iconSet.icons = icons;

  }
  applyFilters(): void {
    let filtered = this.prestamos;

    if (this.searchText) {
      filtered = filtered.filter(p =>
        p.persona?.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.persona?.apellido.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.dispositivo?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.dispositivo?.modelo?.marca?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.dispositivo?.numSerie?.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.filtroEstado !== 'todos') {
      const finalizado = this.filtroEstado === 'finalizado';
      filtered = filtered.filter(p => p.finalizado === finalizado);
    }

    if (this.fechaInicio) {
      filtered = filtered.filter(p => new Date(p.fecha_prestamo) >= new Date(this.fechaInicio));
    }

    if (this.fechaFin) {
      filtered = filtered.filter(p => new Date(p.fecha_prestamo) <= new Date(this.fechaFin));
    }

    this.filteredPrestamosList = filtered;
  }
  // Método para manejar cambios en los filtros
  onSearchTextChange(): void {
    this.applyFilters();
  }

  onFiltroEstadoChange(): void {
    this.applyFilters();
  }

  filterByDateRange(): void {
    this.applyFilters();
  }

  listarHistoricos(prestamo: Prestamo) {
    this.historicoService.listar().subscribe(
      historicos => {
        // Filtrar los históricos por id_dispositivo y por el rango de fechas y horas
        this.historicos = historicos.filter(historico => {
          // Verificar si el id_dispositivo del historico coincide con el del prestamo
          const idDispositivoMatch = historico.dispositivo?.idDispositivo === prestamo.dispositivo?.idDispositivo;
  
          // Verificar si historico.fechaHora está definido antes de convertirlo a objeto Date
          if (!historico.fecha) {
            return false; // Si fechaHora es undefined, no cumple con el filtro
          }
  
          // Convertir historico.fechaHora a objeto Date
          const fechaHoraHistorico = new Date(historico.fecha);
  
          // Verificar si el historico.fechaHora está dentro del rango de fechas y horas del prestamo
          const fechaInicio = new Date(prestamo.fecha_prestamo);  // Convertir a objeto Date
          const fechaFin = new Date(prestamo.fecha_finalizacion);  // Convertir a objeto Date
          const fechaMatch = fechaHoraHistorico >= fechaInicio && fechaHoraHistorico <= fechaFin;
  
          // Devolver verdadero si ambos criterios coinciden
          return idDispositivoMatch && fechaMatch;
        }).sort((a, b) => {
          // Ordenar por fecha, asumiendo que historico.fecha es una cadena de fecha válida
          if (a.fecha && b.fecha) {
            return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
          }
          return 0; // Si no se puede comparar, dejar en el mismo orden
        });
  
        console.log("Se supone que aquí están los históricos filtrados por id_dispositivo y rango de fechas, ordenados por fecha:", prestamo.dispositivo?.idDispositivo);
        console.log(this.historicos);     
       this.generatePDF(prestamo);
      },
      error => {
        console.error('Error al listar dispositivos:', error);
      }
    );
  }


  generatePDF(prestamo:Prestamo) {
    
    const doc = new jsPDF();
    // Encabezado
    const imageWidth = 90;  
    const imageHeight = 40;  
    const imageURL = '../../../assets/images/jedanklogofondoo.jpg';  // Ruta de tu imagen
    doc.addImage(imageURL, 'JPEG', 20, 8, imageWidth, imageHeight);
  
    // Texto a la derecha de la imagen
    const textX = 20 + imageWidth + 10; // Ajusta la posición X para que esté a la derecha de la imagen con un pequeño margen
    const textY = 11; // Ajusta la posición Y para alinear con la parte superior de la imagen
    const textWidth = 10; // Ancho del área de texto
  
    const fechaFinalizacion = new Date(prestamo.fecha_finalizacion);
    const fechaPrestamo = new Date(prestamo.fecha_prestamo);

// Función para formatear la fecha y hora como "YYYY-MM-DD HH:mm:ss"
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds} ${year}-${month}-${day} `;
}

const textLines = [
  `Administrador: ${prestamo.persona.nombre}`, 
  `Usuario: ${prestamo.persona.nombre} ${prestamo.persona.apellido}`, 
  `Identificación: ${prestamo.persona.cedula}`, 
  `Dispositivo: ${prestamo.dispositivo.modelo?.marca?.nombre}/${prestamo.dispositivo.modelo?.nombre}`, 
  `Inicia:       ${formatDate(fechaPrestamo)}`,
  `Devuelve: ${formatDate(fechaFinalizacion)}`
];
  
    // Ajustar el tamaño de la letra
    const fontSize = 12; // Tamaño de letra deseado
    doc.setFontSize(fontSize);
  
    // Agregar texto a la derecha de la imagen
    textLines.forEach((line, index) => {
      doc.text(line, textX, textY + (index * 7.5)); // Ajusta la separación entre líneas si es necesario
    });
  
    // Restablecer el tamaño de la letra si es necesario para otros textos
    doc.setFontSize(16); // Tamaño de letra para otros textos
  
    // Título de la tabla debajo de la imagen y el texto
    const titleY = imageHeight + 20; // Ajusta la posición Y para que esté debajo de la imagen y el texto con un pequeño margen
    doc.text('Historicos de posiciones', 20, titleY);
  
    // Definir las columnas de la tabla
    const columns = ['Latitud', 'Longitud', 'Hora / Fecha'];
  
    // Mapear los datos para generar las filas
    const rows: RowInput[] = this.historicos.map(historico => {
      const row: CellInput[] = [
        historico.latitud?.toString() || '', // Ajusta según el nombre de tu propiedad en Dispositivo
        historico.longitud?.toString() || '',
        historico.fecha ? formatDate(new Date(historico.fecha)) : '',

      ];
      return row;
    });
  
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

  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  calcularTiempoRestante(prestamo: Prestamo): string {
    const fechaDevolucion = new Date(prestamo.fecha_finalizacion);
    const now = new Date(); // Usar la fecha y hora actual cada vez que se llame el método
    const diff = fechaDevolucion.getTime() - now.getTime();

    if (diff < 0) {
      return "Caducado";
    }

    // Convertir la diferencia a días, horas, minutos y segundos
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);

    return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }
  formatDate2(date: Date, format: string): string {
    return <string>this.datePipe.transform(date, format);
  }

  handleLiveDemoChange(event: any) {
    this.visible3 = event;
  }
  toggleLiveDemo2(index: number) {
    this.selectedPrestamo = this.prestamos[index];
    this.visible3 = !this.visible3;
    console.log(this.selectedPrestamo.id_prestamo);
  }

  onFinalizarSubmit() {
    if (this.finalizarForm.valid) {
      // Lógica para manejar la finalización del préstamo
      const formValues=this.finalizarForm.value;
      let prestamo:Prestamo=new Prestamo();
      prestamo.dispositivo=this.selectedPrestamo.dispositivo;
      prestamo.estado_devolucion=formValues.estado_devolucion;
      this.prestamoService.finalizarPrestamo(this.selectedPrestamo.id_prestamo,prestamo).subscribe({
        next:(userData)=>{
          console.log('Datos de edicion recibidos:', userData);
          this.prestamoService.getPrestamos().subscribe(
            prestamo => {
              this.prestamos = prestamo;
            }

          );
          this.finalizarForm.reset();
          //   Swal.fire({
          //     icon: 'success',
          //     title: '¡Edicion de prestamo exitosa!',
          //     text: 'EXITO',
          //     confirmButtonColor: '#3085d6',
          //     confirmButtonText: 'OK'
          // })
          this.toggleToast();
          this.toggleLiveDemo2(0);
        },
        error:(errorData)=>{
          console.error('Error al editar prestamo:', errorData);
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Error al edita prestamo',
          //     text: 'Error al ingresar los datos.',
          //     confirmButtonColor: '#3085d6',
          //     confirmButtonText: 'OK'
          // });
          this.toggleToast2();
        },
        complete:()=>{
          console.info("Edicion completa");
          this.filaEditada = null;
          this.mostrarFormularioEditar=false;
        }
      })

      // Aquí puedes agregar la lógica para actualizar el estado del préstamo en tu base de datos

      // $('#modalFinalizar').modal('hide');
    }else{
      this.markFormGroupTouched(this.registerFormIn);
    }
  }


  filteredPrestamos() {
    let filteredList = this.prestamos;

    // Filtrar por texto de búsqueda
    if (this.searchText) {
      filteredList = filteredList.filter(prestamo =>
        prestamo.dispositivo.modelo?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.dispositivo.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.dispositivo.numSerie?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.dispositivo.modelo?.marca?.nombre?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.persona.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.persona.apellido.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.persona.cedula.toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.fecha_prestamo.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
        prestamo.fecha_finalizacion.toString().toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    // Filtrar por estado seleccionado
    if (this.filtroEstado === 'prestado') {
      filteredList = filteredList.filter(prestamo => !prestamo.finalizado);
    } else if (this.filtroEstado === 'finalizado') {
      filteredList = filteredList.filter(prestamo => prestamo.finalizado);
    }

    // Filtrar por rango de fechas
    if (this.fechaInicio && this.fechaFin) {
      const startDate = new Date(this.fechaInicio);
      const endDate = new Date(this.fechaFin);

      // Verificar validez de las fechas
      if (this.isValidDate(startDate) && this.isValidDate(endDate)) {
        filteredList = filteredList.filter(prestamo => {
          const prestamoDate = new Date(prestamo.fecha_finalizacion);
          return prestamoDate >= startDate && prestamoDate <= endDate;
        });
      }
    }

    return filteredList;
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

  ingresarPrestamo(){
    this.mostrarFormularioIngreso = !this.mostrarFormularioIngreso;
    this.registerFormIn.reset();
    console.log(this.dispositivos);
  }
  edit(index: number) {
    this.mostrarFormularioEditar = true;
    this.selectedPrestamo = this.prestamos[index];
    console.log(this.selectedPrestamo.fecha_finalizacion);
    console.log(index);

    console.log(this.formatDate(this.selectedPrestamo.fecha_finalizacion));
    this.filaEditada = index;
    const prestamoSeleccionado = this.prestamos[index]; // Suponiendo que prestamos es el array de datos
    console.log(prestamoSeleccionado);
    this.registerForm.patchValue({
      beneficiario: prestamoSeleccionado.persona.id_persona,
      dispositivo: prestamoSeleccionado.dispositivo.idDispositivo,
      // zona_segura:prestamoSeleccionado.zona_segura.id_zona_segura,
      estado_devolucion:prestamoSeleccionado.estado_devolucion,
      fecha: this.formatDate(this.selectedPrestamo.fecha_finalizacion),
      motivo: prestamoSeleccionado.motivo_prestamo,
      finalizado: prestamoSeleccionado.finalizado,
      // Ajusta el resto de los campos según sea necesario
    });
  }
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }



  onSubmit2(){
    console.log(this.registerFormIn.valid)
    if(this.registerFormIn.valid){
      console.log(this.idusu);
      const fecha=new Date();
      const formValues=this.registerFormIn.value;
      let prestamo:Prestamo=new Prestamo();
      let dispositivoo:Dispositivo=new Dispositivo();
      prestamo.dispositivo=dispositivoo;
      let personaa:Persona=new Persona();
      prestamo.persona=personaa;
      let usuarioo:Usuario=new Usuario();
      // prestamo.usuario=usuarioo;

      prestamo.dispositivo.idDispositivo=formValues.dispositivo;
      prestamo.persona.id_persona=formValues.beneficiario;
      prestamo.fecha_finalizacion=new Date(formValues.fecha);
      prestamo.motivo_prestamo=formValues.motivo;
      // prestamo.usuario.id_usuario=this.idusu;
      prestamo.fecha_prestamo=fecha;
      this.prestamoService.crearPrestamo(prestamo).subscribe({
        next:(userData)=>{
          console.log('Datos de prestamo recibidos:', userData);
          this.prestamoService.getPrestamos().subscribe(
            prestamo => {
              this.prestamos = prestamo.sort((a, b) => {
                if (a.finalizado !== b.finalizado) {
                  return a.finalizado ? 1 : -1;
                }
                this.ngOnInit();
                // Si son iguales en finalizado, ordenar por fecha de devolución ascendente
                const fechaDevolucionA = new Date(a.fecha_finalizacion);
                const fechaDevolucionB = new Date(b.fecha_finalizacion);
                return fechaDevolucionA.getTime() - fechaDevolucionB.getTime();

              }); // @ts-ignore
            }
          );
          // Swal.fire({
          //   icon: 'success',
          //   title: '¡Creacion de prestamo exitosa!',
          //   text: 'EXITO',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // })
          this.toggleToast();
        },
        error:(errorData)=>{
          console.error('Error al crear prestamo:', errorData);
          // Swal.fire({
          //   icon: 'error',
          //   title: 'Error al crear prestamo',
          //   text: 'Error al ingresar los datos.',
          //   confirmButtonColor: '#3085d6',
          //   confirmButtonText: 'OK'
          // });
          this.toggleToast2();
        },
        complete:()=>{
          console.info("Creacion completa");
          this.ingresarPrestamo();
        }
      })
    }else{
      this.markFormGroupTouched(this.registerFormIn);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onSubmit(){
    console.log(this.idusu);
    const fecha=new Date();
    const formValues=this.registerForm.value;
    if(this.registerForm.valid){
    let prestamo:Prestamo=new Prestamo();
    let dispositivoo:Dispositivo=new Dispositivo();
    prestamo.dispositivo=dispositivoo;
    let personaa:Persona=new Persona();
    prestamo.persona=personaa;
    let usuarioo:Usuario=new Usuario();
    // prestamo.usuario=usuarioo;

    prestamo.dispositivo.idDispositivo=formValues.dispositivo;
    prestamo.persona.id_persona=formValues.beneficiario;
    prestamo.fecha_finalizacion=formValues.fecha;
    prestamo.motivo_prestamo=formValues.motivo;
    prestamo.estado_devolucion=formValues.estado_devolucion;
    prestamo.finalizado=formValues.finalizado;
    // prestamo.usuario.id_usuario=this.idusu;
    this.prestamoService.editPrestamo(this.selectedPrestamo.id_prestamo,prestamo).subscribe({
      next:(userData)=>{
        console.log('Datos de prestamo recibidos:', userData);
        this.prestamoService.getPrestamos().subscribe(
          prestamo => {
            this.prestamos = prestamo.sort((a, b) => {
              if (a.finalizado !== b.finalizado) {
                return a.finalizado ? 1 : -1;
              }
              // Si son iguales en finalizado, ordenar por fecha de devolución ascendente
              const fechaDevolucionA = new Date(a.fecha_finalizacion);
              const fechaDevolucionB = new Date(b.fecha_finalizacion);
              return fechaDevolucionA.getTime() - fechaDevolucionB.getTime();

            }); // @ts-ignore
          }
        );
      //   Swal.fire({
      //     icon: 'success',
      //     title: '¡Edicion de prestamo exitosa!',
      //     text: 'EXITO',
      //     confirmButtonColor: '#3085d6',
      //     confirmButtonText: 'OK'
      // })
        this.toggleToast();
      },
      error:(errorData)=>{
        console.error('Error al editar prestamo:', errorData);
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error al edita prestamo',
      //     text: 'Error al ingresar los datos.',
      //     confirmButtonColor: '#3085d6',
      //     confirmButtonText: 'OK'
      // });
        this.toggleToast2();

      },
      complete:()=>{
        console.info("Edicion completa");
        this.filaEditada = null;
        this.mostrarFormularioEditar=false;
      }
    })}else{
      this.markFormGroupTouched(this.registerForm);
    }
  }
  cancelarEdicion() {
    this.filaEditada = null;
    this.mostrarFormularioEditar=false;

  }
  eliminarPrestamo(id: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: 'No se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.prestamoService.deletePrestamo(id).subscribe(
          () => {
            this.prestamoService.getPrestamos().subscribe(
              prestamo => {
                this.prestamos = prestamo.sort((a, b) => {
                  if (a.finalizado !== b.finalizado) {
                    return a.finalizado ? 1 : -1;
                  }
                  // Si son iguales en finalizado, ordenar por fecha de devolución ascendente
                  const fechaDevolucionA = new Date(a.fecha_finalizacion);
                  const fechaDevolucionB = new Date(b.fecha_finalizacion);
                  return fechaDevolucionA.getTime() - fechaDevolucionB.getTime();

                }); // @ts-ignore
              }
            );
            swalWithBootstrapButtons.fire({
              title: 'BORRADO!',
              text: 'El prestamo ah sido borrado.',
              icon: 'success'
            });
          },
          error => {
            console.error('Error al eliminar el prestamo', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Ah habido un error al eliminar el prestamo.',
              icon: 'error'
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Has cancelado el borrado del prestamo :)',
          icon: 'error'
        });
      }
    });
  }
}
