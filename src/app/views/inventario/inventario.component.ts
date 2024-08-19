import { Component } from '@angular/core';
import {Vehiculo} from "../../model/vehiculo.model";
import {VehiculoService} from "../../service/vehiculo.service";
import {jsPDF} from "jspdf";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
  selector: 'app-inventario',
  standalone: true,
  imports: [
    ButtonDirective,
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
    ToasterComponent
  ],
  providers:[VehiculoService],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss'
})
export class InventarioComponent {
  vehiculos: Vehiculo[] = [];
  filteredVehiculos: Vehiculo[] = [];
  searchTerm: string = '';

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit() {
    this.loadVehiculos();
  }

  loadVehiculos() {
    this.vehiculoService.listar().subscribe(data => {
      this.vehiculos = data;
      this.filteredVehiculos = data;  // Initialize with all vehicles
    });
  }

  applyFilters() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredVehiculos = this.vehiculos.filter(vehiculo =>
      (vehiculo.modelo?.toLowerCase().includes(searchLower) || !searchLower) ||
      (vehiculo.anio?.toLowerCase().includes(searchLower) || !searchLower) ||
      (vehiculo.precio?.toString().includes(searchLower) || !searchLower) ||
      (vehiculo.descripcion?.toLowerCase().includes(searchLower) || !searchLower) ||
      (vehiculo.estado?.toLowerCase().includes(searchLower) || !searchLower)
    );
  }

  printPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Lista de Vehículos', 14, 22);

    let y = 30;
    this.filteredVehiculos.forEach(vehiculo => {
      doc.setFontSize(12);
      doc.text(`Modelo: ${vehiculo.modelo}`, 14, y);
      doc.text(`Año: ${vehiculo.anio}`, 14, y + 10);
      doc.text(`Precio: $${vehiculo.precio}`, 14, y + 20);
      doc.text(`Descripción: ${vehiculo.descripcion}`, 14, y + 30);
      doc.text(`Estado: ${vehiculo.estado}`, 14, y + 40);
      y += 50;
    });

    doc.save('vehiculos-lista.pdf');
  }
}
