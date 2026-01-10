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
import { PublicationService } from '../services/publication.service';
import { Publication } from '../models/Publication';
import { PublicationFormDialogComponent } from '../shared/dialogs/publication-form-dialog.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-publications',
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
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('100ms', animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class PublicationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'titre', 'auteurId', 'actions'];
  dataSource = new MatTableDataSource<Publication>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Stats
  totalPublications: number = 0;
  uniqueAuthors: number = 0;
  latestTitle: string = '-';

  constructor(private publicationService: PublicationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchPublications();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchPublications(): void {
    this.publicationService.getPublications().subscribe(data => {
      this.dataSource.data = data;
      this.calculateStats(data);
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(PublicationFormDialogComponent, {
      width: '400px',
      data: { title: 'Create New Publication' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.publicationService.addPublication(result).subscribe(() => {
          this.fetchPublications();
        });
      }
    });
  }

  onEdit(publication: Publication): void {
    const dialogRef = this.dialog.open(PublicationFormDialogComponent, {
      width: '400px',
      data: { title: 'Edit Publication', publication }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.publicationService.updatePublication(publication.id as any, result).subscribe(() => {
          this.fetchPublications();
        });
      }
    });
  }

  calculateStats(data: Publication[]): void {
    this.totalPublications = data.length;
    if (data.length > 0) {
      this.uniqueAuthors = new Set(data.map(p => (p as any).auteurId)).size;
      this.latestTitle = data[data.length - 1].titre;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this publication?')) {
      this.publicationService.deletePublication(id).subscribe(() => {
        this.fetchPublications();
      });
    }
  }
}
