import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { KeycloakService } from '../../services/keycloak.service';
import { AlertController } from 'ionic-angular';
import viewGuardRules from "../../config/viewGuardRules";

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
  providers: [KeycloakService]
})
/**
 * Contains properties of the User Page.
 */
export class UserPage {
profile: any;

  /**
  * @param keycloak The Keycloak Service
  * @param alertCtrl The ionic alert controller
  * @param navCtrl The Ionic Navigation Controller
  */
  constructor(private keycloak: KeycloakService, public alertCtrl: AlertController, public navCtrl: NavController) {
    this.keycloak = keycloak;
    this.alertCtrl = alertCtrl;
    this.navCtrl = navCtrl;
    this.profile = {};
  }

  /**
   * Show user info in a popup
   */
  showUserInfo(): void {
   let alert = this.alertCtrl.create({
     title: 'User ID',
     subTitle: '<small>' + this.profile.id + '</small>',
     buttons: ['Ok']
   });
   alert.present();
 }

 /**
  * Get and format the Users profile for displaying in the UI
  */
  loadUserProfile(): void {
    this.keycloak.loadUserProfile().then((profile) => {
    console.log(profile);
      this.profile = {
        username: profile.username ? profile.username : "Unknown Username",
        firstName: profile.firstName ? profile.firstName : "Unknown First Name",
        lastName: profile.lastName ? profile.lastName : "Unknown Last Name",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbULoSv6JvrY1vESgNvye5JJBCBmjgFFgd9NvWTCBHDTYZZs7CHw",
        id: profile.id ? profile.id : "Unknown User ID",
        email: "Unknown User Email",
        job: "Unknown Job",
        summary: "Unknown Summary"
      };
    })
    .catch((err) => console.error("Error retrieving user profile", err));
    }

  /**
   * Call the loadUserProfile() funnction when the page has fully entered and is now the active page.
   */
  ionViewDidEnter(): void {
    this.loadUserProfile();
  }

  /**
  * Check Auth state before rendering the view to allow/deny access for rendering this view
  */
  ionViewCanEnter(): boolean {
    return this.keycloak.viewGuard(viewGuardRules.default);
  }

}
