import { Component, ElementRef, HostListener } from '@angular/core';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { MapaComponent } from '../mapa/mapa.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [
    WidgetsDropdownComponent,CommonModule, MapaComponent,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './monitoreo.component.html',
  styleUrl: './monitoreo.component.scss'
})
export class MonitoreoComponent {

  title = 'my-carousel-project';
  constructor(private el: ElementRef) {}
  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent) {
    // Verificar si el evento se originó dentro del contenedor específico
    const container = this.el.nativeElement.querySelector('.carousel-container');
    if (!container.contains(event.target as Node)) {
      return; // No hacer nada si el evento no se originó dentro del contenedor
    }
  
    event.preventDefault();
    event.stopPropagation();
  
    const scrollLeft = container.scrollLeft;
    const scrollFactor = 1.5;
    const scrollAmount = event.deltaY * scrollFactor;
  
    container.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }

  // Lista de cards
  cards = [
    { title: 'Card 1', text: 'This is card 1.' },
    { title: 'Card 2', text: 'This is card 2.' },
    { title: 'Card 3', text: 'This is card 3.' },
    { title: 'Card 4', text: 'This is card 4.' },
    { title: 'Card 1', text: 'This is card 1.' },
    { title: 'Card 2', text: 'This is card 2.' },
    { title: 'Card 3', text: 'This is card 3.' },
    { title: 'Card 4', text: 'This is card 4.' },
    { title: 'Card 5', text: 'This is card 5.' }
  ];

}
