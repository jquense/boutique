var EventEmitter = require('tiny-emitter')
  , invariant = require('invariant');

module.exports.actionsMixin = function(actions){

  return {

    bindAction(action, name = action.KEY){
      let key = action.ACTION_ID || action
      let handler = this[name]

      invariant(typeof handler === 'function'
        , 'Action `handler` must be a function, instead got: %s', typeof handler)

      if (process.env.NODE_ENV !== 'production')
        createHandlerWarning(this, name, handler)

      actions[key] = handler
    },

    bindActions(actionCreators) {
      for( let key in actionCreators ) if ( actionCreators.hasOwnProperty(key))
        this.bindAction(actionCreators[key], key)
    }
  }
}


module.exports.emitterMixin = function(){
  let emitter = new EventEmitter()
    
  return {

    emitChange() {
      emitter.emit('change')
    },

    listen(fn) {
      emitter.on('change', fn)
    },

    stopListening(fn) {
      emitter.off('change', fn)
    }
  }
}

function createHandlerWarning(instance, key, handler){
  Object.defineProperty(instance, key, {
    get() {
      console.warn(
        `Accessing an Action handler: \`${key}()\` directly is bad practice. ` + 
        `Only the dispatcher should call this method`)
      return handler
    }
  })
}
