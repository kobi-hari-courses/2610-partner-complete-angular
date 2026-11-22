import { Component } from '@angular/core';
import { Calc } from '../calc/calc';
import { AdditionService } from '../../services/addition.service';

@Component({
  imports: [Calc],
  selector: 'app-group',
  styleUrl: './group.css',
  templateUrl: './group.html',
  providers: [AdditionService]
})
export class Group {}
