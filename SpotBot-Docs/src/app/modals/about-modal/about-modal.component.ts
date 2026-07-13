import { Component, OnInit } from '@angular/core';
import {ActiveModal} from '@healthcatalyst/cashmere';

@Component({
  selector: 'pkutil-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent implements OnInit {
  constructor(public activeModal: ActiveModal) {}
  ngOnInit(): void {}
  close(): void { this.activeModal.close()};
  cancel(): void {this.activeModal.dismiss()};
}