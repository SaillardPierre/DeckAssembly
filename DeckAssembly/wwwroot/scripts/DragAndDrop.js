function getUpperTopCoordinates(parentElement, className) {
    var elements = parentElement.getElementsByClassName(className);
    var coordinatesList = [];

    for (var i = 0; i < elements.length; i++) {
        var rect = elements[i].getBoundingClientRect();
        var x = rect.left + window.pageXOffset;
        var y = rect.top + window.pageYOffset;
        coordinatesList.push({ x: x, y: y });
    }

    return coordinatesList;
}

function applyOnCardMove(event, dragManager) {
    // Récupération de la position prédécente éventuelle
    var initialTransform = event.target.style.transform || "translate(0px, 0px)";
    const response = dragManager.invokeMethod('OnCardMove', event.dx, event.dy, initialTransform);    
    event.target.style.transform = response.result;
}
async function pickPoolDraggables(className, dropzoneClassName, blazorComponent, dragManager) {
    //var drags = document.querySelectorAll(className);
    //drags.forEach(function (div) {
    //    div.style.position = 'absolute';
    //});        
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                //event.target.style.left = event.clientX;
                //event.target.style.top = event.clientY;
                const index = parseInt(event.target.dataset.index);
                const args = { index: index, pickPoolSource: event.target.closest(dropzoneClassName).id };
                blazorComponent.invokeMethodAsync('OnDragStartAsync', args);
            },
            end(event) {
                console.log('Drag end for '+ event.target.id);

                var willBePutBackInPlace = false;
                // Changer ici le comportement par défaut
                const shouldPutBackInPlaceIfInSource = false;
                if (!event.relatedTarget) {
                    willBePutBackInPlace = true;
                }
                else {
                    const sourceDropzone = event.target.closest(dropzoneClassName)
                    const isEndedInSourceDropzone = sourceDropzone == event.relatedTarget
                    if (isEndedInSourceDropzone) {
                        willBePutBackInPlace = shouldPutBackInPlaceIfInSource;
                    }
                }
                document.querySelectorAll(className).forEach(function (div) {
                    div.style.transform = '';
                });  
                //if (willBePutBackInPlace) {
                //    event.target.style.transform = '';
                //}
                blazorComponent.invokeMethod('OnDragEndAsync');
            },
            move(event) {
                applyOnCardMove(event, dragManager);
            },
        }
    })
};

function pickPoolDropzones(className, blazorComponent) {
    interact(className)
        .dropzone({
            ondragenter: function (event) {
                // Appelé quand un draggable rentre dans la zone, la dropzone est bien récupérée ici                
                var draggableElement = event.relatedTarget
                var dropzoneElement = event.target
                var coordinatesList = getUpperTopCoordinates(dropzoneElement, 'pickPoolDraggable')
                console.log(coordinatesList);
                console.log(draggableElement.id + ' was moved into ' + dropzoneElement.id);
            },
            ondrop: function (event) {
                console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);
                // Si on repose dans la même div que la ou on vient de le prendre,
                // ("A la main" ou généré par la restriction)
                var test = event.dragEvent
                const sourceDropzone = event.relatedTarget.closest(className)
                
                //const isDroppedInSourceDropzone = sourceDropzone == event.target
                //if (isDroppedInSourceDropzone) return;

                const isEndedInSourceDropzone = sourceDropzone == event.target
                if (!isEndedInSourceDropzone) {
                    event.relatedTarget.style.transform = '';
                }
                else return;

                const index = parseInt(event.relatedTarget.dataset.index);
                const args = { index: index, pickPoolSource: sourceDropzone.id };
                //blazorComponent.invokeMethodAsync('OnDrop', args);

                blazorComponent.invokeMethod('OnDrop', args);

            }
        })
        .on('dropactivate', function (event) {
            //event.target.classList.add('drop-activated');
        })
};