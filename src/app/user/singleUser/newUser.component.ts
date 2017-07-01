import { Component, OnInit} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { UserService} from '../user.service';
import { Companie } from '../../companie/companie.model';
import { CompanieService } from '../../companie/companie.service';

import { ToastsManager} from 'ng2-toastr';

import { MdDialog} from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { User, TypeUser } from '../user.model';
//import { Form } from '../../form/form.model';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DeleteDialog } from '../../deleteDialog/deleteDialog.component'


@Component({
  selector: 'app-users',
  templateUrl: './newUser.component.html',
  styleUrls: ['../user.component.css'],

})

export class NewUserComponent implements OnInit {
  //fetchedUser = new User()
  //fetchedUser : User;
  fetchedCompanies: Companie[] = []
  autocompleteCompanie: string = '';

  fetchedTypeUsers = []
  autocompleteTypeUser: string = '';




  companieIndexToSelect = ''
  typeUserDropDown = ''
  typeUser = TypeUser

  fetchedUser: User = new User();

  public myForm: FormGroup;

  constructor(
    private userService: UserService,
    private toastr: ToastsManager,
    public dialog: MdDialog,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private authService: AuthService,
    private companieService: CompanieService,
  ) {
  }


  searchCompanies() {
    if(!this.autocompleteCompanie) {
      this.fetchedCompanies = []
    } else {
      let search = {
          search: this.autocompleteCompanie,
        };
      this.getCompanies(1, search)
    }
  }

  getCompanies(page: number, search: any) {
    this.companieService.getCompanies(page, search)
      .subscribe(
        res => {
          this.fetchedCompanies = res.data
        },
        error => {
          console.log(error);
        }
      );
  }
  selectCompanie(companie: Companie) {
    this.autocompleteCompanie = ''
    this.fetchedCompanies = []
    this.fetchedUser.companies.push(companie)
  }

  removeCompanie(i: number) {
    this.fetchedUser.companies.splice(i, 1);
  }







  // autocolplete typeUser
  searchTypeUser() {
    if(!this.autocompleteTypeUser) {
      this.fetchedTypeUsers = []
    } else {
      this.fetchedTypeUsers = this.typeUser.filter((el) =>
        el.toLowerCase().indexOf(this.autocompleteTypeUser.toLowerCase()) > -1
      );
    }
  }
  selectTypeUser(typeUser) {
    this.autocompleteTypeUser = '';
    this.fetchedTypeUsers = [];
    this.fetchedUser.type.push(typeUser);
  }
  removeTypeUser(i: number) {
    this.fetchedUser.type.splice(i, 1);
  }
  // autocolplete typeUser





  ngOnInit() {
    this.myForm = this._fb.group({
        email: [this.emailValidator],

        profile: this._fb.group({
            colorCalendar: [''],
            name: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(3)]],
            phoneNumber: [''],
            // parentUser: this._fb.array([]),

        })
    })

    // let userId = this.authService.currentUser.userId
    // this.companieService.getCompanieByUserId(userId)
    // this.companieService.getCompanieForCurrentUser()
    // .subscribe(
    //   (data => {
    //     this.fetchedCompanies = data
    //
    //     if(this.fetchedCompanies.length)
    //       this.companieIndexToSelect = this.fetchedCompanies[0]._id
    //     // Ok mes tes clients sont dans quel salon? ==> je prends le premier salon qui nest pas HQ
    //     // if(data.length)
    //     //   this.fetchedCompanie = data[0]
    //   })
    // )

    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']) {
        this.getUser(params['id'])
      }

    })
  }


  emailValidator(control: any) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  goBack() {
    this.location.back();
  }

  openDialogDelete(){
    let this2 = this
    let dialogRefDelete = this.dialog.open(DeleteDialog)
    dialogRefDelete.afterClosed().subscribe(result => {
      if(result) {
        this.onDelete(this.fetchedUser._id).then(function(){
          this2.router.navigate(['user']);
        })

      }
    })
  }

  saveAndCreateProject() {
    this.save()
    this.router.navigate(['project/new/' + this.fetchedUser._id])

  }
  save() {

    //console.log(this.typeUserDropDown)
    //this.fetchedUser.type = [this.typeUserDropDown]
    if(this.fetchedUser._id) {
      this.userService.updateUser(this.fetchedUser)
        .subscribe(
          res => {
            this.toastr.success('Great!', res.message)
            // if(redirect == 'profile')
            //   this.router.navigate(['user/profile/' + res.obj._id])
            // if(redirect == 'project')
            //   this.router.navigate(['project/new/' + res.obj._id])
          },
          error => {
            this.toastr.error('Error!')
            console.log(error)
          }
        )
    } else {
      this.fetchedUser.role=['client']
      this.userService.saveUser(this.fetchedUser)
        .subscribe(
          res => {
            this.toastr.success('Great!', res.message)
            // if(redirect == 'profile')
            this.router.navigate(['user/newuser/' + res.obj._id])
            // if(redirect == 'project')
            //   this.router.navigate(['project/new/' + res.obj._id])
            // this.addUserIdToCompanie(res.obj)
            //this.router.navigate(['user'])
          },
          error => {
            console.log(error)
            this.toastr.error('Error!')
          }
        );
    }
  }


  navigate(id: string){
    this.router.navigate(['user/' + id])
  }



  getUser(id: string) {
    this.userService.getUser(id)
      .subscribe(
        res => {
          this.fetchedUser = res
          this.fetchedUser.type.forEach(type => {
            this.typeUserDropDown = type
          });
        },
        error => {
          console.log(error);
        }
      )
  }


  onDelete(id: string) {
    let this2 = this
    return new Promise(function(resolve, reject) {
      this2.userService.deleteUser(id)
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

}
