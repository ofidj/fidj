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
var FidjModule = /** @class */ (function () {
    function FidjModule() {
    }
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
    return FidjModule;
}());
export { FidjModule };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlkai5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9maWRqLyIsInNvdXJjZXMiOlsic2RrL2ZpZGoubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzlDOzs7Ozs7R0FNRztBQVdIO0lBQ0k7SUFDQSxDQUFDO0lBRlEsVUFBVTtRQVZ0QixRQUFRLENBQUM7WUFDTixPQUFPLEVBQUU7Z0JBQ0wsWUFBWTthQUNmO1lBQ0QsWUFBWSxFQUFFLEVBQUU7WUFFaEIsT0FBTyxFQUFFLEVBQUU7WUFFWCxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUM7U0FDM0IsQ0FBQzs7T0FDVyxVQUFVLENBR3RCO0lBQUQsaUJBQUM7Q0FBQSxBQUhELElBR0M7U0FIWSxVQUFVO0FBTXZCOzs7Ozs7Ozs7OztHQVdHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RmlkalNlcnZpY2V9IGZyb20gJy4vYW5ndWxhci5zZXJ2aWNlJztcblxuXG4vKipcbiAqIGBOZ01vZHVsZWAgd2hpY2ggcHJvdmlkZXMgYXNzb2NpYXRlZCBzZXJ2aWNlcy5cbiAqXG4gKiAuLi5cbiAqXG4gKiBAc3RhYmxlXG4gKi9cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGVcbiAgICBdLFxuICAgIGRlY2xhcmF0aW9uczogW10sXG5cbiAgICBleHBvcnRzOiBbXSxcblxuICAgIHByb3ZpZGVyczogW0ZpZGpTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBGaWRqTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBtb2R1bGUgRmlkak1vZHVsZVxuICpcbiAqIGV4ZW1wbGVcbiAqICAgICAgLy8gLi4uIGFmdGVyIGluc3RhbGwgOlxuICogICAgICAvLyAkIG5wbSBpbnN0YWxsIGZpZGpcbiAqICAgICAgLy8gdGhlbiBpbml0IHlvdXIgYXBwLmpzICYgdXNlIGl0IGluIHlvdXIgc2VydmljZXNcbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYuanNcIj48L3NjcmlwdD5cbiAqXG4gKiA8c2NyaXB0IHNyYz1cImh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21sZWZyZWUvYWQ2NGY3ZjZhMzQ1ODU2ZjZiZjQ1ZmQ1OWNhOGRiNDYuanNcIj48L3NjcmlwdD5cbiAqL1xuIl19