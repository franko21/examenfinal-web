import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mapas',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './mapas.component.html',
  styleUrl: './mapas.component.scss'
})
export class MapasComponent {
  
}
