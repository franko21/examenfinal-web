import { Component } from '@angular/core';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { MapaComponent } from '../mapa/mapa.component'; 
@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [
    WidgetsDropdownComponent, MapaComponent
  ],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.scss'
})
export class MonitoreoComponent {

}
