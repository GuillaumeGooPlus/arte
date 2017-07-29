import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {TaskService} from '../task.service';
import {ProductService} from '../../product/product.service';
import { ProjectService} from '../../project/project.service';

import {Task} from '../task.model';

import {ToastsManager} from 'ng2-toastr';

import {MdDialog } from '@angular/material';
import {Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UserService} from '../../user/user.service';
import { QuoteService } from '../../quote/quote.service';
import { DeleteDialog } from '../../deleteDialog/deleteDialog.component';
import { User } from '../../user/user.model';
import { Quote } from '../../quote/quote.model';
import { Product } from '../../product/product.model';
import { Project } from '../../project/project.model';





@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['../task.component.css'],
})
export class TaskComponent implements OnInit {
  @Output() newTaskSaved: EventEmitter<any> = new EventEmitter();
  @Input() showHeader = true;


  statusTypes = [
    { label: 'Not Started', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Done', value: 'done' }
  ]

  showPaiements: boolean = false
  fetchedTask : Task = new Task()
  // autocompleteUser: string = '';
  // autocompleteProject: string = '';
  // fetchedProducts: Product[] = []
  // fetchedProjects: Project[] = []
  // currentUser: User = new User()
  // imgLogoUrl: string = './assets/images/profile-placeholder.jpg'
  // imgSignatureBase64Temp = ''
  // userAdmins : User[] = []
  // userManagers : User[] = []
  // userClients : User[] = []
  // usersSalesRep : User[] = []
  // userStylists : User[] = []

  myForm: FormGroup;
  autocompleteProduct: String = ''
  fetchedUsers: User[] = [];
  arrayContentToSearch =[]

  paiementsTypes = [
    { label: 'cheque', value: 'check' },
    { label: 'Espece', value: 'cash' }
]
  constructor(
    private taskService: TaskService,
    private quoteService: QuoteService,
    // private projectService: ProjectService,
    // private userService: UserService,
    // private productService: ProductService,
//    private modalService: NgbModal,
    private toastr: ToastsManager,
    public dialog: MdDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _fb: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.myForm = this._fb.group({
      description: [''],
      name: [''],
      status: [''],
      creationDateString: [''],
      endDateString: [''],


    })



    // this.fetchedTask
    // .datePaiementString =
    // this.authService
    // .isoDateToHtmlDate(this.fetchedTask.datePaiement)


    this.activatedRoute.params.subscribe((params: Params) => {
      // console.log(params)
      if(params['id'])
        this.getTask(params['id'])

    //  if(params['idProject'])
    //   this.getProject(params['idProject'])
    })
  }




  selectAssignedTo(event) {
    this.fetchedTask.assignedTos = [event]
  }


  save() {

      this.fetchedTask.dateTask
      .creationDate = this.authService
      .HTMLDatetoIsoDate(this.fetchedTask.dateTask.creationDateString)

      this.fetchedTask.dateTask
      .endDate = this.authService
      .HTMLDatetoIsoDate(this.fetchedTask.dateTask.endDateString)


    // this.fetchedTask.datePaiement = this.authService.HTMLDatetoIsoDate(this.fetchedTask.datePaiementString)
    if(this.fetchedTask._id) {
      this.taskService.updateTask(this.fetchedTask)
        .subscribe(
          res => {
            this.toastr.success('Great!', res.message)
            // this.fetchedTask = res.obj
            //this.router.navigate(['task/edit/' + this.fetchedTask._id])
          },
          error => {
            this.toastr.error('error!', error)
          }
        )
    } else {
      this.taskService.saveTask(this.fetchedTask)
        .subscribe(
          res => {
            this.toastr.success('Great!', res.message)
            // this.fetchedTask = res.obj
            // this.newTaskSaved.emit()
            // if(this.showHeader)
            //   this.router.navigate(['task/edit/' + res.obj._id])
          },
          error => {console.log(error)}
        )
    }

  }







  goBack() {
    this.location.back();
  }





  onDelete(id: string) {
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.taskService.deleteTask(id)
        .subscribe(
          res => {
            this2.toastr.success('Great!', res.message);
            resolve(res)
          },
          error => {
            console.log(error);
            reject(error)
          }
        )
      })
  }


  openDialogDelete(){
    let this2 = this
    let dialogRefDelete = this.dialog.open(DeleteDialog)
    dialogRefDelete.afterClosed().subscribe(result => {
      if(result) {
        this.onDelete(this.fetchedTask._id).then(function(){
          this2.router.navigate(['task']);
        })

      }
    })
  }




  getTask(id: string) {
    this.taskService.getTask(id)
      .subscribe(
        res => {
          this.fetchedTask = res


          this.fetchedTask.dateTask
            .creationDateString = this.authService
              .isoDateToHtmlDate(this.fetchedTask.dateTask.creationDate)

          this.fetchedTask.dateTask
            .endDateString = this.authService
              .isoDateToHtmlDate(this.fetchedTask.dateTask.endDate)



          // this.fetchedTask
          // .datePaiementString =
          // this.authService
          // .isoDateToHtmlDate(this.fetchedTask.datePaiement)
        },
        error => {
          console.log(error);
        }
      )
  }
  isAdmin() {
    return this.authService.isAdmin();
  }



}