import {Component, OnInit, Input} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import { Location } from '@angular/common';
import {Router} from '@angular/router';
import { TranslateService } from '../../translate/translate.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() nameObject: String = '';
  @Input() showHeader: Boolean = true;

  nameObjectPlur: String= ''
  nameObjectSing: String= ''

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private translateService: TranslateService,
  ) {}


  ngOnInit() {
    this.translateService.use(this.authService.getLanguage());
    this.nameObjectSing = this.translateService.instant(<string>this.nameObject)
    this.nameObjectPlur = this.translateService.instant(<string>this.nameObject)


    if(this.nameObject === 'product')
      this.nameObjectPlur = this.translateService.instant('Products')
    if(this.nameObject === 'quote')
      this.nameObjectPlur = this.translateService.instant('Quotes')
    if(this.nameObject === 'project')
      this.nameObjectPlur = this.translateService.instant('Projects')
    if(this.nameObject === 'paiementQuote')
      this.nameObjectPlur = this.translateService.instant('Paiements')
    if(this.nameObject === 'companie')
      this.nameObjectPlur = this.translateService.instant('Companies')
    if(this.nameObject === 'userCalendar')
      this.nameObjectPlur = this.translateService.instant('Calendar')
    if(this.nameObject === 'right')
      this.nameObjectPlur = this.translateService.instant('Rights')
    if(this.nameObject === 'task')
      this.nameObjectPlur = this.translateService.instant('Tasks')    

  }
  redirectCreateObj() {
    if(this.nameObject === 'product')
      this.router.navigate(['product/productSingle/']);
    if(this.nameObject === 'quote')
      this.router.navigate(['/quote/new/' ]);
    if(this.nameObject === 'paiementQuote')
      this.router.navigate(['/paiementQuote/new/']);
    if(this.nameObject === 'companie')
      this.router.navigate(['/companie/new/']);
    if(this.nameObject === 'companie')
      this.router.navigate(['/project/new/']);





  }
  goBack() {
    this.location.back();
  }

}
