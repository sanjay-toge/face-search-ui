import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
    results: any[] = [];
    groupedResults: any[] = [];

    ngOnInit() {
        const data = localStorage.getItem('results');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                this.results = parsedData.results || parsedData;
                this.groupResults();
            } catch (e) {
                console.error('Error parsing results', e);
            }
        }
    }

    groupResults() {
        const groups: { [key: string]: any } = {};

        this.results.forEach(r => {
            if (!groups[r.video_id]) {
                groups[r.video_id] = {
                    video_id: r.video_id,
                    thumbnail: `https://img.youtube.com/vi/${r.video_id}/mqdefault.jpg`,
                    occurrences: []
                };
            }
            groups[r.video_id].occurrences.push(r);
        });

        this.groupedResults = Object.values(groups);
    }
}
