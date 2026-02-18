import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    file: File | null = null;
    email = '';
    error = '';
    loading = false;

    constructor(private api: ApiService, private router: Router) { }

    onFileSelected(event: any) {
        this.file = event.target.files[0];
    }

    search() {
        if (!this.file || !this.email) {
            this.error = 'Please provide both email and file.';
            return;
        }

        this.loading = true;
        this.error = '';

        this.api.search(this.file, this.email).subscribe({
            next: (res: any) => {
                localStorage.setItem('results', JSON.stringify(res));
                this.router.navigate(['/results']);
                this.loading = false;
            },
            error: (err) => {
                let errorMsg = 'An error occurred';

                // Check towards specific backend error structure or JSON parse error
                if (err.error && typeof err.error === 'object') {
                    // Start by checking if it's a progress event or valid error object
                    if (err.error.error) {
                        // Some backends wrap error in { error: "msg" }
                        errorMsg = err.error.error;
                    } else if (err.error instanceof ErrorEvent) {
                        // Client-side error
                        errorMsg = err.error.message;
                    }
                }

                // If the error is a SyntaxError (JSON parse failure), usually implies backend sent non-JSON (like "Internal Server Error")
                // Angular puts the raw text in err.error.text or we can check the message
                if (err.status === 200 && err.message?.includes('Http failure during parsing')) {
                    // Attempt to extract the text if possible, otherwise generic
                    // Verify if 'text' property exists on the error object (angular sometimes puts it there)
                    // But in strict mode, we might need a safer check.
                    // Often for 200 OK but parse error, it means the API returned a plain string.
                    // We can assume it's "Internal Server Error" or "Face not detected" if not clear.
                    errorMsg = 'Server returned an invalid response. Face might not be detected.';
                } else if (typeof err.error === 'string') {
                    errorMsg = err.error;
                }

                // Handle specific messages
                if (errorMsg.includes('limit reached')) {
                    if (confirm('Free search limit reached. Upgrade to Pro for unlimited searches?')) {
                        this.api.createCheckoutSession(this.email).subscribe({
                            next: (res: any) => window.location.href = res.url,
                            error: () => {
                                this.error = 'Failed to start checkout.';
                                this.loading = false;
                            }
                        });
                        return;
                    }
                }

                this.error = errorMsg;
                this.loading = false;
            }
        });
    }
}
