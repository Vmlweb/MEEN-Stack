//Modules
import 'jquery'
import 'ember'

//Collect globs
let Templates = (window as any).Templates
let Ember = (window as any).Ember
let jQuery = (window as any).jQuery

//Load templates
Templates(Ember)

export { Ember, jQuery, jQuery as $ }