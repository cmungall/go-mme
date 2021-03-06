/* 
 * Package: bbop_mmm_requests.js
 * 
 * Namespace: bbop_mmm_requests
 * 
 * Handle requests to MMM in a somewhat structured way.
 * 
 * NOTE: This might eventually find its way into bbop-js.
 */

// if ( typeof bbop == "undefined" ){ var bbop = {}; }
// if ( typeof bbop.rest == "undefined" ){ bbop.rest = {}; }
// if ( typeof bbop.rest.response == "undefined" ){ bbop.rest.response = {}; }

/*
 * Constructor: bbop_mmm_request
 * 
 * Contructor for a GO MMM request item.
 * 
 * Arguments:
 *  entity - string
 *  operation - string
 * 
 * Returns:
 *  request object
 */
var bbop_mmm_request = function(entity, operation){
    var anchor = this;

    // "individual", "edge", "model", "relations"
    anchor._entity = entity;

    // "get", "remove", "add", "generate", etc.
    anchor._operation = operation;
    
    //	
    anchor._arguments = {};

    anchor.bundle = function(){
	return {
	    'entity': anchor._entity,
	    'operation': anchor._operation,
	    'arguments': anchor._arguments
	};
    };

    // Generic.
    anchor.add = function(key, val){
	anchor._arguments[key] = val;
    };

    anchor.model_id = function(model_id){
	anchor.add('modelId', model_id);
    };

    anchor.fact = function(sub_id, obj_id, pred_id){
	anchor.add('subject', sub_id);
	anchor.add('object', obj_id);
	anchor.add('predicate', pred_id);
    };

    anchor.individual = function(ind_id){
	anchor.add('individual', ind_id);
    };

    anchor.subject_class = function(class_id){
	anchor.add('subject', class_id);
    };

    anchor.annotation_values = function(key, val){
	// Our list of values must be defined if we go this way.
	if( ! anchor._arguments['values'] ){
	    anchor._arguments['values'] = [];
	}
	anchor._arguments['values'].push({'key': key, 'value': val});
    };

    anchor.class_expressions = function(class_id){
	// Our list of expressions must be defined if we go this way.
	if( ! anchor._arguments['expressions'] ){
	    anchor._arguments['expressions'] = [];
	}
	var expression = {
	    'type': 'class',
	    'literal': class_id
	};
	anchor._arguments['expressions'].push(expression);
    };

    anchor.svf_expressions = function(class_id, property_id){
	// Our list of expressions must be defined if we go this way.
	if( ! anchor._arguments['expressions'] ){
	    anchor._arguments['expressions'] = [];
	}
	var expression = {
	    'type': 'svf',
	    'literal': class_id,
	    'onProp': property_id
	};
	anchor._arguments['expressions'].push(expression);
    };
};

/*
 * Constructor: bbop_mmm_request
 * 
 * Contructor for a GO MMM request item.
 * 
 * Arguments:
 *  entity - string
 *  operation - string
 * 
 * Returns:
 *  request object
 */
var bbop_mmm_request_set = function(user_id, intention){
    var anchor = this;

    var each = bbop.core.each;

    anchor._user_id = user_id;
    anchor._intention = intention;
    anchor._requests = [];
    
    anchor.add = function(req){
	anchor._requests.push(req);
    };

    anchor.callable = function(){

	// Ready the base return.
	var rset = {
	    'uid': anchor._user_id,
	    'intention': anchor._intention
	};

	// Add a JSON stringified request arguments.
	var reqs = [];
	each(anchor._requests,
	     function(req){
		 reqs.push(req.bundle());
	     });
	var str = bbop.json.stringify(reqs);
	var enc = encodeURIComponent(str);
	rset['requests'] = enc;

	return rset;
    };
};

