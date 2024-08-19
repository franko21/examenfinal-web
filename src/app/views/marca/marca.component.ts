import { Component } from '@angular/core';
import {
  ButtonDirective,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent,

} from "@coreui/angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IconDirective} from "@coreui/icons-angular";
import {NgForOf, NgIf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {MarcaService} from "../../service/marca.service";
import {Marca} from "../../model/marca.model";

@Component({
  selector: 'app-marca',
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
  providers:[MarcaService],
  templateUrl: './marca.component.html',
  styleUrl: './marca.component.scss'
})
export class MarcaComponent {
  marcaForm: FormGroup;
  marcas: Marca[] = [];
  isEditing = false;
  marcaToEdit: Marca | null = null;

  constructor(private fb: FormBuilder, private marcaService: MarcaService) {
    this.marcaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getMarcas();
  }

  getMarcas() {
    this.marcaService.listar().subscribe({
      next: (marcas) => this.marcas = marcas,
      error: (err) => console.error('Error al listar marcas:', err)
    });
  }

  onSubmit() {
    if (this.isEditing && this.marcaToEdit) {
      this.marcaToEdit.nombre = this.marcaForm.value.nombre;
      this.marcaService.editar(this.marcaToEdit).subscribe({
        next: (marcaEditada) => {
          const index = this.marcas.findIndex(m => m.id === marcaEditada.id);
          if (index !== -1) {
            this.marcas[index] = marcaEditada;
          }
          this.resetForm();
        },
        error: (err) => console.error('Error al editar la marca:', err)
      });
    } else {
      const nuevaMarca: Marca = {
        id: undefined, // Puede omitirse si no es necesario
        nombre: this.marcaForm.value.nombre
      };
      this.marcaService.crear(nuevaMarca).subscribe({
        next: (marcaCreada) => {
          this.marcas.push(marcaCreada);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear la marca:', err)
      });
    }
  }

  editMarca(marca: Marca) {
    this.isEditing = true;
    this.marcaToEdit = marca;
    this.marcaForm.patchValue(marca);
  }

  deleteMarca(id: number | undefined) {
    this.marcaService.eliminar(id).subscribe({
      next: () => this.marcas = this.marcas.filter(m => m.id !== id),
      error: (err) => console.error('Error al eliminar la marca:', err)
    });
  }

  resetForm() {
    this.isEditing = false;
    this.marcaToEdit = null;
    this.marcaForm.reset();
  }
}
