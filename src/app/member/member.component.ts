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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from "@angular/router";
import { MemberService } from '../services/membre.service';
import { Member } from '../models/Membre';
import { MemberFormDialogComponent } from '../shared/dialogs/member-form-dialog.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-member',
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
    MatDialogModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class MemberComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "cin", "nom", "prenom", "typeMbr", "email", "actions"];
  dataSource = new MatTableDataSource<Member>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Stats
  totalMembers: number = 0;
  recentMember: string = '-';

  constructor(
    private membreService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchMembers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchMembers(): void {
    this.membreService.getMembers().subscribe({
      next: (data: Member[] | any) => {
        const arr = Array.isArray(data) ? data : [];
        this.dataSource.data = arr as Member[];
        this.calculateStats(arr as Member[]);
      },
      error: (err: any) => {
        this.dataSource.data = [];
        console.error('Error fetching members:', err);
        this.snackBar.open('Error fetching members. Please check if the service is running.', 'Close', { duration: 5000 });
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      width: '400px',
      data: { title: 'Create New Member' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.typeMbr === 'etudiant') {
          this.membreService.addSEtudiant(result).subscribe({
            next: () => {
              this.fetchMembers();
              this.snackBar.open('Member created successfully!', 'Close', { duration: 3000 });
            },
            error: (err: any) => {
              console.error('Error creating member:', err);
              this.snackBar.open('Error creating member. Check console for details.', 'Close', { duration: 5000 });
            }
          });
        } else {
          this.membreService.addEnseignantChercheur(result).subscribe({
            next: () => {
              this.fetchMembers();
              this.snackBar.open('Member created successfully!', 'Close', { duration: 3000 });
            },
            error: (err: any) => {
              console.error('Error creating member:', err);
              this.snackBar.open('Error creating member. Check console for details.', 'Close', { duration: 5000 });
            }
          });
        }
      }
    });
  }

  onEdit(member: Member): void {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      width: '400px',
      data: { title: 'Edit Member', member }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (member.typeMbr === 'etudiant') {
          this.membreService.updateEtudiant(member.id as any, result).subscribe({
            next: () => {
              this.fetchMembers();
              this.snackBar.open('Member updated successfully!', 'Close', { duration: 3000 });
            },
            error: (err: any) => {
              console.error('Error updating member:', err);
              this.snackBar.open('Error updating member.', 'Close', { duration: 5000 });
            }
          });
        } else {
          this.membreService.updateEnseignant(member.id as any, result).subscribe({
            next: () => {
              this.fetchMembers();
              this.snackBar.open('Member updated successfully!', 'Close', { duration: 3000 });
            },
            error: (err: any) => {
              console.error('Error updating member:', err);
              this.snackBar.open('Error updating member.', 'Close', { duration: 5000 });
            }
          });
        }
      }
    });
  }

  calculateStats(data: Member[] | null | undefined): void {
    if (!Array.isArray(data)) {
      this.totalMembers = 0;
      this.recentMember = '-';
      return;
    }

    this.totalMembers = data.length;
    if (data.length > 0) {
      this.recentMember = `${data[data.length - 1].prenom} ${data[data.length - 1].nom}`;
    } else {
      this.recentMember = '-';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this member?')) {
      this.membreService.deleteMember(id).subscribe(() => {
        this.fetchMembers();
      });
    }
  }
}
