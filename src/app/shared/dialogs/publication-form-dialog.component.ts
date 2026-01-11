import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publication-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre de la publication</mat-label>
          <input matInput formControlName="titre" placeholder="Titre">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>ID de l'auteur</mat-label>
          <input matInput type="number" formControlName="auteurId" placeholder="Auteur ID">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button *ngIf="data.publication" mat-button color="warn" [disabled]="submitting" (click)="onDelete()">Delete</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid || submitting" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class PublicationFormDialogComponent {
  form: FormGroup;
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PublicationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private publicationService: PublicationService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      titre: [data.publication?.titre || '', Validators.required],
      auteurId: [data.publication?.auteurId || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    if (!this.data.publication?.id) {
      this.snackBar.open('Cannot delete: missing publication id', 'Close', { duration: 5000 });
      return;
    }
    if (!confirm('Are you sure you want to delete this publication?')) return;
    this.submitting = true;
    this.publicationService.deletePublication(this.data.publication.id).subscribe({
      next: () => {
        this.snackBar.open('Publication deleted', 'Close', { duration: 3000 });
        this.dialogRef.close({ deleted: true });
      },
      error: (err: any) => {
        console.error('Error deleting publication:', err);
        this.snackBar.open('Error deleting publication', 'Close', { duration: 5000 });
        this.submitting = false;
      }
    });
  }

  onSave(): void {
    if (!this.form.valid) return;
    const payload = this.form.value;
    this.submitting = true;

    if (!this.data.publication) {
      // Create
      this.publicationService.addPublication(payload).subscribe({
        next: (created) => {
          this.snackBar.open('Publication created', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true, publication: created });
        },
        error: (err: any) => {
          console.error('Error creating publication:', err);
          this.snackBar.open('Error creating publication', 'Close', { duration: 5000 });
          this.submitting = false;
        }
      });
    } else {
      // Update
      const id = this.data.publication.id;
      this.publicationService.updatePublication(id, payload).subscribe({
        next: (updated) => {
          this.snackBar.open('Publication updated', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true, publication: updated });
        },
        error: (err: any) => {
          console.error('Error updating publication:', err);
          this.snackBar.open('Error updating publication', 'Close', { duration: 5000 });
          this.submitting = false;
        }
      });
    }
  }
} 
