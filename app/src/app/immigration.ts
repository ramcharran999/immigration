import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ImmigrationData {
  country: string;
  study: boolean;
  year: number;
  work: boolean;
}

export interface Step {
  id: string;
  name: string;
  duration: string;
  durationMonths: number;
}

// Countries with severe EB backlog (priority date retrogression)
const BACKLOG_COUNTRIES = ['India', 'China'];

function greenCardWaitYears(country: string): number {
  return BACKLOG_COUNTRIES.includes(country) ? 10 : 2;
}

@Injectable({ providedIn: 'root' })
export class Immigration {
  private dataSubject = new BehaviorSubject<ImmigrationData | null>(null);
  data$ = this.dataSubject.asObservable();

  setData(data: ImmigrationData) {
    this.dataSubject.next(data);
  }

  getSteps(): Step[] {
    const data = this.dataSubject.value;
    if (!data) return [];

    const steps: Step[] = [];
    const currentYear = new Date().getFullYear();
    const gcWaitYears = greenCardWaitYears(data.country);

    // Future start wait
    if (data.year > currentYear) {
      const waitYears = data.year - currentYear;
      steps.push({
        id: 'wait',
        name: 'Prepare & wait to begin process',
        duration: `${waitYears} year${waitYears > 1 ? 's' : ''}`,
        durationMonths: waitYears * 12,
      });
    }

    if (data.study) {
      steps.push({
        id: 'f1',
        name: 'Apply for F-1 Student Visa',
        duration: '1–3 months',
        durationMonths: 2,
      });
      steps.push({
        id: 'study',
        name: 'Complete studies in the US',
        duration: '2–5 years',
        durationMonths: 48,
      });
      steps.push({
        id: 'opt',
        name: 'Optional Practical Training (OPT)',
        duration: '12 months (24 mo. STEM extension)',
        durationMonths: 12,
      });
      if (data.work) {
        steps.push({
          id: 'h1b',
          name: 'H-1B Visa Lottery & Approval',
          duration: '3–6 months',
          durationMonths: 5,
        });
        steps.push({
          id: 'h1b_work',
          name: 'Work on H-1B status',
          duration: '3 years (renewable once)',
          durationMonths: 36,
        });
        steps.push({
          id: 'perm',
          name: 'PERM Labor Certification',
          duration: '8–14 months',
          durationMonths: 11,
        });
        steps.push({
          id: 'i140',
          name: 'I-140 Immigrant Petition',
          duration: '6–12 months',
          durationMonths: 9,
        });
        steps.push({
          id: 'gc_wait',
          name: `Wait for Green Card priority date (${data.country})`,
          duration: gcWaitYears >= 8 ? `${gcWaitYears}–15+ years` : `${gcWaitYears}–4 years`,
          durationMonths: gcWaitYears * 12,
        });
        steps.push({
          id: 'gc',
          name: 'Adjust Status / Receive Green Card',
          duration: '8–24 months',
          durationMonths: 16,
        });
      } else {
        steps.push({
          id: 'gc_other',
          name: 'Apply for Green Card (family/diversity lottery)',
          duration: '1–5 years',
          durationMonths: 36,
        });
      }
    } else if (data.work) {
      steps.push({
        id: 'h1b',
        name: 'H-1B Visa Sponsorship & Lottery',
        duration: '3–6 months',
        durationMonths: 5,
      });
      steps.push({
        id: 'h1b_work',
        name: 'Work on H-1B status',
        duration: '3 years (renewable once)',
        durationMonths: 36,
      });
      steps.push({
        id: 'perm',
        name: 'PERM Labor Certification',
        duration: '8–14 months',
        durationMonths: 11,
      });
      steps.push({
        id: 'i140',
        name: 'I-140 Immigrant Petition',
        duration: '6–12 months',
        durationMonths: 9,
      });
      steps.push({
        id: 'gc_wait',
        name: `Wait for Green Card priority date (${data.country})`,
        duration: gcWaitYears >= 8 ? `${gcWaitYears}–15+ years` : `${gcWaitYears}–4 years`,
        durationMonths: gcWaitYears * 12,
      });
      steps.push({
        id: 'gc',
        name: 'Adjust Status / Receive Green Card',
        duration: '8–24 months',
        durationMonths: 16,
      });
    } else {
      steps.push({
        id: 'visa',
        name: 'Research eligible visa category',
        duration: '1–3 months',
        durationMonths: 2,
      });
      steps.push({
        id: 'gc_other',
        name: 'Apply for Green Card (family / diversity lottery)',
        duration: '1–10 years',
        durationMonths: 60,
      });
    }

    // Naturalization is always the final step after green card
    steps.push({
      id: 'n400',
      name: 'Hold Green Card 5 years, then file N-400 for Naturalization',
      duration: '5 years + 8–24 months processing',
      durationMonths: 70,
    });

    return steps;
  }

  getTotalEstimate(): string {
    const steps = this.getSteps();
    const totalMonths = steps.reduce((sum, s) => sum + s.durationMonths, 0);
    const years = Math.round(totalMonths / 12);
    return `~${years} years`;
  }

  getNaturalizationYear(): number | null {
    const data = this.dataSubject.value;
    if (!data) return null;
    const steps = this.getSteps();
    const totalMonths = steps.reduce((sum, s) => sum + s.durationMonths, 0);
    return data.year + Math.round(totalMonths / 12);
  }
}