async function dragAndDrop(className, restrictionSelector, dotNetHelper) {
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                const index = parseInt(event.target.dataset.index);
                dotNetHelper.invokeMethodAsync('OnDragStartAsync', index);
            },
            end(event) {
                dotNetHelper.invokeMethodAsync('OnDragEndAsync');
            },
            move(event) {
                // Récupération de la position prédécente éventuelle
                var initialTransform = event.target.style.transform || "translate(0px, 0px)";
                // Calcul des nouvelles coordonnées x/y
                const response = dotNetHelper.invokeMethod('OnMove', event.dx, event.dy, initialTransform);
                event.target.style.transform = response.result;
            },
    }, modifiers: [
            interact.modifiers.restrictRect({
            restriction: restrictionSelector,
            endOnly: true
        })]
    })
};

function dropZone(dropTarget, dotNetHelper) {
    interact(dropTarget)
        .dropzone({
            ondragenter: function (event) {
                // Appelé quand un draggable rentre dans la zone, la dropzone est bien récupérée ici                
                var draggableElement = event.relatedTarget
                var dropzoneElement = event.target

                dropzoneElement.classList.add('drop-target')
                draggableElement.classList.add('can-drop')
            },
            ondrop: function (event) {
                // Si on repose dans la même div que la ou on vient de le prendre,
                // On enlève la transformation pour le draggable reprenne sa place
                // ("A la main" ou généré par la restriction)
                if (event.relatedTarget.parentElement == event.target) {
                    event.relatedTarget.style.transform = '';
                    console.log("removed transform on drop");
                    event.stopPropagation();
                }

                // TODO : Changer la facon dont on passe la réf à runtime .NET pour gérer le passage d'une liste à l'autre (entre autres)
                const item = { id: parseInt(event.relatedTarget.dataset.identifier), name: event.relatedTarget.dataset.displayName }
                console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);
                dotNetHelper.invokeMethodAsync('HandleDrop', item);
            }
        })
        .on('dropactivate', function (event) {
            event.target.classList.add('drop-activated');
        })
};