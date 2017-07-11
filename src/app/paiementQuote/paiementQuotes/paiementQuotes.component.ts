import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { PaiementQuoteService} from '../../paiementQuote/paiementQuote.service';
import { PaiementQuote} from '../../paiementQuote/paiementQuote.model';
import { ToastsManager} from 'ng2-toastr';
import { MdDialog} from '@angular/material';
import { Router} from '@angular/router';
import { Location} from '@angular/common';



@Component({
  selector: 'app-paiementQuotes',
  templateUrl: './paiementQuotes.component.html',
  styleUrls: ['../../admin/admin.component.css'],
})
export class PaiementQuotesComponent implements OnInit {
  // @Input() userId = '';
  @Input() idQuote = '';
  @Input() showHeader: boolean = true;
  @Output() getPaiementQuotesCross: EventEmitter<any> = new EventEmitter();
  @Input() showCreate: boolean = true;
  
  fetchedPaiementQuotes: PaiementQuote[] = [];
  loading: boolean;
  paginationData = {
    currentPage: 1,
    itemsPerPage: 0,
    totalItems: 0
  };

  search = {
    orderBy : '',
    search: '',
    idQuote:'',
  };

  constructor(
    private paiementQuoteService: PaiementQuoteService,
    private authService: AuthService,
  //  private modalService: NgbModal,
    private toastr: ToastsManager,
    public dialog: MdDialog,
    private router: Router,
    private location: Location,
  ) {}



  ngOnInit() {
    this.getPaiementQuotesInit()
  }


  getPaiementQuotesInit(){
    let this2 = this
    setTimeout(function(){
      this2.search.idQuote = this2.idQuote
      this2.search.orderBy = 'name'
      this2.getPaiementQuotes(1, this2.search)
    }, 200);
  }
  searchPaiementQuotes(){}


  goBack() {
    this.location.back();
  }

  searchInput() {
    this.getPaiementQuotes(this.paginationData.currentPage, this.search)
  }

  orderBy(orderBy: string) {
    this.search.orderBy = orderBy
    this.getPaiementQuotes(this.paginationData.currentPage, this.search)
  }

  onDelete(id: string) {
    this.paiementQuoteService.deletePaiementQuote(id)
      .subscribe(
        res => {
          this.getPaiementQuotesInit()
          this.toastr.success('Great!', res.message);
          this.getPaiementQuotesCross.emit(this.fetchedPaiementQuotes)
          // console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }


  getPage(page: number) {
    this.loading = true;
    this.getPaiementQuotes(page, this.search);
  }


  getPaiementQuotes(page: number, search: any) {
    this.paiementQuoteService.getPaiementQuotes(page, search)
      .subscribe(
        res => {
          this.paginationData = res.paginationData;
          this.fetchedPaiementQuotes =  res.data
          this.loading = false;
          this.getPaiementQuotesCross.emit(this.fetchedPaiementQuotes)
        },
        error => {
          console.log(error);
        }
      );
  }


  isAdmin() {
    return this.authService.isAdmin();
  }


}