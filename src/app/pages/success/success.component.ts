import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-success',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="container">
      <div class="card">
        <h1>Payment Successful! 🎉</h1>
        <p>Your Pro account is now active.</p>
        <p *ngIf="loading">Activating account...</p>
        <p *ngIf="error" class="error">{{error}}</p>
        <br>
        <button (click)="goHome()" [disabled]="loading">Start Searching</button>
      </div>
    </div>
  `,
    styles: [`
    .container {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
        color: white;
    }
    .card {
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(10px);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }
    button {
        padding: 14px 28px;
        border: none;
        border-radius: 12px;
        background: #22c55e;
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
    }
    .error { color: #ef4444; }
  `]
})
export class SuccessComponent implements OnInit {
    loading = true;
    error = '';

    constructor(private http: HttpClient, private router: Router) { }

    async ngOnInit() {
        // In a real app, we'd get the email from auth state or query param
        // For this demo, let's assume we stored it in localStorage during checkout init
        const email = localStorage.getItem('user_email');

        if (!email) {
            this.error = 'No email found to activate.';
            this.loading = false;
            return;
        }

        try {
            await firstValueFrom(this.http.post('http://localhost:5081/api/billing/activate', { email }));
            this.loading = false;
        } catch (e) {
            this.error = 'Activation failed. Please contact support.';
            this.loading = false;
            console.error(e);
        }
    }

    goHome() {
        this.router.navigate(['/']);
    }
}
