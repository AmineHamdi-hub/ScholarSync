import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EvenementService } from '../services/event.service';
import { Evenement } from '../models/Evenement';
import { EventFormDialogComponent } from '../shared/dialogs/event-form-dialog.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          stagger('100ms', animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class EventsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'titre', 'dateEvenement', 'actions'];
  dataSource = new MatTableDataSource<Evenement>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Stats
  totalEvents: number = 0;
  upcomingEvents: number = 0;
  latestEvent: string = '-';

  constructor(private eventService: EvenementService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchEvents(): void {
    this.eventService.getEvenements().subscribe((data: Evenement[]) => {
      this.dataSource.data = data;
      this.calculateStats(data);
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(EventFormDialogComponent, {
      width: '400px',
      data: { title: 'Create New Event' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.addEvenement(result).subscribe(() => {
          this.fetchEvents();
        });
      }
    });
  }

  onEdit(event: Evenement): void {
    const dialogRef = this.dialog.open(EventFormDialogComponent, {
      width: '400px',
      data: { title: 'Edit Event', event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.updateEvenement(event.id as any, result).subscribe(() => {
          this.fetchEvents();
        });
      }
    });
  }

  calculateStats(data: Evenement[]): void {
    this.totalEvents = data.length;
    if (data.length > 0) {
      const today = new Date();
      this.upcomingEvents = data.filter(e => new Date((e as any).dateEvenement) > today).length;
      this.latestEvent = data[data.length - 1].titre;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvenement(id).subscribe(() => {
        this.fetchEvents();
      });
    }
  }
}
