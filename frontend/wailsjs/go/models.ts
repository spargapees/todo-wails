export namespace task {
	
	export class Task {
	    id?: number;
	    title: string;
	    description: string;
	    done: boolean;
	    priority: string;
	    // Go type: time
	    created_at: any;
	    // Go type: time
	    deadline: any;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.done = source["done"];
	        this.priority = source["priority"];
	        this.created_at = this.convertValues(source["created_at"], null);
	        this.deadline = this.convertValues(source["deadline"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

