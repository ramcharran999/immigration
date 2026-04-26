import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Immigration, Step } from '../immigration';
import { Subscription } from 'rxjs';

interface FlowStep {
  num: number;
  name: string;
  duration: string;
  durationMonths: number;
}

interface FlowRow {
  displaySteps: FlowStep[];
  isRtl: boolean;
}

@Component({
  selector: 'app-immigration-flowchart',
  imports: [CommonModule],
  templateUrl: './immigration-flowchart.html',
  styleUrl: './immigration-flowchart.scss',
})
export class ImmigrationFlowchart implements OnInit, OnDestroy {
  hasData = false;
  totalEstimate = '';
  naturalizationYear: number | null = null;
  flowRows: FlowRow[] = [];

  // Last-row helpers for the final L-connector
  lastRowIsRtl = false;
  lastRowNeedsL = false;   // false when last row has 1 step (already centred, no L needed)
  lastRowOffset = '';      // CSS calc() value for the edge-step centre from its edge

  private sub!: Subscription;
  private readonly PER_ROW = 3;
  private readonly H_CONN_W = 48; // px — width of each horizontal arrow connector

  constructor(private immigration: Immigration) {}

  ngOnInit() {
    this.sub = this.immigration.data$.subscribe(data => {
      if (data) {
        const steps = this.immigration.getSteps();
        this.totalEstimate = this.immigration.getTotalEstimate();
        this.naturalizationYear = this.immigration.getNaturalizationYear();
        this.hasData = true;
        this.buildRows(steps);
      } else {
        this.hasData = false;
        this.totalEstimate = '';
        this.naturalizationYear = null;
        this.flowRows = [];
        this.lastRowIsRtl = false;
        this.lastRowNeedsL = false;
        this.lastRowOffset = '';
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  stepColor(months: number): string {
    const t = Math.min(months / 120, 1);
    const hue = Math.round(120 * (1 - t));
    return `hsl(${hue}, 65%, 40%)`;
  }

  stepColorLight(months: number): string {
    const t = Math.min(months / 120, 1);
    const hue = Math.round(120 * (1 - t));
    return `hsl(${hue}, 65%, 96%)`;
  }

  private buildRows(steps: Step[]) {
    const rows: FlowRow[] = [];
    for (let i = 0; i < steps.length; i += this.PER_ROW) {
      const rowIdx = Math.floor(i / this.PER_ROW);
      const isRtl = rowIdx % 2 !== 0;
      const numbered: FlowStep[] = steps
        .slice(i, i + this.PER_ROW)
        .map((s, j) => ({
          num: i + j + 1,
          name: s.name,
          duration: s.duration,
          durationMonths: s.durationMonths,
        }));
      rows.push({ isRtl, displaySteps: isRtl ? [...numbered].reverse() : numbered });
    }
    this.flowRows = rows;

    // Pre-compute last-row connector metadata
    const last = rows[rows.length - 1];
    if (last) {
      this.lastRowIsRtl = last.isRtl;
      const n = last.displaySteps.length;
      this.lastRowNeedsL = n > 1;
      // Distance from the edge of the row to the centre of the edge step:
      //   step width = (100% - (n-1)*H_CONN_W) / n
      //   half step  = (100% - (n-1)*H_CONN_W) / (2n)
      const connPx = (n - 1) * this.H_CONN_W;
      this.lastRowOffset = n > 1
        ? `calc((100% - ${connPx}px) / ${2 * n})`
        : '50%';
    }
  }
}
