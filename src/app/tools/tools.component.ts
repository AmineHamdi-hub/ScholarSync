import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { OutilService } from '../services/tool.service';
import { Outil } from '../models/Outil';
import { ToolFormDialogComponent } from '../shared/dialogs/tool-form-dialog.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger('100ms', animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class ToolsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'id', 'source', 'categorie', 'actions'];
  dataSource = new MatTableDataSource<Outil>([]);
  selection = new SelectionModel<Outil>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  categories: string[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';

  // Stats
  totalTools: number = 0;
  mostUsedCategory: string = '-';
  recentlyAdded: string = '-';

  constructor(private toolService: OutilService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchTools();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchTools(): void {
    this.toolService.getOutils().subscribe((data: any[]) => {
      this.dataSource.data = data;
      this.calculateStats(data);
      this.categories = [...new Set(data.map(item => (item as any).categorie))] as string[];
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(ToolFormDialogComponent, {
      width: '400px',
      data: { title: 'Add New Tool' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.saved || result?.deleted) {
        this.fetchTools();
      }
    });
  }

  onEdit(tool: Outil): void {
    const dialogRef = this.dialog.open(ToolFormDialogComponent, {
      width: '400px',
      data: { title: 'Edit Tool', tool }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.saved || result?.deleted) {
        this.fetchTools();
      }
    });
  }

  calculateStats(data: Outil[]): void {
    this.totalTools = data.length;
    if (data.length > 0) {
      const counts = data.reduce((acc, curr) => {
        const cat = (curr as any).categorie || 'unknown';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      this.mostUsedCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
      this.recentlyAdded = (data[data.length - 1] as any).source || (data[data.length - 1] as any).nom;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchQuery = filterValue.trim().toLowerCase();
    this.updateDataSourceFilter();
  }

  applyCategoryFilter() {
    this.updateDataSourceFilter();
  }

  updateDataSourceFilter() {
    this.dataSource.filterPredicate = (data: Outil, filter: string) => {
      const src = ((data as any).source || (data as any).nom || '').toLowerCase();
      const cat = ((data as any).categorie || '').toLowerCase();
      const searchMatch = src.includes(this.searchQuery) || cat.includes(this.searchQuery);
      const categoryMatch = !this.selectedCategory || (data as any).categorie === this.selectedCategory;
      return searchMatch && categoryMatch;
    };
    this.dataSource.filter = Math.random().toString(); // Trigger filter
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this tool?')) {
      this.toolService.deleteOutil(id).subscribe(() => {
        this.fetchTools();
        this.selection.clear();
      });
    }
  }

  onBulkDelete(): void {
    const selectedIds = this.selection.selected.map(s => s.id);
    if (confirm(`Are you sure you want to delete ${selectedIds.length} tools?`)) {
      let deletedCount = 0;
      selectedIds.forEach(id => {
        this.toolService.deleteOutil(id).subscribe(() => {
          deletedCount++;
          if (deletedCount === selectedIds.length) {
            this.fetchTools();
            this.selection.clear();
          }
        });
      });
    }
  }
}
