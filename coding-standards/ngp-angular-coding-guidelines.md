# Angular Coding Standards 


## Summarized 

1. Single responsibility principle ??? a file for a component `ts/service/html/css/etc`  
Example 
    * Do not write multiple classes in same component class 
    * Do not write template data or css style in component class 

2. Small functions (75 lines max) 

3. Naming conventions - file names:  
    1. . (dot) to categorize type and - (dash) to sperate names.  
    Example:  
        * `hero-list.component.ts(HeroListComponent)`
        * `hero-list.component.html`
        * `hero-list.service.ts(HeroListService)`
        * `hero-list.spec.ts`
        * `hero-list.e2e-spec.ts`
        * `movie.module.ts`
        * `movie-routing.module.ts`

4. Naming conventions ??? class members:  
    1. Variable and function names camel cased.
    2. Constants and global variables upper case, underscore separated.  
    Example:  
        * name, age, firstName, lastName etc 
        * MAX_VALUE, MIN_COUNT etc 
        * getName(), setName($name:string) etc 

5. Use primitive data types,  
Example:  
    * string, number, boolean. Do not use String, Number or Boolean. 

6. Component selector ??? use hyphenated/ dashed-case for naming.  
Example:  
    * `app-hero`, `app-hero-list`.  
    Helps browser to understand its custom element. Avoids unnecessary lookups. 

7. Directive selector ??? use lower camel cased.  
Example:  
    * `appSlideIn`, `appTextValidate` etc 

8. Pipe Names ??? lower camel cased.  
Example:  
    `appLowerCase`, `appDecimalSeparator` etc  

9. Structuring ???  
    1. Name and create folders in a way it is- Intuitive, simple and fast accessible.

    2. Maintain component hierarchy.  
    Example:  
        * employees/employee 
        * employees/employee/ 
        * employees/employee-list 
        * employees/employee-list/employee-list-item 
    
    3. DRY - Don???t repeat yourselves.  
    Example: 
        * At minimal, no point in having, employee-view.component.html. It can just be employee.component.html. 

    4. Folders by features  
    Example: 
        * chat could be a feature, dynamic-form could be a feature, a generic confirmation-popup with utilities is simple feature., etc. 

    5. Feature modules ??? for distinct features ??? helps in lazy loading.  
    Example:  
        * Chat component can be a feature loaded on demand in application. 

    6. Shared feature modules.  
    Example:  
        * All reusable components go into the shared module. Like confirmation popup, error popup, loading mask etc., 

    7. Ref: https://angular.io/guide/styleguide#overall-structural-guidelines  

10. Avoid aliasing inputs and outputs  
Example:  
    `@Input() name;` would suffice instead of using `@Input(???name???) name;` 

11. Class member sequence  
    * Properties  
    * Public members 
    * Private members  
Example:  
```javascript
export class AppComponent {
    message: string;
    title: string;
    private name: string;
    constructor() {
    }
    getName() {
        return name;
    }
    private setName($name: string) {
        this.name = $name;
    }
}
``` 

12. Delegate complex reusable logics to service. Keep component slim and focused.  
Example:  
`this.http.get(heroesUrl).pipe( catchError(this.catchBadResponse), finalize(() => this.hideSpinner()) ).subscribe((heroes: Hero[]) => this.heroes = heroes);`  

Can be as simple as  

`this.heroService.getHeroes() .subscribe(heroes => this.heroes = heroes);`  

13. Don???t prefix outputs  
Example:  
`onSaveConfiguration` to be written as `saveConfiguration`  


14. Put presentation logic or processing in component class, do not write in template.  
Example:  
Template:  
```javascript
<div>Average power: {{totalPowers / heroes.length}}</div>
```  
should be  
Template:  
```javascript
<div>Average power: {{avgPower}}</div> 
```  
Component:  
```javascript
get avgPower() { return this.totalPowers / this.heroes.length; } 
```

15. Use services as singletons within the same injector. Use them for sharing data and functionality.  
    * Having said that, do not create services for temporary data.  

16. Provide a service with the app root injector in the `@Injectable` decorator of the service.  
    * Helps in tree shaking unused services.  
i.e.,  
```javascript
@Injectable({ providedIn: 'root' })
```  

17. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.  
i,e., Talk to server through service, instead of directly from component class.  

18. Use life cycle methods appropriately.  
Example:  
    * Doing data initialization in `ngOnInit()` not in constructor 
    * View child component to be accessed in `ngAfterViewInit()` 
    * Implement respective interfaces rightly.  

19. Data Binding - 
    1. Do not call method inside string interpolation.  
    Example:  
        `{{getFormattedDate(dateValue)}}`  
        Instead use pipe or bind to modified data directly  
        `{{dateValue | dateFormatterPipe}}` or `{{dateValueFormatted}}`

## Reference:  
https://angular.io/guide/styleguide

