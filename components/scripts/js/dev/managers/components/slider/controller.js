X.registerModule("managers/components/slider/controller", ["managers/utils", "managers/components/slider/validator"], function () {

  X.slider.controller = function (view, model) {

	////////////////////// 
	////// Assistant methods
	function gtx () {
		return X.animate.stage.mouseX;
	}

	function gty () {
		return X.animate.stage.mouseY;
	}



	/////////////////////
	////// Entry point

	function init() {
		addHandlers();
	}

	function addHandlers() {
		view.listenToTrack(X.events.getSafeEvent('mousedown'), function () {
			
		});

		view.listenToHandle(X.events.getSafeEvent('mousedown'), function () {
			model.dragStart(gtx(), gty());

			// MOUSE MOVE HANDLER
			function moveHandler() {
				model.dragMove(gtx(), gty());
			}

			function upHandler() {
				model.dragEnd();
				document.removeEventListener(X.events.getSafeEvent('mousemove'), moveHandler);
				document.removeEventListener(X.events.getSafeEvent('mouseup'), upHandler);
			}

			// MOUSE MOVE LISTENER
			document.addEventListener(X.events.getSafeEvent('mousemove'), moveHandler);
			document.addEventListener(X.events.getSafeEvent('mouseup'), upHandler);
		});
	}

	init();

    return {
	
	};
  }

});
