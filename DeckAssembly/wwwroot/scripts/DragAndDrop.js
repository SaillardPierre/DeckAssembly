function getUpperTopCoordinatesForList(parentElement, className) {
    var elements = parentElement.getElementsByClassName(className);
    var coordinatesList = [];

    for (var i = 0; i < elements.length; i++) {
        coordinatesList.push(getUpperTopCoordinates(elements[i]));
    }

    return coordinatesList;
}

function getUpperTopCoordinates(element) {
    var rect = element.getBoundingClientRect();
    var x = rect.left + window.pageXOffset;
    var y = rect.top + window.pageYOffset;
    return { x: x, y: y };
}

function applyOnCardMove(event, dropzoneClassName, dragManager, blazorComponent) {
    var draggable = event.target;
    var sourceDropzone = event.target.closest(dropzoneClassName);
    var dropzone = document.querySelector('.drop-available');
    if (dropzone) {
        console.log(dropzone.id);
        // TODO : Extraire tout ce qu'on fait quand en hovering dans une autre méthode
        var coordinatesList = getUpperTopCoordinatesForList(dropzone, 'pickPoolDraggable')
        var index = parseInt(draggable.dataset.index);
        var dragEnterSource = 1 // DragEnterSource.Target
        if (sourceDropzone == dropzone) {
            dragEnterSource = 0;// DragEnterSource.Self
        }
        else {
            coordinatesList.push(getUpperTopCoordinates(draggable));
        }
        const args = {
            index: index,
            dragEnterSource: dragEnterSource,
            coordinates: coordinatesList
        };
        blazorComponent.invokeMethod('GetFutureDropIndex', args);
    }
    // Récupération de la position prédécente éventuelle
    var initialTransform = event.target.style.transform || "translate(0px, 0px)";
    const response = dragManager.invokeMethod('OnCardMove', event.dx, event.dy, initialTransform);
    event.target.style.transform = response.result;
}
async function pickPoolDraggables(className, dropzoneClassName, blazorComponent, dragManager) {
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                const index = parseInt(event.target.dataset.index);
                const args = { index: index, pickPoolSource: event.target.closest(dropzoneClassName).id };
                blazorComponent.invokeMethodAsync('OnDragStartAsync', args);
            },
            end(event) {
                console.log('Drag end for ' + event.target.id);

                var draggable = event.target;
                var sourceDropzone = event.target.closest(dropzoneClassName);
                var dropzone = document.querySelector('.drop-available');

                // TODO : Tout le mic mac pour la gestion de la remise en place va finir par se faire ici

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
                
                if (willBePutBackInPlace) {
                    event.target.style.transform = '';
                    
                }
                document.querySelectorAll(className).forEach(function (div) {
                    div.style.transform = '';
                });
                blazorComponent.invokeMethod('OnDragEndAsync');
            },
            move(event) {
                applyOnCardMove(event, dropzoneClassName, dragManager, blazorComponent);
            },
        }
    })
};

function pickPoolDropzones(className, blazorComponent) {
    interact(className)
        .dropzone({
            ondragleave: function (event) {
                var dropzone = event.target;
                var draggable = event.relatedTarget;
                var sourceDropzone = event.relatedTarget.closest(className);
                //console.log(draggable.id + ' was moved out of ' + dropzone.id);
                event.target.classList.remove('drop-available');
            },
            ondragenter: function (event) {
                var dropzone = event.target;
                var draggable = event.relatedTarget;
                var sourceDropzone = event.relatedTarget.closest(className);
                //console.log(draggable.id + ' was moved into ' + dropzone.id + ' from ' + sourceDropzone.id);

                sourceDropzone.classList.remove('drop-available');
                // Ajout d'une classe récupérée plus tard pour savoir si on hover
                event.target.classList.add('drop-available');
            },
            ondrop: function (event) {
                const dropzone = event.target;
                const draggable = event.relatedTarget;
                const sourceDropzone = draggable.closest(className);            
                //console.log(draggable.id + ' was dropped into ' + dropzone.id + ' from ' + sourceDropzone.id);

                var dropEventSource = 1 // DropEventSource.Target
                if (sourceDropzone == dropzone) {
                    dropEventSource = 0;// DropEventSource.Self
                }
                const args = { dropEventSource: dropEventSource, destination: dropzone.id };
                blazorComponent.invokeMethod('OnDrop', args);
            }
        })
};