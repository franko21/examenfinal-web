import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Vehiculo} from "../../model/vehiculo.model";
import {VehiculoService} from "../../service/vehiculo.service";
import {
  ButtonDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {NgForOf, NgIf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [    ButtonDirective,
    FormControlDirective,
    FormsModule,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NgForOf,
    NgIf,
    NgxPaginationModule,
    ReactiveFormsModule,
    ToastBodyComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToasterComponent],
  providers:[VehiculoService],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.scss'
})
export class VehiculoComponent {
  vehiculoForm: FormGroup;
  vehiculos: Vehiculo[] = [];
  isEditing = false;
  vehiculoToEdit: Vehiculo | null = null;

  constructor(private fb: FormBuilder, private vehiculoService: VehiculoService) {
    this.vehiculoForm = this.fb.group({
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      descripcion: [''],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getVehiculos();
  }

  getVehiculos() {
    this.vehiculoService.listar().subscribe({
      next: (vehiculos) => this.vehiculos = vehiculos,
      error: (err) => console.error('Error al listar vehículos:', err)
    });
  }

  onSubmit() {
    if (this.isEditing && this.vehiculoToEdit) {
      const vehiculoEditado = { ...this.vehiculoToEdit, ...this.vehiculoForm.value };
      this.vehiculoService.editar(vehiculoEditado).subscribe({
        next: (vehiculoActualizado) => {
          const index = this.vehiculos.findIndex(v => v.id === vehiculoActualizado.id);
          if (index !== -1) {
            this.vehiculos[index] = vehiculoActualizado;
          }
          this.resetForm();
        },
        error: (err) => console.error('Error al editar el vehículo:', err)
      });
    } else {
      const nuevoVehiculo: Vehiculo = this.vehiculoForm.value;
      this.vehiculoService.crear(nuevoVehiculo).subscribe({
        next: (vehiculoCreado) => {
          this.vehiculos.push(vehiculoCreado);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear el vehículo:', err)
      });
    }
  }

  editVehiculo(vehiculo: Vehiculo) {
    this.isEditing = true;
    this.vehiculoToEdit = vehiculo;
    this.vehiculoForm.patchValue(vehiculo);
  }

  deleteVehiculo(id: number | undefined) {
    if (id !== undefined) {
      this.vehiculoService.eliminar(id).subscribe({
        next: () => this.vehiculos = this.vehiculos.filter(v => v.id !== id),
        error: (err) => console.error('Error al eliminar el vehículo:', err)
      });
    }
  }

  resetForm() {
    this.isEditing = false;
    this.vehiculoToEdit = null;
    this.vehiculoForm.reset();
  }
}
