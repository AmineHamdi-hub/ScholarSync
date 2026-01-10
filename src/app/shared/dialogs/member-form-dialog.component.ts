import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/membre.service';
import { Member } from '../../models/Membre';

@Component({
  selector: 'app-member-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>CIN</mat-label>
            <input matInput formControlName="cin" placeholder="CIN">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date de Naissance</mat-label>
            <input matInput formControlName="dateNaissance" type="date">
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="nom" placeholder="Nom">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="prenom" placeholder="Prénom">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Email" type="email">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="!data.member">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" placeholder="Password">
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Member Type</mat-label>
            <mat-select formControlName="typeMbr">
              <mat-option value="etudiant">Student (Etudiant)</mat-option>
              <mat-option value="enseignant">Teacher (Enseignant)</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Student Specific Fields -->
        <div *ngIf="form.get('typeMbr')?.value === 'etudiant'" class="specific-fields">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Diplôme</mat-label>
            <input matInput formControlName="diplome" placeholder="e.g. Master, PhD">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date d'inscription</mat-label>
            <input matInput formControlName="dateInscription" type="date">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Encadrant (Enseignant)</mat-label>
            <mat-select formControlName="encadrant">
              <mat-option *ngFor="let teacher of teachers" [value]="teacher">
                {{ teacher.prenom }} {{ teacher.nom }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Teacher Specific Fields -->
        <div *ngIf="form.get('typeMbr')?.value === 'enseignant'" class="specific-fields">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Grade</mat-label>
            <input matInput formControlName="grade" placeholder="e.g. Professeur, MCA">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Établissement</mat-label>
            <input matInput formControlName="etablissement" placeholder="e.g. University of X">
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid || submitting" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 1rem;
    }
    .row {
      display: flex;
      gap: 1rem;
    }
    .row mat-form-field {
      flex: 1;
    }
    .full-width {
      width: 100%;
    }
    .specific-fields {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      margin-top: 0.5rem;
    }
  `]
})
export class MemberFormDialogComponent implements OnInit {
  form: FormGroup;
  teachers: Member[] = [];
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private membreService: MemberService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<MemberFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      cin: [data.member?.cin || '', Validators.required],
      dateNaissance: [data.member?.dateNaissance || '', Validators.required],
      nom: [data.member?.nom || '', Validators.required],
      prenom: [data.member?.prenom || '', Validators.required],
      email: [data.member?.email || '', [Validators.required, Validators.email]],
      password: [''],
      typeMbr: [data.member?.typeMbr || 'etudiant', Validators.required],
      // Etudiant fields
      diplome: [data.member?.diplome || ''],
      dateInscription: [data.member?.dateInscription || ''],
      encadrant: [data.member?.encadrant || null],
      // Enseignant fields
      grade: [data.member?.grade || ''],
      etablissement: [data.member?.etablissement || '']
    });

    if (!data.member) {
      this.form.get('password')?.setValidators([Validators.required]);
    }

    // Update validators based on type
    this.form.get('typeMbr')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });

    // Initial validator setup
    this.updateValidators(this.form.get('typeMbr')?.value);
  }

  ngOnInit(): void {
    this.membreService.getMembers().subscribe({
      next: (members: any[]) => {
        if (Array.isArray(members)) {
          this.teachers = members.filter((m: any) => m.typeMbr === 'enseignant') as Member[];
        } else {
          this.teachers = [];
        }
        setTimeout(() => this.cdr.detectChanges());
      },
      error: (err: any) => {
        this.teachers = [];
        setTimeout(() => this.cdr.detectChanges());
      }
    });
  }

  updateValidators(type: string): void {
    const etudiantFields = ['diplome', 'dateInscription'];
    const enseignantFields = ['grade', 'etablissement'];

    if (type === 'etudiant') {
      etudiantFields.forEach(f => this.form.get(f)?.setValidators([Validators.required]));
      enseignantFields.forEach(f => {
        this.form.get(f)?.clearValidators();
        this.form.get(f)?.updateValueAndValidity();
      });
    } else {
      enseignantFields.forEach(f => this.form.get(f)?.setValidators([Validators.required]));
      etudiantFields.forEach(f => {
        this.form.get(f)?.clearValidators();
        this.form.get(f)?.updateValueAndValidity();
      });
    }
    this.form.updateValueAndValidity();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      const value = this.form.value;
      const base: any = {
        cin: value.cin,
        dateNaissance: value.dateNaissance,
        nom: value.nom,
        prenom: value.prenom,
        email: value.email,
        password: value.password || undefined,
        photo: value.photo || undefined,
        cv: value.cv || undefined
      };

      let result: any;
      if (value.typeMbr === 'etudiant') {
        result = {
          ...base,
          typeMbr: 'etudiant',
          diplome: value.diplome,
          dateInscription: value.dateInscription,
          encadrantId: value.encadrant ? (value.encadrant.id || value.encadrant) : null
        };
      } else {
        result = {
          ...base,
          typeMbr: 'enseignant',
          grade: value.grade,
          etablissement: value.etablissement
        };
      }

      // Prevent mid-cycle view mutation errors by deferring the close
      this.submitting = true;
      setTimeout(() => {
        this.dialogRef.close(result);
      });
    }
  }
}
