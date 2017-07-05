import { Component, OnInit} from '@angular/core';
import { AuthService} from '../../auth/auth.service';
import { UserService} from '../user.service';
import { PaiementService} from '../paiement.service';

import { ToastsManager} from 'ng2-toastr';

import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { User } from '../user.model';
import { Form } from '../../form/form.model';
import { Companie } from '../../companie/companie.model';
import { EditOptionsComponentDialog } from '../../form/modalLibrary/modalLibrary.component';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { CompanieService} from '../../companie/companie.service';
import { SeePictureDialogComponent } from '../../seePictureDialog/seePictureDialog.component';




@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['../user.component.css'],
})


export class PaiementComponent implements OnInit {
  //fetchedUser = new User()
  //fetchedUser : User;
  isUserBelongToHQ=false
  maxPictureToShow=3;
  instapic=1;
  companies: Companie[] = [];
  isEditMode:boolean = false
  fetchedUser : User = new User()

  public myForm: FormGroup;

  constructor(
    private userService: UserService,
    private paiementService: PaiementService,
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

  getObjects(myForm: any){
     return myForm.get('forms').controls
   }

   editMode(){
     this.isEditMode = !this.isEditMode
   }

   paiement() {
     this.userService.paiement()
       .subscribe(
         res => {
           console.log(res);
         },
         error => {
           console.log(error);
         }
       );
   }



  ngOnInit() {
    this.myForm = this._fb.group({
      lastVisit: [''],
      profile: this._fb.group({
        _profilePicture: this._fb.group({
          _id: ['', [Validators.required, Validators.minLength(5)]]
        }),
        name: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        title: ['', [Validators.required, Validators.minLength(2)]]
      }),
      forms: this._fb.array([])
    })


    this.activatedRoute.params.subscribe((params: Params) => {
      let userId = params['id']
      if(!userId)
        userId = ''
        // userId = this.authService.currentUser.userId

      this.getUser(userId)
      this.getStripeCust()
      this.getStripeCard()
      this.getStripeSubscription()
    })
  }


  stripeCust = {}
  getStripeCust() {
    this.paiementService.getStripeCust()
      .subscribe(
        res => { this.stripeCust = res },
        error => { console.log(error) }
      )
  }

  stripeCard = {}
  getStripeCard() {
    this.paiementService.getStripeCard()
      .subscribe(
        res => { this.stripeCard = res },
        error => { console.log(error) }
      )
  }
  stripeSubscription = {}
  getStripeSubscription(){
    this.paiementService.getStripeSubscription()
      .subscribe(
        res => { this.stripeSubscription = res },
        error => { console.log(error) }
      )
  }
  saveCustInStripe(){
    this.paiementService.saveCustInStripe()
      .subscribe(
        res => { console.log(res); },
        error => { console.log(error); }
      );
  }
  saveCardInStripe(){
    this.paiementService.saveCardInStripe()
      .subscribe(
        res => { console.log(res); },
        error => { console.log(error); }
      );
  }
  saveSubscriptionInStripe(){
    this.paiementService.saveSubscriptionInStripe()
      .subscribe(
        res => { console.log(res); },
        error => { console.log(error); }
      );
  }












  getUser(id: string) {
    this.userService.getUser(id)
      .subscribe(
        res => { this.fetchedUser = res },
        error => { console.log(error) }
      )
  }



  removeForm(i: number) {
      this.fetchedUser.forms.splice(i, 1)
      const control = <FormArray>this.myForm.controls['forms'];
      control.removeAt(i)
      this.save()
  }
  addForm(form: Form) {
    const control = <FormArray>this.myForm.controls['forms'];
    const addrCtrl = this._fb.group({
        // _id: ['', Validators.required],
        // owner: ['', Validators.required],
        // imagePath: ['', Validators.required],
    });
    control.push(addrCtrl);
  }


  goBack() {
    this.location.back();
  }
  seeAllPicture(){
    this.router.navigate(['user/profile/' + this.fetchedUser._id + "/userProfilePictures"]);
  }


  openPictureDialog(form : Form){
    let dialogRef = this.dialog.open(SeePictureDialogComponent)
    dialogRef.componentInstance.form = form;
    dialogRef.afterClosed().subscribe(result => {
    })
  }


  openDialog(positionImage: string) {
    if(positionImage == '_profilePicture') {
      let dialogRef = this.dialog.open(EditOptionsComponentDialog);
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          if(result.type === 'pdf') {
            this.toastr.error('No pdf!');
          } else {
            this.fetchedUser.profile._profilePicture[0] = result
            this.save()
          }


        }
      })
    } else {
      let dialogRef = this.dialog.open(EditOptionsComponentDialog);
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          if(result.type==='pdf') {
            this.toastr.error('No pdf!');
          } else {
            this.addForm(result)
            this.fetchedUser.forms.unshift(result)
            this.save()
          }

        }
      })
    }
  }

  save() {
    this.isEditMode = false
    this.userService.updateUser(this.fetchedUser)
      .subscribe(
        res => {
          this.toastr.success('Great!', res.message)
        },
        error => {console.log(error)}
      )
  }



  // setDateToday(){
  //   this.fetchedUser.lastVisit = new Date()
  //   this.userService.updateUser(this.fetchedUser)
  //     .subscribe(
  //       res => {
  //         this.toastr.success('Great!', res.message)
  //       },
  //       error => {console.log(error)}
  //     )
  // }


  // toggleFeature(){
  //   this.fetchedUser.profile.isFeatured = !this.fetchedUser.profile.isFeatured
  //   this.save()
  // }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isMyProfile() {
    if(this.fetchedUser._id === this.authService.currentUser.userId)
      return true
    return false
  }


  onDelete(id: string) {
    this.userService.deleteUser(id)
      .subscribe(
        res => {
          this.toastr.success('Great!', res.message);
        },
        error => {
          console.log(error);
        }
      );
  }



  isHQcompanie(companie: Companie) {
    if(companie.typeCompanie === 'HQ')
      return true
    return false
  }

}