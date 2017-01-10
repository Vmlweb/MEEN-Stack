//Modules
import 'jquery'
import 'ember'

//Collect globs
let Templates = (window as any).Templates
let Ember = (window as any).Ember
let jQuery = (window as any).jQuery

//Load templates
Templates(Ember)

//Remove globs
delete (window as any).Templates
delete (window as any).Ember
delete (window as any).jQuery
delete (window as any).$

export { Ember, jQuery, jQuery as $ }