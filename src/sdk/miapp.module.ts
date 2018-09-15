import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FidjService} from './angular.service';


/**
 * `NgModule` which provides associated services.
 *
 * ...
 *
 * @stable
 */
@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],

    exports: [],

    providers: [FidjService]
})
export class FidjModule {
    constructor() {
    }
}


/**
 * module FidjModule
 *
 * exemple
 *      // ... after install :
 *      // $ npm install fidj
 *      // then init your app.js & use it in your services
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 */
