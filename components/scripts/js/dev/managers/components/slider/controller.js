X.registerModule("managers/components/slider/controller", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.controller = function (view, model, data) {

	////////////////////// 
	////// Variable
	var evaluateManager;
	var lastHandleX = data.handle.x;
	var lastHandleY = data.handle.y;
	
	////////////////////// 
	////// Assistant methods
	function gtx () {
		return X.animate.stage.mouseX;
	}

	function gty () {
		return X.animate.stage.mouseY;
	}

	function hasHandleMoved () {

		if (lastHandleX === data.handle.x &&
		    lastHandleY === data.handle.y) {
			
			return false;

		}

		lastHandleX = data.handle.x;
		lastHandleY = data.handle.y;

		return true;
	}


	/////////////////////
	////// Entry point

	function init() {
		addHandlers();
		addEvaluate();
	}

	function addHandlers() {
		view.listenToTrack(X.events.getSafeEvent('mousedown'), function () {
			
		});

		view.listenToHandle(X.events.getSafeEvent('mousedown'), function () {
			model.dragStart(gtx(), gty());

			// MOUSE MOVE HANDLER
			function moveHandler() {
				model.dragMove(gtx(), gty());
				if (hasHandleMoved()) {
					evaluateManager.dragMove();
				}
			}

			function upHandler() {
				model.dragEnd();
				evaluateManager.dragEnd();
				document.removeEventListener(X.events.getSafeEvent('mousemove'), moveHandler);
				document.removeEventListener(X.events.getSafeEvent('mouseup'), upHandler);
			}

			// MOUSE MOVE LISTENER
			document.addEventListener(X.events.getSafeEvent('mousemove'), moveHandler);
			document.addEventListener(X.events.getSafeEvent('mouseup'), upHandler);
		});
	}

	function addEvaluate () {

		if (data.evaluate) {
		
			evaluateManager = X.slider.evaluate(data.evaluate, data.variable);
		
		} else {
		
			// Create a dummy so we don't have to define a heap of if statements
			evaluateManager = {
				"dragMove": function () {},
				"dragEnd": function () {}
			}
		
		}

	}
	
	init();

    return {
	
	};
  }

});
