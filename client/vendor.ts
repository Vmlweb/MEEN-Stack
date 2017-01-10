//Modules
import 'jquery'
import 'semantic'
import 'ember'
import 'ember-data'

//Collect glob
let jQuery = (window as any).jQuery
let Ember = (window as any).Ember
let DS = (window as any).DS
let Templates = (window as any).Templates

//Load templates
Templates(Ember)

export { Ember, DS, Templates, jQuery, jQuery as $ }