function applyOnCardMove(event, dragManager) {
    // Récupération de la position prédécente éventuelle
    var initialTransform = event.target.style.transform || "translate(0px, 0px)";
    const response = dragManager.invokeMethod('OnCardMove', event.dx, event.dy, initialTransform);
    event.target.style.transform = response.result;
}
async function pickPoolDraggables(className, blazorComponent, dragManager) {
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                const index = parseInt(event.target.dataset.index);
                const args = { index : index, pickPoolSource : event.target.parentElement.id }; 
                blazorComponent.invokeMethodAsync('OnDragStartAsync', args);
            },
            end(event) {                
                event.target.style.transform = '';
                blazorComponent.invokeMethodAsync('OnDragEndAsync');
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

                dropzoneElement.classList.add('drop-target')
                draggableElement.classList.add('can-drop')
                console.log(draggableElement.id + ' was moved into ' + dropzoneElement.id);
            },
            ondrop: function (event) {
                console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);
                // Si on repose dans la même div que la ou on vient de le prendre,
                // ("A la main" ou généré par la restriction)
                if (event.relatedTarget.parentElement == event.target) {
                    const shouldPutBackInPlace = true;
                    if (shouldPutBackInPlace) {
                        event.relatedTarget.style.transform = '';
                    }
                    return;
                }
                const index = parseInt(event.relatedTarget.dataset.index);
                const args = { index: index, pickPoolSource: event.relatedTarget.parentElement.id }; 
                blazorComponent.invokeMethodAsync('OnDrop', args);
            }
        })
        .on('dropactivate', function (event) {
            event.target.classList.add('drop-activated');
        })
};