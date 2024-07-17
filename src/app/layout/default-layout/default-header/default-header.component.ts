import { Component, computed, DestroyRef, ElementRef, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  CardBodyComponent,
  CardComponent,
  ThemeDirective,
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,

} from '@coreui/angular';
import { DatePipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/enviroments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Configuracion } from 'src/app/model/configuracion.model';
import { Alerta } from 'src/app/model/alerta.model';
import { AlertaService } from 'src/app/service/alerta.service';
import { ConfiguracionService } from 'src/app/service/configuracion.service';
import { Prestamo } from 'src/app/model/prestamo.model';
import { PrestamoService } from 'src/app/service/prestamo.service';
import Swal from 'sweetalert2';
import { LoginService } from "../../../views/pages/login/login.service";
import { WebSocketDispositivos } from "../../../service/WebSocketDispositivos.service";
import { MomentModule } from 'ngx-moment';
import { Subscription } from 'rxjs';
import { EstadoService } from 'src/app/service/estado.service';
import { Estado } from 'src/app/model/estado.model';
import { Howl } from 'howler';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrl: './default-header.component.scss',
  providers: [ConfiguracionService, AlertaService, PrestamoService, LoginService, AlertaService, DatePipe],
  standalone: true,
  imports: [MomentModule,
    ContainerComponent, ReactiveFormsModule, FormsModule, CommonModule, CardBodyComponent, CardComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective, ProgressComponent, NgStyle, HttpClientModule, ButtonDirective, ModalComponent, ModalHeaderComponent, ModalTitleDirective, ThemeDirective, ButtonCloseDirective, ModalBodyComponent, ModalFooterComponent]
})

export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  alertasSubscription: Subscription;

  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  public configuracion: Configuracion = new Configuracion();
  public segundo: number = 0;
  recop: number = 0;
  value = 1;
  newNotificaciones: number = 0;
  public visible = false;
  alertas: Alerta[] = [];
  alertasTotales: Alerta[] = [];
  alertSeleccionado: Alerta;
  estadoDispositivo: Estado;
  isAlertaInfo = false;

  iconoAlerta = 'assets/images/Tableta-falla.png';

  @ViewChild('alertModal') alertModal: TemplateRef<any>;
  constructor(
    private router: Router,
    private serconfig: ConfiguracionService,
    private seralerta: AlertaService,
    private serestado: EstadoService,
    private serpres: PrestamoService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private webSocket: WebSocketDispositivos

  ) {
    super();
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['oscuro', 'claro', 'auto'].includes(theme)),
        tap(theme => {
          this.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
  /// INICIO DE ALERTAS -----------------------------

  ngOnInit(): void {
    this.loadMoreAlerts(); // Cargar las primeras alertas al inicializar el componente

    // Suscribirse a las actualizaciones de alertas desde WebSocket
    this.alertasSubscription = this.webSocket.obtenerAlertas().subscribe(
      (alertas: any[]) => {
        alertas.sort((a, b) => {
          const dateA = a.fecha ? new Date(a.fecha).getTime() : 0; // Usa 0 o una fecha predeterminada si a.fecha es undefined
          const dateB = b.fecha ? new Date(b.fecha).getTime() : 0; // Usa 0 o una fecha predeterminada si b.fecha es undefined
          return dateB - dateA;
        });
        this.newNotificaciones = alertas.filter(alerta => !alerta.visto).length;
        this.alertas = alertas; // Actualizar alertas cuando se recibe una nueva lista
        this.alertasTotales = alertas;
        this.playAlertSound();
      },
      error => {
        console.error('Error al recibir alertas desde WebSocket:', error);
      }
    );
  }

  startIndex: number = 0; // Índice inicial de las alertas a mostrar
  chunkSize: number = 10; // Cantidad de alertas a cargar por cada carga
  allAlertsLoaded: boolean = false; // Variable para indicar si se han cargado todas las alertas disponibles
  loadingMore = false; // Estado de carga

  loadMoreAlerts(): void {
    if (this.allAlertsLoaded) {
      return; // No cargar más alertas si ya se han cargado todas
    }

    this.loadingMore = true; // Activar el estado de carga

    this.seralerta.getAlertas().subscribe(
      alerts => {
        this.alertasTotales = alerts;
        alerts.sort((a, b) => {
          const dateA = a.fecha ? new Date(a.fecha).getTime() : 0; // Usa 0 o una fecha predeterminada si a.fecha es undefined
          const dateB = b.fecha ? new Date(b.fecha).getTime() : 0; // Usa 0 o una fecha predeterminada si b.fecha es undefined
          return dateB - dateA;
        });
        this.newNotificaciones = alerts.filter(alerta => !alerta.visto).length;
        // Slice para obtener el próximo grupo de alertas según el startIndex y chunkSize
        const newAlerts = alerts.slice(this.startIndex, this.startIndex + this.chunkSize);

        // Agregar las nuevas alertas al arreglo existente
        this.alertas.push(...newAlerts);

        // Incrementar el startIndex para la siguiente carga
        this.startIndex += this.chunkSize;

        // Verificar si no se han devuelto más alertas que el tamaño del chunkSize
        if (alerts.length < this.startIndex) {
          this.allAlertsLoaded = true; // Marcar que se han cargado todas las alertas
        }

        this.loadingMore = false;
      },
      error => {
        console.error('Error al cargar más alertas:', error);
        this.loadingMore = false; // Asegurarse de desactivar el estado de carga en caso de error
      }
    );
  }

  onScroll(event: Event): void {
    const container = event.target as HTMLElement;

    // Calcula si el scroll está cerca del máximo de abajo con un margen de error de 20 píxeles
    const margin = 5; // Margen en píxeles desde el final
    const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + margin;

    if (atBottom && !this.allAlertsLoaded) {
      this.loadingMore = true; // Activar el estado de carga
      setTimeout(() => {
        this.loadMoreAlerts();
      }, 1000); // Tiempo en milisegundos (por ejemplo, 500ms)
    }
  }

  abrirAlertaInfo(alert: any) {
    this.alertSeleccionado = alert;
    this.serestado.buscarpornumeroserie(alert.dispositivo.numSerie).subscribe(
      estado => {
        this.estadoDispositivo = estado;
        this.isAlertaInfo = true;
      },
      error => {
        console.error('Error al asignar estado:', error);
      }
    );
  }


  cerrarAlertaInfo() {
    this.isAlertaInfo = false;
  }

  playAlertSound() {
    const sound = new Howl({
      src: ['assets/sounds/alerta7.mp3']
    });
    sound.play();
  }

  updateAlertasVistas() {
    console.log('Update alertasVistas');
    console.log(this.alertasTotales.length);

    for (const alerta of this.alertasTotales) {
      alerta.visto = true;
      this.seralerta.crear(alerta).subscribe(
        (updatedAlerta) => {
          this.newNotificaciones = 0;
        },
        (error) => {
          console.error('Error al editar alerta:', error);
          this.loadingMore = false; // Asegurarse de desactivar el estado de carga en caso de error
        }
      );
    }
  }

  /// FIN DE ALERTAS -----------------------------

  prestamos: Prestamo[] = [];
  configuraciones: Configuracion[] = [];

  showTable: boolean = false;
  toggleView() {
    this.showTable = !this.showTable;
    console.log("se esta accionando el boton editar");
  }

  mostrarconfig() {
    this.serconfig.listar().subscribe(
      configuraciones => {
        if (this.configuraciones) {
          this.configuraciones = configuraciones;
          this.configuracion = configuraciones[0];
        }
        console.log('Configuraciones:', this.configuraciones);
      },
      error => {
        console.error('Error al listar configuraciones:', error);
      }
    );


  }
  formatDate2(date: Date, format: string): string {
    return <string>this.datePipe.transform(date, format);
  }

  convertirASegundos(): number {
    return this.recop = this.value
  }

  desplegarcrud() {
    this.toggleView();
    this.resetForm();
  }


  crud_close(): void {
    this.showTable = false;
    this.mostrarconfig();


  }
  actualizartiempo() {

    const tiempo: number = this.convertirASegundos();
    if (tiempo == 0) {
      Swal.fire({
        icon: 'question',
        title: 'Valor incorrecto',
        confirmButtonText: 'OK'
      });
    } else {
      this.configuracion.tiempoRespuesta = this.convertirASegundos();
      this.serconfig.crear(this.configuracion).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Tiempo de Respuesta Actualizado',
            text: 'La configuración ha sido actualizada correctamente.',
            confirmButtonText: 'OK'
          });
          this.showTable = false; // Ocultar el formulario después de guardar
          this.resetForm()
        },

        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar la configuración.',
            confirmButtonText: 'OK'
          });
        }
      );

    }


  }

  resetForm() {
    this.value = this.configuracion?.tiempoRespuesta ?? 0;
  }



  //////////////////////////////////////////

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });




  @Input() sidebarId: string = 'sidebar1';

  public newMessages = [
    {
      id: 0,
      from: 'Jessica Williams',
      avatar: '7.jpg',
      status: 'success',
      title: 'Urgent: System Maintenance Tonight',
      time: 'Just now',
      link: 'apps/email/inbox/message',
      message: 'Attention team, we\'ll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly...'
    },
    {
      id: 1,
      from: 'Richard Johnson',
      avatar: '6.jpg',
      status: 'warning',
      title: 'Project Update: Milestone Achieved',
      time: '5 minutes ago',
      link: 'apps/email/inbox/message',
      message: 'Kudos on hitting sales targets last quarter! Let\'s keep the momentum. New goals, new victories ahead...'
    },
    {
      id: 2,
      from: 'Angela Rodriguez',
      avatar: '5.jpg',
      status: 'danger',
      title: 'Social Media Campaign Launch',
      time: '1:52 PM',
      link: 'apps/email/inbox/message',
      message: 'Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement...'
    },
    {
      id: 3,
      from: 'Jane Lewis',
      avatar: '4.jpg',
      status: 'info',
      title: 'Inventory Checkpoint',
      time: '4:03 AM',
      link: 'apps/email/inbox/message',
      message: 'Team, it\'s time for our monthly inventory check. Accurate counts ensure smooth operations. Let\'s nail it...'
    },
    {
      id: 3,
      from: 'Ryan Miller',
      avatar: '4.jpg',
      status: 'info',
      title: 'Customer Feedback Results',
      time: '3 days ago',
      link: 'apps/email/inbox/message',
      message: 'Our latest customer feedback is in. Let\'s analyze and discuss improvements for an even better service...'
    }
  ];

  public newNotifications = [
    { id: 0, title: 'New user registered', icon: 'cilUserFollow', color: 'success' },
    { id: 1, title: 'User deleted', icon: 'cilUserUnfollow', color: 'danger' },
    { id: 2, title: 'Sales report is ready', icon: 'cilChartPie', color: 'info' },
    { id: 3, title: 'New client', icon: 'cilBasket', color: 'primary' },
    { id: 4, title: 'Server overloaded', icon: 'cilSpeedometer', color: 'warning' }
  ];

  public newStatus = [
    { id: 0, title: 'CPU Usage', value: 25, color: 'info', details: '348 Processes. 1/4 Cores.' },
    { id: 1, title: 'Memory Usage', value: 70, color: 'warning', details: '11444GB/16384MB' },
    { id: 2, title: 'SSD 1 Usage', value: 90, color: 'danger', details: '243GB/256GB' }
  ];

  public newTasks = [
    { id: 0, title: 'Upgrade NPM', value: 0, color: 'info' },
    { id: 1, title: 'ReactJS Version', value: 25, color: 'danger' },
    { id: 2, title: 'VueJS Version', value: 50, color: 'warning' },
    { id: 3, title: 'Add new layouts', value: 75, color: 'info' },
    { id: 4, title: 'Angular Version', value: 100, color: 'success' }
  ];

  public logout() {
    environment.islogged = false;
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  protected readonly environment = environment;
  protected readonly sessionStorage = sessionStorage;
}
