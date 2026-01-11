import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { EvenementService } from '../../services/event.service';

@Component({
  selector: 'app-event-form-dialog',
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
          <mat-label>Titre de l'événement</mat-label>
          <input matInput formControlName="titre" placeholder="Titre">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date</mat-label>
          <input matInput type="date" formControlName="dateEvenement">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Lieu</mat-label>
          <input matInput formControlName="lieu" placeholder="Lieu">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button *ngIf="data.event" mat-button color="warn" [disabled]="submitting" (click)="onDelete()">Delete</button>
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
export class EventFormDialogComponent {
  form: FormGroup;
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private evenementService: EvenementService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      titre: [data.event?.titre || '', Validators.required],
      dateEvenement: [data.event?.dateEvenement || data.event?.date || '', Validators.required],
      lieu: [data.event?.lieu || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    if (!this.data.event?.id) {
      this.snackBar.open('Cannot delete: missing event id', 'Close', { duration: 5000 });
      return;
    }
    if (!confirm('Are you sure you want to delete this event?')) return;
    this.submitting = true;
    this.evenementService.deleteEvenement(this.data.event.id).subscribe({
      next: () => {
        this.snackBar.open('Event deleted', 'Close', { duration: 3000 });
        this.dialogRef.close({ deleted: true });
      },
      error: (err: any) => {
        console.error('Error deleting event:', err);
        this.snackBar.open('Error deleting event', 'Close', { duration: 5000 });
        this.submitting = false;
      }
    });
  }

  onSave(): void {
    if (!this.form.valid) return;
    const payload = this.form.value;
    this.submitting = true;

    if (!this.data.event) {
      this.evenementService.addEvenement(payload).subscribe({
        next: (created) => {
          this.snackBar.open('Event created', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true, event: created });
        },
        error: (err: any) => {
          console.error('Error creating event:', err);
          this.snackBar.open('Error creating event', 'Close', { duration: 5000 });
          this.submitting = false;
        }
      });
    } else {
      const id = this.data.event.id;
      this.evenementService.updateEvenement(id, payload).subscribe({
        next: (updated) => {
          this.snackBar.open('Event updated', 'Close', { duration: 3000 });
          this.dialogRef.close({ saved: true, event: updated });
        },
        error: (err: any) => {
          console.error('Error updating event:', err);
          this.snackBar.open('Error updating event', 'Close', { duration: 5000 });
          this.submitting = false;
        }
      });
    }
  }
} 
