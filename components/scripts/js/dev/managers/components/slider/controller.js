X.registerModule("managers/components/slider/controller", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.controller = function (view, model, data) {

	//////////////////////
	////// Variable
	var evaluateManager;
	var lastHandleX = data.handle.x;
	var lastHandleY = data.handle.y;

	// Constant
	var pixelRatio = window.devicePixelRatio || 1;

	//////////////////////
	////// Assistant methods
	function gtx () {
		return X.animate.stage.mouseX / pixelRatio;
	}

	function gty () {
		return X.animate.stage.mouseY / pixelRatio;
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

		var safeMouseMove = X.events.getSafeEvent('mousemove');
		var safeMouseUp = X.events.getSafeEvent('mouseup');
		var safeMouseDown = X.events.getSafeEvent('mousedown');

		view.listenToTrack(safeMouseDown, function () {

		});



		// MOUSE DOWN HANDLER
		view.listenToHandle(safeMouseDown, function () {

			model.dragStart(gtx(), gty());

			// MOUSE MOVE HANDLER
			function moveHandler() {
				model.dragMove(gtx(), gty());
				if (hasHandleMoved()) {
					evaluateManager.dragMove();
				}
			}

			// MOUSE UP HANDLER
			function upHandler() {
				model.dragEnd();
				evaluateManager.dragEnd();
				document.removeEventListener(safeMouseMove, moveHandler);
				document.removeEventListener(safeMouseUp, upHandler);
			}

			// MOUSE MOVE LISTENER
			document.addEventListener(safeMouseMove, moveHandler);
			document.addEventListener(safeMouseUp, upHandler);
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
