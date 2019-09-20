import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FidjService } from './angular.service';
/**
 * `NgModule` which provides associated services.
 *
 * ...
 *
 * @stable
 */
let FidjModule = class FidjModule {
    constructor() {
    }
};
FidjModule = tslib_1.__decorate([
    NgModule({
        imports: [
            CommonModule
        ],
        declarations: [],
        exports: [],
        providers: [FidjService]
    }),
    tslib_1.__metadata("design:paramtypes", [])
], FidjModule);
export { FidjModule };
/**
 * module FidjModule
 *
 * exemple
 *      // ... after install :
 *      // $ npm install fidj
 *      // then init your app.js & use it in your services
 * TODO refresh gist :
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 *
 * <script src="https://gist.github.com/mlefree/ad64f7f6a345856f6bf45fd59ca8db46.js"></script>
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlkai5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9maWRqLyIsInNvdXJjZXMiOlsic2RrL2ZpZGoubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzlDOzs7Ozs7R0FNRztBQVdILElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVU7SUFDbkI7SUFDQSxDQUFDO0NBQ0osQ0FBQTtBQUhZLFVBQVU7SUFWdEIsUUFBUSxDQUFDO1FBQ04sT0FBTyxFQUFFO1lBQ0wsWUFBWTtTQUNmO1FBQ0QsWUFBWSxFQUFFLEVBQUU7UUFFaEIsT0FBTyxFQUFFLEVBQUU7UUFFWCxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7S0FDM0IsQ0FBQzs7R0FDVyxVQUFVLENBR3RCO1NBSFksVUFBVTtBQU12Qjs7Ozs7Ozs7Ozs7R0FXRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0ZpZGpTZXJ2aWNlfSBmcm9tICcuL2FuZ3VsYXIuc2VydmljZSc7XG5cblxuLyoqXG4gKiBgTmdNb2R1bGVgIHdoaWNoIHByb3ZpZGVzIGFzc29jaWF0ZWQgc2VydmljZXMuXG4gKlxuICogLi4uXG4gKlxuICogQHN0YWJsZVxuICovXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtdLFxuXG4gICAgZXhwb3J0czogW10sXG5cbiAgICBwcm92aWRlcnM6IFtGaWRqU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgRmlkak1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxufVxuXG5cbi8qKlxuICogbW9kdWxlIEZpZGpNb2R1bGVcbiAqXG4gKiBleGVtcGxlXG4gKiAgICAgIC8vIC4uLiBhZnRlciBpbnN0YWxsIDpcbiAqICAgICAgLy8gJCBucG0gaW5zdGFsbCBmaWRqXG4gKiAgICAgIC8vIHRoZW4gaW5pdCB5b3VyIGFwcC5qcyAmIHVzZSBpdCBpbiB5b3VyIHNlcnZpY2VzXG4gKiBUT0RPIHJlZnJlc2ggZ2lzdCA6XG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYuanNcIj48L3NjcmlwdD5cbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYuanNcIj48L3NjcmlwdD5cbiAqL1xuIl19